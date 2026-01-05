import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { budgets, categories, transactions } from '@/lib/mockData';
import { CategoryType } from '@/lib/types';
import { formatCurrency, calculateBudgetUsage } from '@/lib/calculations';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';

export default function Budget() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const expenseCategories = categories.filter((c) => c.type === CategoryType.EXPENSE);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý ngân sách</h1>
            <p className="text-gray-600">Thiết lập và theo dõi ngân sách của bạn</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm ngân sách
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thiết lập ngân sách mới</DialogTitle>
                <DialogDescription>Tạo ngân sách cho danh mục chi tiêu</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetCategory">Danh mục</Label>
                  <Select>
                    <SelectTrigger id="budgetCategory">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetAmount">Số tiền ngân sách</Label>
                  <Input id="budgetAmount" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Chu kỳ</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger id="period">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Hàng tháng</SelectItem>
                      <SelectItem value="yearly">Hàng năm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">Lưu</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const category = categories.find((c) => c.id === budget.categoryId);
            const usage = calculateBudgetUsage(budget, transactions);
            const isOverBudget = usage.percentage > 100;
            const isNearLimit = usage.percentage > 80 && usage.percentage <= 100;

            return (
              <Card key={budget.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category?.icon}</span>
                      <span>{category?.name}</span>
                    </div>
                    {isOverBudget ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : isNearLimit ? (
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Đã sử dụng</span>
                      <span className="font-semibold">
                        {formatCurrency(usage.used)} / {formatCurrency(budget.amount)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(usage.percentage, 100)}
                      className={`h-3 ${
                        isOverBudget
                          ? '[&>div]:bg-red-600'
                          : isNearLimit
                          ? '[&>div]:bg-amber-600'
                          : '[&>div]:bg-emerald-600'
                      }`}
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`font-semibold ${
                          isOverBudget
                            ? 'text-red-600'
                            : isNearLimit
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {usage.percentage.toFixed(1)}%
                      </span>
                      <span className="text-gray-600">
                        Còn lại: {formatCurrency(usage.remaining)}
                      </span>
                    </div>
                  </div>
                  {isOverBudget && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">
                        ⚠️ Bạn đã vượt quá ngân sách {(usage.percentage - 100).toFixed(1)}%
                      </p>
                    </div>
                  )}
                  {isNearLimit && !isOverBudget && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-800">
                        ⚠️ Bạn đã sử dụng hơn 80% ngân sách
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lời khuyên về ngân sách</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-2xl">💡</span>
                <p className="text-sm text-gray-700">
                  Hãy thiết lập ngân sách cho tất cả các danh mục chi tiêu chính để kiểm soát tài chính tốt hơn.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                <span className="text-2xl">✅</span>
                <p className="text-sm text-gray-700">
                  Quy tắc 50/30/20: 50% cho nhu cầu thiết yếu, 30% cho mong muốn, 20% cho tiết kiệm.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}