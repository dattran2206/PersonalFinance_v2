import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Investment } from '@/lib/types';
import { calculateInvestmentValue, calculateInvestmentProfit, formatCurrency, calculateInvestmentProfitPercentage } from '@/lib/calculations';
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface InvestmentSummaryWidgetProps {
    investments: Investment[];
}

export function InvestmentSummaryWidget({ investments }: InvestmentSummaryWidgetProps) {
    const totalValue = investments.reduce((sum, inv) => sum + calculateInvestmentValue(inv), 0);
    const totalProfit = investments.reduce((sum, inv) => sum + calculateInvestmentProfit(inv), 0);
    const totalInvested = totalValue - totalProfit;
    const totalProfitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    // Get top 3 assets by value
    const topAssets = [...investments]
        .sort((a, b) => calculateInvestmentValue(b) - calculateInvestmentValue(a))
        .slice(0, 3);

    return (
        <Card className="border-emerald-100 dark:border-emerald-900/50 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-950 dark:to-emerald-950/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-display text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                    Danh mục Đầu tư
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" asChild>
                    <Link to="/investments" className="flex items-center gap-1">
                        Chi tiết <ArrowRight className="w-4 h-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Main Stats */}
                    <div className="lg:col-span-1 space-y-1">
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Tổng giá trị</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {formatCurrency(totalValue)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`flex items-center text-sm font-semibold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {totalProfit >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                {formatCurrency(Math.abs(totalProfit))}
                            </span>
                            <Badge variant={totalProfit >= 0 ? 'default' : 'destructive'} className="text-xs">
                                {totalProfitPercentage >= 0 ? '+' : ''}{totalProfitPercentage.toFixed(2)}%
                            </Badge>
                        </div>
                    </div>

                    {/* Top Assets */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {topAssets.map(asset => {
                                const val = calculateInvestmentValue(asset);
                                const profit = calculateInvestmentProfit(asset);
                                const profitPct = calculateInvestmentProfitPercentage(asset);

                                return (
                                    <div key={asset.id} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100 truncate pr-2" title={asset.name}>
                                                {asset.name}
                                            </span>
                                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${profit >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {profitPct >= 0 ? '+' : ''}{profitPct.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                                            {formatCurrency(val)}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {asset.quantity} x {formatCurrency(asset.currentPrice)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
