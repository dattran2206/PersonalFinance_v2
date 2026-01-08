import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';

interface OverviewCardsProps {
  totalAssets: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlySavings: number;
}

export default function OverviewCards({
  totalAssets,
  monthlyIncome,
  monthlyExpense,
  monthlySavings,
}: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Balance - Main Highlight */}
      <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary to-emerald-600 text-white border-none shadow-xl shadow-emerald-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
        <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-100 font-medium mb-1">Tài sản ròng</p>
              <h2 className="text-4xl font-bold font-display tracking-tight">
                {formatCurrency(totalAssets)}
              </h2>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2">
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" /> +5.2%
            </span>
            <span className="text-emerald-100 text-sm">so với tháng trước</span>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Income */}
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/50 dark:border-white/10 hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
              +12.3%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Thu nhập tháng</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 font-display">
            {formatCurrency(monthlyIncome)}
          </p>
        </CardContent>
      </Card>

      {/* Monthly Expense */}
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/50 dark:border-white/10 hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
              -3.1%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Chi tiêu tháng</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 font-display">
            {formatCurrency(monthlyExpense)}
          </p>
        </CardContent>
      </Card>

      {/* Monthly Savings (Optional 5th card or included in layout) - Keeping it simple for now, 
           or maybe we want to make the income/expense cards take up more space in the grid later. 
           For now let's just add the Savings card as well. */}
    </div>
  );
}
