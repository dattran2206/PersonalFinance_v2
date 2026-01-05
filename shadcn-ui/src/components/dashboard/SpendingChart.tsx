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
} from 'recharts';
import { MonthlyStats } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';

interface SpendingChartProps {
  data: MonthlyStats[];
}

export default function SpendingChart({ data }: SpendingChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Xu hướng thu chi 6 tháng gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2}
              name="Thu nhập"
              dot={{ fill: '#10B981', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#EF4444"
              strokeWidth={2}
              name="Chi tiêu"
              dot={{ fill: '#EF4444', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="netIncome"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Thu nhập ròng"
              dot={{ fill: '#3B82F6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}