import { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTransactions, useAccounts, useInvestments, useDebts, useCategories } from '@/hooks/use-db';
import {
    calculateLinearRegression,
    estimateMinimumMonthlyExpenses,
    formatCurrency,
    calculateMonthlyStats,
    calculateTotalExpense
} from '@/lib/calculations';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    ShieldCheck,
    Target,
    BrainCircuit,
    PiggyBank
} from 'lucide-react';

export default function Predictions() {
    const transactions = useTransactions() || [];
    const accounts = useAccounts() || [];
    const categories = useCategories() || [];

    // State for Runway Simulation
    const [minExpenseMode, setMinExpenseMode] = useState(true); // true = Essential, false = Average
    const [safetyMargin, setSafetyMargin] = useState(0); // Add extra buffer %

    // 1. Prepare Data
    const {
        historyData,
        forecastData,
        avgExpense,
        essentialExpense,
        predictedNextMonth,
        totalLiquidAssets
    } = useMemo(() => {
        if (!transactions.length || !accounts.length) {
            return {
                historyData: [], forecastData: [],
                avgExpense: 0, essentialExpense: 0,
                predictedNextMonth: 0, totalLiquidAssets: 0
            };
        }

        // A. Financial Health
        const liquidAssets = accounts.reduce((sum, a) => sum + a.balance, 0); // Cash + Bank

        // B. Historical Stats (Last 6 months)
        const stats = calculateMonthlyStats(transactions, 6).reverse(); // Oldest first
        const expenseHistory = stats.map(s => s.expense);

        // C. Predictions
        const nextMonthVal = calculateLinearRegression(expenseHistory);
        const avgExp = expenseHistory.reduce((a, b) => a + b, 0) / (expenseHistory.length || 1);

        // D. Essentials
        // We try to pass categories to helper if possible, or just use keyword logic
        const essentialExp = estimateMinimumMonthlyExpenses(transactions, 3);

        // E. Chart Data Construction
        const chartData = stats.map(s => ({
            name: s.month,
            actual: s.expense,
            predicted: null
        }));

        // Add next month prediction point
        chartData.push({
            name: 'Tháng tới',
            actual: null as any,
            predicted: Math.max(0, nextMonthVal)
        });

        return {
            historyData: stats,
            forecastData: chartData,
            avgExpense: avgExp,
            essentialExpense: essentialExp > 0 ? essentialExp : avgExp * 0.6, // Fallback 60% if detection fails
            predictedNextMonth: Math.max(0, nextMonthVal),
            totalLiquidAssets: liquidAssets
        };
    }, [transactions, accounts]);

    // 2. Calculate Runway
    const baseMonthlyNeed = minExpenseMode ? essentialExpense : avgExpense;
    const adjustedMonthlyNeed = baseMonthlyNeed * (1 + safetyMargin / 100);
    const runwayMonths = adjustedMonthlyNeed > 0 ? totalLiquidAssets / adjustedMonthlyNeed : 0;

    const runwayYears = Math.floor(runwayMonths / 12);
    const runwayRemainingMonths = Math.floor(runwayMonths % 12);

    return (
        <Layout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-gray-100 mb-2">
                        Hoạch Định Tương Lai
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Dự báo dòng tiền và kiểm tra sức bền tài chính của bạn
                    </p>
                </div>

                {/* --- SECTION 1: FINANCIAL RUNWAY (SURVIVAL MODE) --- */}
                <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-900 to-slate-900 text-white overflow-hidden relative">
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <CardHeader>
                        <div className="flex items-center gap-2 text-indigo-300 mb-1">
                            <ShieldCheck className="w-5 h-5" />
                            <h3 className="text-sm font-semibold uppercase tracking-wider">Quỹ Khẩn Cấp & Sức Bền</h3>
                        </div>
                        <CardTitle className="text-3xl sm:text-4xl font-light">
                            Bạn có thể duy trì cuộc sống trong <br />
                            <span className="font-bold text-emerald-400">
                                {runwayYears > 0 ? `${runwayYears} năm ` : ''}
                                {runwayRemainingMonths} tháng
                            </span>
                            <span className="text-lg text-gray-400 ml-2 font-normal">nếu mất nguồn thu nhập</span>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                            {/* Controls */}
                            <div className="space-y-6 bg-white/5 p-6 rounded-xl border border-white/10">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="mode-switch" className="flex flex-col">
                                        <span className="font-semibold text-white">Chế độ Sinh tồn</span>
                                        <span className="text-xs text-gray-400">Chỉ tính chi tiêu thiết yếu (Ăn, ở, điện, nước...)</span>
                                    </Label>
                                    <Switch
                                        id="mode-switch"
                                        checked={minExpenseMode}
                                        onCheckedChange={setMinExpenseMode}
                                        className="data-[state=checked]:bg-emerald-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Dự phòng phát sinh</span>
                                        <span className="font-mono text-emerald-400">+{safetyMargin}%</span>
                                    </div>
                                    <Slider
                                        value={[safetyMargin]}
                                        onValueChange={(val) => setSafetyMargin(val[0])}
                                        max={50}
                                        step={5}
                                        className="py-2"
                                    />
                                    <p className="text-xs text-gray-500">Thêm % đệm an toàn cho lạm phát hoặc sự cố bất ngờ</p>
                                </div>
                            </div>

                            {/* Stats Summary */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                    <span className="text-gray-300">Tài sản thanh khoản hiện có</span>
                                    <span className="text-xl font-bold font-mono">{formatCurrency(totalLiquidAssets)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                    <span className="text-gray-300">
                                        Chi tiêu /tháng ({minExpenseMode ? 'Tối thiểu' : 'Trung bình'})
                                    </span>
                                    <span className="text-xl font-bold font-mono text-amber-400">
                                        {formatCurrency(adjustedMonthlyNeed)}
                                    </span>
                                </div>
                                <div className="pt-2">
                                    <div className="flex items-center gap-2 text-sm text-indigo-300">
                                        <PiggyBank className="w-4 h-4" />
                                        {runwayMonths < 3 ? (
                                            <span className="text-red-400 font-bold">CẢNH BÁO: Quỹ khẩn cấp &lt; 3 tháng! Hãy tiết kiệm thêm.</span>
                                        ) : runwayMonths < 6 ? (
                                            <span className="text-amber-400">Khá ổn, nhưng nên phấn đấu đạt 6 tháng.</span>
                                        ) : (
                                            <span className="text-emerald-400">Tuyệt vời! Bạn có quỹ an toàn rất vững chắc.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* --- SECTION 2: AI FORECAST --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BrainCircuit className="w-5 h-5 text-purple-600" />
                                Dự báo dòng tiền thông minh
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={forecastData}>
                                        <defs>
                                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(val: number) => formatCurrency(val)}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="actual"
                                            name="Thực tế"
                                            stroke="#10B981"
                                            strokeWidth={3}
                                            fill="url(#colorActual)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="predicted"
                                            name="Dự đoán"
                                            stroke="#8B5CF6"
                                            strokeWidth={3}
                                            strokeDasharray="5 5"
                                            fill="url(#colorPred)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Chi tiết dự báo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                                <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">Chi tiêu tháng tới (Dự kiến)</p>
                                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                                    {formatCurrency(predictedNextMonth)}
                                </p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-purple-600">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>Dựa trên xu hướng 6 tháng qua</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm">Lời khuyên AI</h4>
                                {predictedNextMonth > avgExpense ? (
                                    <div className="flex gap-3 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                        <p>Xu hướng chi tiêu đang tăng. Bạn nên rà soát lại các khoản chi không cần thiết tuần tới.</p>
                                    </div>
                                ) : (
                                    <div className="flex gap-3 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg">
                                        <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                        <p>Bạn đang kiểm soát chi tiêu tốt, xu hướng ổn định. Hãy duy trì mức này nhé!</p>
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
