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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
} from 'recharts';
import { useTransactions, useCategories, useInvestments } from '@/hooks/use-db';
import {
  formatCurrency,
  calculateInvestmentValue,
  calculateInvestmentProfit,
} from '@/lib/calculations';
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { InvestmentType } from '@/lib/types';

export default function Reports() {
  const transactions = useTransactions();
  const categories = useCategories();
  const investments = useInvestments();
  const [period, setPeriod] = useState('thisMonth');

  // --- CASHFLOW LOGIC (Existing) ---
  const { summary, trendData, categoryData } = useMemo(() => {
    if (!transactions || !categories) {
      return { summary: null, trendData: [], categoryData: [] };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Exclude Debt/Loan related transactions
    const DEBT_KEYWORDS = ['Đi vay', 'Cho vay', 'Trả nợ', 'Thu nợ'];

    const filtered = transactions.filter(t => {
      if (t.isDeleted) return false;
      const isDebt = DEBT_KEYWORDS.some(k => t.description?.includes(k) || (t.categoryId === 'uncategorized' && t.description?.includes(k)));
      if (isDebt) return false;

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

    const totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netIncome = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

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

    const trendMap = new Map<string, { income: number, expense: number, dateStr: string }>();

    filtered.forEach(t => {
      const [y, m, d] = t.date.split('-').map(Number);
      let key = '';
      if (period === 'thisYear') {
        key = `T${m}`;
      } else {
        key = `${d}/${m}`;
      }

      if (!trendMap.has(key)) {
        trendMap.set(key, { income: 0, expense: 0, dateStr: key });
      }
      const entry = trendMap.get(key)!;
      if (t.type === 'income') entry.income += t.amount;
      if (t.type === 'expense') entry.expense += t.amount;
    });

    if (period === 'thisYear') {
      for (let i = 1; i <= 12; i++) {
        const key = `T${i}`;
        if (!trendMap.has(key)) trendMap.set(key, { income: 0, expense: 0, dateStr: key });
      }
    }

    const trend = Array.from(trendMap.values()).sort((a, b) => {
      const [d1, m1] = a.dateStr.replace('T', '').split('/').map(Number);
      const [d2, m2] = b.dateStr.replace('T', '').split('/').map(Number);
      if (period === 'thisYear') return d1 - d2;
      if (m1 !== m2) return m1 - m2;
      return d1 - d2;
    });

    return { summary: { totalIncome, totalExpense, netIncome, savingsRate }, categoryData: pieData, trendData: trend };
  }, [transactions, categories, period]);

  // --- ASSETS LOGIC (New) ---
  const { assetAllocation, assetPerformance, totalAssetValue, totalAssetProfit } = useMemo(() => {
    if (!investments) return { assetAllocation: [], assetPerformance: [], totalAssetValue: 0, totalAssetProfit: 0 };

    // 1. Asset Allocation (Pie Chart)
    const typeMap = new Map<string, number>();
    let totalVal = 0;
    let totalProf = 0;

    investments.forEach(inv => {
      const val = calculateInvestmentValue(inv);
      const profit = calculateInvestmentProfit(inv);
      totalVal += val;
      totalProf += profit;

      const current = typeMap.get(inv.type) || 0;
      typeMap.set(inv.type, current + val);
    });

    const COLORS: Record<string, string> = {
      [InvestmentType.STOCK]: '#10B981', // Emerald
      [InvestmentType.GOLD]: '#F59E0B',  // Amber
      [InvestmentType.CRYPTO]: '#3B82F6', // Blue
      [InvestmentType.REAL_ESTATE]: '#6366F1', // Indigo
      [InvestmentType.BOND]: '#8B5CF6', // Violet
      [InvestmentType.SAVING]: '#EC4899', // Pink
      [InvestmentType.FUND]: '#14B8A6', // Teal
      'other': '#94A3B8' // Slate
    };

    const allocation = Array.from(typeMap.entries()).map(([type, value]) => ({
      name: type.toUpperCase(),
      value,
      color: COLORS[type] || COLORS['other']
    })).sort((a, b) => b.value - a.value);

    // 2. Asset Performance (Bar Chart: Cost vs Value)
    // Group by Type for cleaner bar chart
    const performanceMap = new Map<string, { cost: number, value: number }>();
    investments.forEach(inv => {
      const cost = inv.purchasePrice * inv.quantity;
      const val = calculateInvestmentValue(inv);

      // Use shorter names for chart
      const typeName = inv.type.toUpperCase();
      if (!performanceMap.has(typeName)) {
        performanceMap.set(typeName, { cost: 0, value: 0 });
      }
      const entry = performanceMap.get(typeName)!;
      entry.cost += cost;
      entry.value += val;
    });

    const performance = Array.from(performanceMap.entries()).map(([name, data]) => ({
      name,
      cost: data.cost,
      value: data.value
    }));

    return {
      assetAllocation: allocation,
      assetPerformance: performance,
      totalAssetValue: totalVal,
      totalAssetProfit: totalProf
    };
  }, [investments]);

  if (!transactions || !categories || !investments) {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Báo cáo Tài chính</h1>
            <p className="text-gray-600">Phân tích dòng tiền & Hiệu quả đầu tư</p>
          </div>
        </div>

        <Tabs defaultValue="cashflow" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <TabsTrigger value="cashflow" className="py-2.5 text-sm font-medium">Thu Nhập & Chi Tiêu</TabsTrigger>
            <TabsTrigger value="assets" className="py-2.5 text-sm font-medium">Tài Sản & Đầu Tư</TabsTrigger>
          </TabsList>

          {/* --- TAB 1: CASHFLOW --- */}
          <TabsContent value="cashflow" className="space-y-6 mt-0">

            <div className="flex justify-end mb-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tỷ lệ tiết kiệm</CardTitle>
                  <div className="h-4 w-4 text-purple-600 font-bold">%</div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${(summary?.savingsRate || 0) >= 20 ? 'text-purple-600' : 'text-orange-500'}`}>
                    {(summary?.savingsRate || 0).toFixed(1)}%
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
                          contentStyle={{ borderRadius: '8px' }}
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
          </TabsContent>

          {/* --- TAB 2: ASSETS & INVESTMENTS --- */}
          <TabsContent value="assets" className="space-y-6 mt-0">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng Giá trị Tài sản</CardTitle>
                  <Wallet className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(totalAssetValue)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Tổng hợp tất cả danh mục đầu tư</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lợi nhuận Tạm tính</CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${totalAssetProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {totalAssetProfit >= 0 ? '+' : ''}{formatCurrency(totalAssetProfit)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Hiệu suất: <span className={totalAssetProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                      {totalAssetValue > 0 ? ((totalAssetProfit / (totalAssetValue - totalAssetProfit)) * 100).toFixed(2) : 0}%
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Allocation Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5" />
                    Phân bổ Tài sản
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    {assetAllocation.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={assetAllocation}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {assetAllocation.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        Chưa có dữ liệu đầu tư
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Hiệu suất Đầu tư (Vốn vs Giá trị)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={assetPerformance} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                          cursor={{ fill: 'transparent' }}
                        />
                        <Legend />
                        <Bar name="Vốn gốc" dataKey="cost" fill="#94A3B8" radius={[0, 4, 4, 0]} barSize={20} />
                        <Bar name="Giá trị hiện tại" dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}