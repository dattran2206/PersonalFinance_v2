import { Transaction, TransactionType, Budget, Investment, Debt, MonthlyStats, CategorySpending, Category, Account, Fund } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

// Debt/Loan related keywords to exclude from Income/Expense (Cashflow)
const DEBT_KEYWORDS = ['Đi vay', 'Cho vay', 'Trả nợ', 'Thu nợ'];

export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) =>
      t.type === TransactionType.INCOME &&
      !DEBT_KEYWORDS.some(k => t.description?.includes(k) || (t.categoryId === 'uncategorized' && t.description?.includes(k)))
    )
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalExpense = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) =>
      t.type === TransactionType.EXPENSE &&
      !DEBT_KEYWORDS.some(k => t.description?.includes(k) || (t.categoryId === 'uncategorized' && t.description?.includes(k)))
    )
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateNetIncome = (transactions: Transaction[]): number => {
  return calculateTotalIncome(transactions) - calculateTotalExpense(transactions);
};

export const filterTransactionsByMonth = (transactions: Transaction[], year: number, month: number): Transaction[] => {
  return transactions.filter(t => {
    // Manual parsing to avoid timezone issues with new Date("YYYY-MM-DD") which defaults to UTC
    const [y, m] = t.date.split('-').map(Number);
    // Note: m is 1-indexed in date string, but we compare with 0-indexed month
    return y === year && (m - 1) === month;
  });
};

export const filterTransactionsByYear = (transactions: Transaction[], year: number): Transaction[] => {
  return transactions.filter(t => {
    const [y] = t.date.split('-').map(Number);
    return y === year;
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

// Account-based fund allocation calculations
export const getAccountAllocatedAmount = (
  accountId: string,
  funds: any[]
): number => {
  return funds
    .filter(f => f.accountId === accountId && !f.isDeleted)
    .reduce((sum, f) => sum + (f.currentAmount || 0), 0);
};

export const getAccountAvailableAmount = (
  account: any,
  funds: any[]
): number => {
  const allocated = getAccountAllocatedAmount(account.id, funds);
  return account.balance - allocated;
};

export const validateFundAllocation = (
  accountId: string,
  amount: number,
  currentFundAmount: number,
  account: any,
  funds: any[]
): { valid: boolean; error?: string } => {
  if (amount < 0) {
    return { valid: false, error: 'Số tiền phải lớn hơn hoặc bằng 0' };
  }

  const allocated = getAccountAllocatedAmount(accountId, funds);
  const available = account.balance - allocated + currentFundAmount;

  if (amount > available) {
    return {
      valid: false,
      error: `Số dư khả dụng không đủ. Khả dụng: ${formatCurrency(available)}`
    };
  }

  return { valid: true };
};

/**
 * Get account summary with breakdown (total, allocated, available)
 */
export const getAccountSummary = (
  account: Account,
  funds: Fund[]
) => {
  const allocated = getAccountAllocatedAmount(account.id, funds);
  const available = account.balance - allocated;

  return {
    total: account.balance,
    allocated: allocated,
    available: available,
    funds: funds.filter(f => f.accountId === account.id && !f.isDeleted)
  };
};

/**
 * Get total assets summary across all accounts
 */
export const getTotalAssetsSummary = (
  accounts: Account[],
  funds: Fund[]
) => {
  const total = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const allocated = funds
    .filter(f => !f.isDeleted)
    .reduce((sum, f) => sum + f.currentAmount, 0);
  const available = total - allocated;

  return {
    total,
    allocated,
    available
  };
};

// ----------------------------------------
// FORECASTING & STATISTICAL HELPERS
// ----------------------------------------

/**
 * Calculates Simple Linear Regression to predict the next value
 * Returns the predicted y-value for the next x-step
 */
export const calculateLinearRegression = (data: number[]): number => {
  const n = data.length;
  if (n < 2) return data[n - 1] || 0;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = data[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Predict next value (x = n)
  return slope * n + intercept;
};

/**
 * Estimates Minimum Monthly Expenses (Essentials)
 * Based on specific keywords found in transaction categories/descriptions
 */
export const estimateMinimumMonthlyExpenses = (transactions: Transaction[], monthsData: number = 3): number => {
  // Keywords indicating Essential spending
  const ESSENTIAL_KEYWORDS = [
    'ăn', 'uống', 'thực phẩm', 'đi chợ', 'siêu thị', // Food
    'nhà', 'điện', 'nước', 'internet', 'wifi', 'gas', // Housing/Utilities
    'xăng', 'xe', 'gửi xe', 'đi lại', // Transport
    'thuốc', 'khám', 'bệnh', 'y tế', // Health
    'học', 'phí' // Education
  ];

  // Filter for Essential Expenses in the last X months
  const now = new Date();
  const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsData, 1);

  const essentialTransactions = transactions.filter(t => {
    if (t.type !== TransactionType.EXPENSE || t.isDeleted) return false;
    const tDate = new Date(t.date);
    if (tDate < cutoffDate) return false;

    // Check description or note for keywords
    // Ideally we should check Category Name, but we might only have ID here.
    // For now, rely on robust description matching + 'uncategorized' fallback
    const text = (t.description + ' ' + (t.note || '')).toLowerCase();
    return ESSENTIAL_KEYWORDS.some(k => text.includes(k));
  });

  const totalEssential = essentialTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Return average per month
  return monthsData > 0 ? totalEssential / monthsData : 0;
};
