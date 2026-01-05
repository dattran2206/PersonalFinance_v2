import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { transactions, categories, accounts } from '@/lib/mockData';
import {
  calculateCategorySpending,
  calculateMonthlyStats,
  formatCurrency,
} from '@/lib/calculations';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function Reports() {
  const monthlyStats = calculateMonthlyStats(transactions, 6);
  const categorySpending = calculateCategorySpending(transactions, categories);
  const totalAssets = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const now = new Date();
  const currentMonth = now.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Báo cáo & Thống kê</h1>
          <p className="text-gray-600">Phân tích chi tiết tình hình tài chính của bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Tổng tài sản
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalAssets)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Thu nhập tháng này
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(monthlyStats[monthlyStats.length - 1]?.income || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Chi tiêu tháng này
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(monthlyStats[monthlyStats.length - 1]?.expense || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Chi tiêu theo danh mục - {currentMonth}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categorySpending}
                    dataKey="amount"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.categoryName}: ${entry.percentage.toFixed(1)}%`}
                  >
                    {categorySpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 5 danh mục chi tiêu nhiều nhất</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categorySpending.slice(0, 5).map((cat, index) => (
                  <div key={cat.categoryId}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                        <span className="font-medium text-gray-900">{cat.categoryName}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(cat.amount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${cat.percentage}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {cat.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>So sánh thu chi 6 tháng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Thu nhập" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" fill="#EF4444" name="Chi tiêu" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt tài chính 6 tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Tháng</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Thu nhập</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Chi tiêu</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">
                      Thu nhập ròng
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">
                      Tỷ lệ tiết kiệm
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStats.map((stat, index) => {
                    const savingsRate = stat.income > 0 ? (stat.netIncome / stat.income) * 100 : 0;
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{stat.month}</td>
                        <td className="py-3 px-4 text-right text-emerald-600 font-semibold">
                          {formatCurrency(stat.income)}
                        </td>
                        <td className="py-3 px-4 text-right text-red-600 font-semibold">
                          {formatCurrency(stat.expense)}
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-semibold ${
                            stat.netIncome >= 0 ? 'text-blue-600' : 'text-red-600'
                          }`}
                        >
                          {formatCurrency(stat.netIncome)}
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-semibold ${
                            savingsRate >= 20
                              ? 'text-emerald-600'
                              : savingsRate >= 10
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        >
                          {savingsRate.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}