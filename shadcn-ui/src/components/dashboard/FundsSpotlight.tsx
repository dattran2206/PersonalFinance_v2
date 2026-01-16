import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/calculations";
import { Fund } from "@/lib/types";
import { ArrowRight, Target, Clock, AlertCircle } from "lucide-react";

// Helper to calculate days remaining
const calculateDaysRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FundsSpotlightProps {
    funds: Fund[];
}

export function FundsSpotlight({ funds }: FundsSpotlightProps) {
    const navigate = useNavigate();

    // Filter and sort funds:
    // 1. Not deleted
    // 2. Not completed (current < target)
    // 3. Sort by: Has deadline (closest first) -> then by % progress (highest first)
    const priorityFunds = funds
        .filter(f => !f.isDeleted && f.currentAmount < f.targetAmount)
        .sort((a, b) => {
            // Prioritize deadline if exists
            if (a.deadline && b.deadline) {
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            }
            if (a.deadline) return -1;
            if (b.deadline) return 1;

            // Then prioritize progress %
            const progressA = (a.currentAmount / a.targetAmount);
            const progressB = (b.currentAmount / b.targetAmount);
            return progressB - progressA;
        })
        .slice(0, 4); // Take top 4

    if (priorityFunds.length === 0) return null;

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-display text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    Tiêu điểm quỹ
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    onClick={() => navigate('/funds')}
                >
                    Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {priorityFunds.map(fund => {
                    const progress = (fund.currentAmount / fund.targetAmount) * 100;
                    const daysLeft = fund.deadline ? calculateDaysRemaining(fund.deadline) : null;
                    const isUrgent = daysLeft !== null && daysLeft <= 30 && daysLeft > 0;

                    return (
                        <Card key={fund.id} className="hover:shadow-md transition-shadow border-emerald-100/50 dark:border-emerald-900/50 relative overflow-hidden group">
                            {/* Decorative background element */}
                            <div
                                className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"
                                style={{ opacity: 0.5 }}
                            />

                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-xl mb-2">
                                        {fund.icon}
                                    </div>
                                    {isUrgent && (
                                        <div className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full animate-pulse">
                                            <Clock className="w-3 h-3" />
                                            {daysLeft} ngày
                                        </div>
                                    )}
                                </div>

                                <h3 className="font-semibold text-gray-900 truncate mb-1" title={fund.name}>
                                    {fund.name}
                                </h3>

                                <div className="flex justify-between items-end mb-2">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(fund.currentAmount)}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">
                                        /{formatCurrency(fund.targetAmount)}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Tiến độ</span>
                                        <span>{progress.toFixed(0)}%</span>
                                    </div>
                                    <Progress value={progress} className="h-1.5" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
