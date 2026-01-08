import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { MonthlyStats } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';

interface SpendingChartProps {
  data: MonthlyStats[];
}

export default function SpendingChart({ data }: SpendingChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm border-none bg-white/50 dark:bg-white/5">
      <CardHeader>
        <CardTitle>Xu hướng thu chi</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'hsl(var(--popover))',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorIncome)"
              strokeWidth={3}
              name="Thu nhập"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="hsl(var(--destructive))"
              fillOpacity={1}
              fill="url(#colorExpense)"
              strokeWidth={3}
              name="Chi tiêu"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
