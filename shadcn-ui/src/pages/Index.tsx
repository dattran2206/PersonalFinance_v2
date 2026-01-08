import Layout from '@/components/layout/Layout';
import OverviewCards from '@/components/dashboard/OverviewCards';
import SpendingChart from '@/components/dashboard/SpendingChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { useTransactions, useAccounts, useCategories, useInvestments, useDebts } from '@/hooks/use-db';
import {
  calculateTotalIncome,
  calculateTotalExpense,
  calculateMonthlyStats,
  filterTransactionsByMonth,
  calculateInvestmentValue,
} from '@/lib/calculations';

export default function Index() {
  const transactions = useTransactions();
  const accounts = useAccounts();
  const categories = useCategories();
  const investments = useInvestments();
  const debts = useDebts();

  if (!transactions || !accounts || !categories || !investments || !debts) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </Layout>
    )
  }

  const now = new Date();
  const currentMonthTransactions = filterTransactionsByMonth(
    transactions as any[],
    now.getFullYear(),
    now.getMonth()
  );

  // 1. Calculate Net Worth
  const totalAccountBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalInvestmentValue = investments.reduce((sum, inv) => sum + calculateInvestmentValue(inv), 0);
  // 'loan' is money owed TO us (Asset)
  const totalLoan = debts
    .filter(d => d.type === 'loan')
    .reduce((sum, d) => sum + d.remainingAmount, 0);
  // 'debt' is money we owe (Liability)
  const totalDebt = debts
    .filter(d => d.type === 'debt')
    .reduce((sum, d) => sum + d.remainingAmount, 0);

  // Net Worth = Assets - Liabilities
  const netWorth = totalAccountBalance + totalInvestmentValue + totalLoan - totalDebt;

  const monthlyIncome = calculateTotalIncome(currentMonthTransactions);
  const monthlyExpense = calculateTotalExpense(currentMonthTransactions);
  const monthlySavings = monthlyIncome - monthlyExpense;

  const monthlyStats = calculateMonthlyStats(transactions as any[], 6);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-gray-100 mb-2">Dashboard</h1>
          <p className="text-gray-500 font-sans">Chào mừng trở lại! Đây là tổng quan tài chính của bạn</p>
        </div>

        {/* Top Section: Overview Cards (Visual Rich) */}
        <OverviewCards
          totalAssets={netWorth}
          monthlyIncome={monthlyIncome}
          monthlyExpense={monthlyExpense}
          monthlySavings={monthlySavings}
        />

        {/* Main Grid: Charts & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart takes up 2 columns */}
          <div className="lg:col-span-2">
            <SpendingChart data={monthlyStats} />
          </div>

          {/* Recent Transactions takes 1 column (Sidebar style) */}
          <div className="lg:col-span-1">
            <RecentTransactions
              transactions={transactions as any[]}
              categories={categories as any[]}
              accounts={accounts as any[]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
