import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { transactions, budgets } from '@/lib/mockData';
import {
  predictNextMonthExpense,
  generateFinancialAdvice,
  formatCurrency,
  calculateMonthlyStats,
} from '@/lib/calculations';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function Predictions() {
  const predictedExpense = predictNextMonthExpense(transactions);
  const advice = generateFinancialAdvice(transactions, budgets);
  const monthlyStats = calculateMonthlyStats(transactions, 6);

  const forecastData = [
    ...monthlyStats,
    {
      month: 'Tháng tới',
      income: 0,
      expense: predictedExpense,
      netIncome: 0,
    },
  ];

  const avgIncome =
    monthlyStats.reduce((sum, m) => sum + m.income, 0) / monthlyStats.length;
  const avgExpense =
    monthlyStats.reduce((sum, m) => sum + m.expense, 0) / monthlyStats.length;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dự đoán & Tư vấn</h1>
          <p className="text-gray-600">Phân tích xu hướng và đưa ra khuyến nghị tài chính</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <CardHeader>
              <CardTitle className="text-white text-sm font-medium">
                Dự đoán chi tiêu tháng tới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{formatCurrency(predictedExpense)}</p>
              <p className="text-blue-100 mt-2 text-sm">Dựa trên 3 tháng gần đây</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
            <CardHeader>
              <CardTitle className="text-white text-sm font-medium">
                Thu nhập trung bình
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{formatCurrency(avgIncome)}</p>
              <p className="text-emerald-100 mt-2 text-sm">6 tháng gần đây</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-600 to-amber-500 text-white">
            <CardHeader>
              <CardTitle className="text-white text-sm font-medium">
                Chi tiêu trung bình
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{formatCurrency(avgExpense)}</p>
              <p className="text-amber-100 mt-2 text-sm">6 tháng gần đây</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Xu hướng chi tiêu và dự đoán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip
                  formatter={(value: number) => (value > 0 ? formatCurrency(value) : 'N/A')}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <ReferenceLine x="Tháng tới" stroke="#3B82F6" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Chi tiêu"
                  dot={{ fill: '#EF4444', r: 4 }}
                  strokeDasharray={(entry) => (entry.month === 'Tháng tới' ? '5 5' : '0')}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Dự đoán:</strong> Chi tiêu tháng tới dự kiến khoảng{' '}
                {formatCurrency(predictedExpense)}, dựa trên xu hướng 3 tháng gần đây.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              Lời khuyên tài chính
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {advice.map((item, index) => {
                const isWarning = item.includes('⚠️') || item.includes('🚨');
                const isSuccess = item.includes('✅');
                const isInfo = item.includes('💡') || item.includes('📊');

                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-4 rounded-lg border ${
                      isWarning
                        ? 'bg-red-50 border-red-200'
                        : isSuccess
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    {isWarning ? (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : isSuccess ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p
                      className={`text-sm ${
                        isWarning
                          ? 'text-red-900'
                          : isSuccess
                          ? 'text-emerald-900'
                          : 'text-blue-900'
                      }`}
                    >
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Khuyến nghị hành động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge className="bg-emerald-600 mt-1">1</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Xem xét lại các khoản chi tiêu không cần thiết
                  </h4>
                  <p className="text-sm text-gray-600">
                    Phân tích chi tiết các danh mục chi tiêu và cắt giảm những khoản không thiết yếu
                    để tăng tỷ lệ tiết kiệm.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-blue-600 mt-1">2</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Thiết lập quỹ khẩn cấp
                  </h4>
                  <p className="text-sm text-gray-600">
                    Nên có quỹ khẩn cấp tương đương 3-6 tháng chi tiêu để đối phó với các tình huống
                    bất ngờ.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-amber-600 mt-1">3</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Đa dạng hóa danh mục đầu tư
                  </h4>
                  <p className="text-sm text-gray-600">
                    Đừng đặt tất cả trứng vào một giỏ. Phân bổ tài sản vào nhiều kênh đầu tư khác nhau
                    để giảm rủi ro.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-purple-600 mt-1">4</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Tự động hóa tiết kiệm
                  </h4>
                  <p className="text-sm text-gray-600">
                    Thiết lập chuyển tiền tự động vào tài khoản tiết kiệm ngay sau khi nhận lương để
                    đảm bảo tiết kiệm đều đặn.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}