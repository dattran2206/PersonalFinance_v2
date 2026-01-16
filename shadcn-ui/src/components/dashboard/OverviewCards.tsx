import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, PieChart } from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';

interface OverviewCardsProps {
  totalAssets: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlySavings: number;
  totalDebt: number; // Added
  totalLoan: number; // Added
  assetsSummary: {
    total: number;
    allocated: number;
    available: number;
  };
}

export default function OverviewCards({
  totalAssets,
  monthlyIncome,
  monthlyExpense,
  monthlySavings,
  totalDebt, // Added
  totalLoan, // Added
  assetsSummary,
}: OverviewCardsProps) {
  // Calculate percentages for donut chart
  const availablePercent = totalAssets > 0 ? (assetsSummary.available / totalAssets) * 100 : 0;
  const allocatedPercent = totalAssets > 0 ? (assetsSummary.allocated / totalAssets) * 100 : 0;

  // SVG Circle calculations
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const availableOffset = circumference - (availablePercent / 100) * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Smart Net Worth Card - Spans 2 cols */}
      <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white border-none shadow-xl shadow-gray-900/20 relative overflow-hidden group">
        {/* Background Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>

        <CardContent className="p-6 relative z-10 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-medium mb-1 text-sm uppercase tracking-wide">Tài sản ròng</p>
              <h2 className="text-4xl font-bold font-display tracking-tight text-white">
                {formatCurrency(totalAssets)}
              </h2>
              <div className="flex items-center gap-1 mt-2 text-emerald-400 bg-emerald-400/10 w-fit px-2 py-0.5 rounded text-sm">
                <ArrowUpRight className="w-3 h-3" />
                <span>+5.2%</span>
              </div>
            </div>

            {/* Micro Donut Chart Visualizer */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="transform -rotate-90 w-full h-full">
                {/* Background Ring */}
                <circle
                  cx="50%" cy="50%" r={radius}
                  stroke="currentColor" strokeWidth="6"
                  fill="transparent"
                  className="text-gray-700"
                />
                {/* Allocated Segment (Base) */}
                <circle
                  cx="50%" cy="50%" r={radius}
                  stroke="currentColor" strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  className="text-amber-500 transition-all duration-1000 ease-out"
                />
                {/* Available Segment (Overlay) */}
                <circle
                  cx="50%" cy="50%" r={radius}
                  stroke="currentColor" strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={availableOffset}
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                />
              </svg>
              <Wallet className="absolute w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-400">Khả dụng</span>
              </div>
              <p className="text-lg font-semibold text-emerald-400">{formatCurrency(assetsSummary.available)}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-sm text-gray-400">Đã dành cho quỹ</span>
              </div>
              <p className="text-lg font-semibold text-amber-400">{formatCurrency(assetsSummary.allocated)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Income - Minimalist with trend */}
      <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
              +12.3%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Thu nhập tháng</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white font-display">
              {formatCurrency(monthlyIncome)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Expense - Minimalist with trend */}
      <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-pink-50 dark:bg-pink-900/20 text-pink-500 dark:text-pink-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
              -3.1%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Chi tiêu tháng</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white font-display">
              {formatCurrency(monthlyExpense)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Debt Management Card - New */}
      <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400">
              <PieChart className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              Công nợ
            </span>
          </div>
          <div>
            <div className="flex justify-between items-end mb-1">
              <div>
                <p className="text-xs text-emerald-600 font-medium">Đang cho vay</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalLoan)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-red-500 font-medium">Đang nợ</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalDebt)}</p>
              </div>
            </div>
            {/* Net Debt Status Bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden flex">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${totalLoan + totalDebt > 0 ? (totalLoan / (totalLoan + totalDebt)) * 100 : 0}%` }}
              ></div>
              <div
                className="h-full bg-red-500"
                style={{ width: `${totalLoan + totalDebt > 0 ? (totalDebt / (totalLoan + totalDebt)) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
