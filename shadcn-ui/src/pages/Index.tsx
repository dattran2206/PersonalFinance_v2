import Layout from '@/components/layout/Layout';
import OverviewCards from '@/components/dashboard/OverviewCards';
import SpendingChart from '@/components/dashboard/SpendingChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { accounts, transactions, categories } from '@/lib/mockData';
import {
  calculateTotalIncome,
  calculateTotalExpense,
  calculateMonthlyStats,
  filterTransactionsByMonth,
} from '@/lib/calculations';

export default function Index() {
  const now = new Date();
  const currentMonthTransactions = filterTransactionsByMonth(
    transactions,
    now.getFullYear(),
    now.getMonth()
  );

  const totalAssets = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyIncome = calculateTotalIncome(currentMonthTransactions);
  const monthlyExpense = calculateTotalExpense(currentMonthTransactions);
  const monthlySavings = monthlyIncome - monthlyExpense;

  const monthlyStats = calculateMonthlyStats(transactions, 6);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Tổng quan tài chính của bạn</p>
        </div>

        <OverviewCards
          totalAssets={totalAssets}
          monthlyIncome={monthlyIncome}
          monthlyExpense={monthlyExpense}
          monthlySavings={monthlySavings}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SpendingChart data={monthlyStats} />
          <RecentTransactions
            transactions={transactions}
            categories={categories}
            accounts={accounts}
          />
        </div>
      </div>
    </Layout>
  );
}