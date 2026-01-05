import { Transaction, TransactionType, Budget, Investment, Debt, MonthlyStats, CategorySpending, Category } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalExpense = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateNetIncome = (transactions: Transaction[]): number => {
  return calculateTotalIncome(transactions) - calculateTotalExpense(transactions);
};

export const filterTransactionsByMonth = (transactions: Transaction[], year: number, month: number): Transaction[] => {
  return transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
};

export const filterTransactionsByYear = (transactions: Transaction[], year: number): Transaction[] => {
  return transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === year;
  });
};

export const calculateMonthlyStats = (transactions: Transaction[], months: number = 6): MonthlyStats[] => {
  const stats: MonthlyStats[] = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthTransactions = filterTransactionsByMonth(transactions, date.getFullYear(), date.getMonth());
    
    stats.push({
      month: date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
      income: calculateTotalIncome(monthTransactions),
      expense: calculateTotalExpense(monthTransactions),
      netIncome: calculateNetIncome(monthTransactions),
    });
  }
  
  return stats;
};

export const calculateCategorySpending = (
  transactions: Transaction[],
  categories: Category[]
): CategorySpending[] => {
  const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
  const totalExpense = calculateTotalExpense(transactions);
  
  const categoryMap = new Map<string, number>();
  
  expenseTransactions.forEach(t => {
    const current = categoryMap.get(t.categoryId) || 0;
    categoryMap.set(t.categoryId, current + t.amount);
  });
  
  const result: CategorySpending[] = [];
  
  categoryMap.forEach((amount, categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      result.push({
        categoryId,
        categoryName: category.name,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
        color: category.color,
      });
    }
  });
  
  return result.sort((a, b) => b.amount - a.amount);
};

export const calculateBudgetUsage = (
  budget: Budget,
  transactions: Transaction[]
): { used: number; remaining: number; percentage: number } => {
  const now = new Date();
  const budgetTransactions = filterTransactionsByMonth(transactions, now.getFullYear(), now.getMonth())
    .filter(t => t.categoryId === budget.categoryId && t.type === TransactionType.EXPENSE);
  
  const used = budgetTransactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = Math.max(0, budget.amount - used);
  const percentage = budget.amount > 0 ? (used / budget.amount) * 100 : 0;
  
  return { used, remaining, percentage };
};

export const calculateInvestmentValue = (investment: Investment): number => {
  return investment.currentPrice * investment.quantity;
};

export const calculateInvestmentProfit = (investment: Investment): number => {
  const currentValue = calculateInvestmentValue(investment);
  const purchaseValue = investment.purchasePrice * investment.quantity;
  return currentValue - purchaseValue;
};

export const calculateInvestmentProfitPercentage = (investment: Investment): number => {
  const profit = calculateInvestmentProfit(investment);
  const purchaseValue = investment.purchasePrice * investment.quantity;
  return purchaseValue > 0 ? (profit / purchaseValue) * 100 : 0;
};

export const calculateTotalDebt = (debts: Debt[]): number => {
  return debts.reduce((sum, d) => sum + d.remainingAmount, 0);
};

export const predictNextMonthExpense = (transactions: Transaction[]): number => {
  const last3Months = calculateMonthlyStats(transactions, 3);
  const avgExpense = last3Months.reduce((sum, m) => sum + m.expense, 0) / last3Months.length;
  return Math.round(avgExpense);
};

export const generateFinancialAdvice = (
  transactions: Transaction[],
  budgets: Budget[]
): string[] => {
  const advice: string[] = [];
  const now = new Date();
  const currentMonthTransactions = filterTransactionsByMonth(transactions, now.getFullYear(), now.getMonth());
  const totalExpense = calculateTotalExpense(currentMonthTransactions);
  const totalIncome = calculateTotalIncome(currentMonthTransactions);
  
  // Check if spending exceeds income
  if (totalExpense > totalIncome) {
    advice.push('⚠️ Chi tiêu tháng này vượt quá thu nhập. Hãy cân nhắc giảm chi tiêu không cần thiết.');
  }
  
  // Check budget overruns
  budgets.forEach(budget => {
    const usage = calculateBudgetUsage(budget, transactions);
    if (usage.percentage > 100) {
      advice.push(`🚨 Bạn đã vượt ngân sách cho danh mục này ${usage.percentage.toFixed(0)}%.`);
    } else if (usage.percentage > 80) {
      advice.push(`⚠️ Bạn đã sử dụng ${usage.percentage.toFixed(0)}% ngân sách. Hãy cẩn thận chi tiêu.`);
    }
  });
  
  // Savings advice
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  if (savingsRate < 10) {
    advice.push('💡 Tỷ lệ tiết kiệm của bạn thấp. Hãy cố gắng tiết kiệm ít nhất 20% thu nhập.');
  } else if (savingsRate >= 20) {
    advice.push('✅ Tuyệt vời! Bạn đang tiết kiệm được một tỷ lệ tốt.');
  }
  
  // Predict next month
  const predictedExpense = predictNextMonthExpense(transactions);
  advice.push(`📊 Dự đoán chi tiêu tháng tới: ${formatCurrency(predictedExpense)}`);
  
  if (advice.length === 1) {
    advice.unshift('✅ Tài chính của bạn đang trong tình trạng tốt!');
  }
  
  return advice;
};