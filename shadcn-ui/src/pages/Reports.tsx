import { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { useTransactions, useCategories } from '@/hooks/use-db';
import { formatCurrency } from '@/lib/calculations';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

export default function Reports() {
  const transactions = useTransactions();
  const categories = useCategories();
  const [period, setPeriod] = useState('thisMonth');

  // Memoize data processing to avoid recalculations
  const { summary, trendData, categoryData } = useMemo(() => {
    if (!transactions || !categories) {
      return { summary: null, trendData: [], categoryData: [] };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Filter transactions based on period
    const filtered = transactions.filter(t => {
      if (t.isDeleted) return false;
      const [y, m, d] = t.date.split('-').map(Number);

      if (period === 'thisMonth') {
        return y === currentYear && (m - 1) === currentMonth;
      } else if (period === 'lastMonth') {
        const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
        return y === lastMonthDate.getFullYear() && (m - 1) === lastMonthDate.getMonth();
      } else if (period === 'last3Months') {
        const diffMonths = (currentYear - y) * 12 + (currentMonth - (m - 1));
        return diffMonths >= 0 && diffMonths <= 2;
      } else if (period === 'thisYear') {
        return y === currentYear;
      }
      return true;
    });

    // 1. Calculate Summary (Totals)
    const totalIncome = filtered
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filtered
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const netIncome = totalIncome - totalExpense;

    // 2. Calculate Top Categories (Pie Chart)
    const catMap = new Map<string, number>();
    filtered.filter(t => t.type === 'expense').forEach(t => {
      const current = catMap.get(t.categoryId) || 0;
      catMap.set(t.categoryId, current + t.amount);
    });

    const pieData = Array.from(catMap.entries())
      .map(([catId, amount]) => {
        const cat = categories.find(c => c.id === catId);
        return {
          name: cat?.name || 'Khác',
          value: amount,
          color: cat?.color || '#94a3b8'
        };
      })
      .sort((a, b) => b.value - a.value);

    // 3. Calculate Trend Data (Bar/Area Chart)
    const trendMap = new Map<string, { income: number, expense: number, dateStr: string }>();

    // Initialize keys based on period to ensure continuous axis
    if (period === 'thisMonth' || period === 'lastMonth') {
      const targetDate = period === 'thisMonth' ? new Date() : new Date(currentYear, currentMonth - 1, 1);
      const y = targetDate.getFullYear();
      const m = targetDate.getMonth();
      const daysInMonth = new Date(y, m + 1, 0).getDate();

      for (let d = 1; d <= daysInMonth; d++) {
        const key = `${d}/${m + 1}`; // Display format "D/M"
        // Use padded Key for sorting if needed, but here simple loop is fine
        // We need to match transaction date string YYYY-MM-DD
        // Actually, map Key should be consistent with transaction loop
      }
    }
    // Better strategy: Loop transactions and group, then sort. 
    // BUT for charts, gaps should ideally be zero-filled if we want a nice line, 
    // or just show days with data. Bar chart is fine with gaps usually.
    // Let's stick to "Days with Data" or "All Days" if possible.
    // Simplifying: Just group by appropriate unit.

    filtered.forEach(t => {
      const [y, m, d] = t.date.split('-').map(Number);
      let key = '';
      let sortKey = 0; // for sorting

      if (period === 'thisYear') {
        key = `T${m}`; // Month
        sortKey = m;
      } else {
        key = `${d}/${m}`; // Day
        sortKey = m * 31 + d;
      }

      if (!trendMap.has(key)) {
        trendMap.set(key, { income: 0, expense: 0, dateStr: key });
      }
      const entry = trendMap.get(key)!;
      if (t.type === 'income') entry.income += t.amount;
      if (t.type === 'expense') entry.expense += t.amount;
    });

    // Fill in gaps logic (Optional but nice) - Skipping for complexity, 
    // but sorting is required.
    // If This Year, we want T1 -> T12.
    if (period === 'thisYear') {
      for (let i = 1; i <= 12; i++) {
        const key = `T${i}`;
        if (!trendMap.has(key)) {
          trendMap.set(key, { income: 0, expense: 0, dateStr: key });
        }
      }
    }

    // Convert to array and sort
    const trend = Array.from(trendMap.values()).sort((a, b) => {
      // Simple sort heuristic
      const [d1, m1] = a.dateStr.replace('T', '').split('/').map(Number);
      const [d2, m2] = b.dateStr.replace('T', '').split('/').map(Number);

      if (period === 'thisYear') {
        return d1 - d2; // d1 is month index effectively
      }
      // Day/Month format D/M
      if (m1 !== m2) return m1 - m2;
      return d1 - d2;
    });

    return {
      summary: { totalIncome, totalExpense, netIncome },
      categoryData: pieData,
      trendData: trend
    };
  }, [transactions, categories, period]);

  if (!transactions || !categories) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Báo cáo</h1>
            <p className="text-gray-600">Phân tích tình hình tài chính của bạn</p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">Tháng này</SelectItem>
              <SelectItem value="lastMonth">Tháng trước</SelectItem>
              <SelectItem value="last3Months">3 tháng gần nhất</SelectItem>
              <SelectItem value="thisYear">Năm nay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng thu nhập</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(summary?.totalIncome || 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng chi tiêu</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(summary?.totalExpense || 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thu nhập ròng</CardTitle>
              <Wallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${(summary?.netIncome || 0) >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}
              >
                {formatCurrency(summary?.netIncome || 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Biểu đồ Thu chi {period === 'thisYear' ? 'theo Tháng' : 'theo Ngày'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dateStr" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      labelStyle={{ color: '#333' }}
                    />
                    <Legend />
                    <Bar name="Thu nhập" dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar name="Chi tiêu" dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Cơ cấu Chi tiêu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    Chưa có dữ liệu chi tiêu
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}