import Layout from '@/components/layout/Layout';
import OverviewCards from '@/components/dashboard/OverviewCards';
import { FundsSpotlight } from '@/components/dashboard/FundsSpotlight';
import SpendingChart from '@/components/dashboard/SpendingChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { useTransactions, useAccounts, useCategories, useInvestments, useDebts } from '@/hooks/use-db';
import {
  calculateTotalIncome,
  calculateTotalExpense,
  calculateMonthlyStats,
  filterTransactionsByMonth,
  calculateInvestmentValue,
  getTotalAssetsSummary,
} from '@/lib/calculations';
import { useFunds } from '@/hooks/use-db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/calculations';

import { InvestmentSummaryWidget } from '@/components/dashboard/InvestmentSummaryWidget';

export default function Index() {
  const transactions = useTransactions();
  const accounts = useAccounts();
  const categories = useCategories();
  const investments = useInvestments();
  const debts = useDebts();
  const funds = useFunds();

  if (!transactions || !accounts || !categories || !investments || !debts || !funds) {
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
  const totalInvestmentValue = investments.reduce((sum, inv) => sum + calculateInvestmentValue(inv as any), 0);
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
  const assetsSummary = getTotalAssetsSummary(accounts as any[], funds as any[] || []);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-gray-100 mb-2">Dashboard</h1>
          <p className="text-gray-500 font-sans">Chào mừng trở lại! Đây là tổng quan tài chính của bạn</p>
        </div>

        {/* Assets Breakdown Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tổng Quan Tài Sản</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span className="text-sm text-gray-500">Tổng tài sản</span>
                <span className="text-2xl font-bold">{formatCurrency(assetsSummary.total)}</span>
              </div>

              <div className="flex flex-col p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <span className="text-sm text-gray-500">Khả dụng</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(assetsSummary.available)}
                </span>
                <span className="text-xs text-gray-400">Có thể chi tiêu</span>
              </div>

              <div className="flex flex-col p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <span className="text-sm text-gray-500">Dành cho quỹ</span>
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {formatCurrency(assetsSummary.allocated)}
                </span>
                <span className="text-xs text-gray-400">Đã phân bổ</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Section: Overview Cards (Visual Rich) */}
        <OverviewCards
          totalAssets={netWorth}
          monthlyIncome={monthlyIncome}
          monthlyExpense={monthlyExpense}
          monthlySavings={monthlySavings}
          totalDebt={totalDebt}
          totalLoan={totalLoan}
          assetsSummary={assetsSummary}
        />

        {/* Investment Summary Widget */}
        <InvestmentSummaryWidget investments={investments as any[]} />

        {/* Funds Spotlight Widget */}
        <FundsSpotlight funds={funds as any[]} />

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
