import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
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
  const cards = [
    {
      title: 'Tổng tài sản',
      value: totalAssets,
      icon: Wallet,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: '+5.2%',
      trendUp: true,
    },
    {
      title: 'Thu nhập tháng này',
      value: monthlyIncome,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12.3%',
      trendUp: true,
    },
    {
      title: 'Chi tiêu tháng này',
      value: monthlyExpense,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: '-3.1%',
      trendUp: false,
    },
    {
      title: 'Tiết kiệm tháng này',
      value: monthlySavings,
      icon: PiggyBank,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      trend: '+8.5%',
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <span
                  className={`text-sm font-semibold ${
                    card.trendUp ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {card.trend}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(card.value)}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}