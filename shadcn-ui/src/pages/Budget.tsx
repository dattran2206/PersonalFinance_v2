import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useCategories, useTransactions, useBudgets } from '@/hooks/use-db';
import { CategoryType, TransactionType } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { Plus, AlertTriangle, CheckCircle, TrendingUp, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/db/db';

export default function Budget() {
  const categories = useCategories() || [];
  const transactions = useTransactions() || [];
  const budgets = useBudgets() || [];

  const [isOpen, setIsOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [endDate, setEndDate] = useState('');
  const [rollover, setRollover] = useState(false);

  const handleAddBudget = async () => {
    if (!categoryId || !amount) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const now = Date.now();
      await db.budgets.add({
        id: self.crypto.randomUUID(),
        categoryId,
        amount: Number(amount),
        period,
        startDate,
        endDate,
        rollover,
        createdAt: now,
        updatedAt: now,
        isDeleted: false
      });

      toast.success('Thêm ngân sách thành công!');
      setIsOpen(false);
      setCategoryId('');
      setAmount('');
      setPeriod('monthly');
      setEndDate('');
      setRollover(false);
    } catch (error) {
      console.error("Failed to add budget:", error);
      toast.error("Có lỗi xảy ra khi thêm ngân sách");
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa ngân sách này?')) return;
    try {
      await db.budgets.delete(id);
      toast.success('Đã xóa ngân sách');
    } catch (error) {
      console.error("Failed to delete budget:", error);
      toast.error("Có lỗi xảy ra khi xóa ngân sách");
    }
  };

  const expenseCategories = categories.filter((c) => c.type === CategoryType.EXPENSE);

  const getBudgetSpending = (budget: typeof budgets[0]) => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();

    return transactions
      .filter((t) => {
        // Safe date parsing from YYYY-MM-DD string
        const [y, m, d] = t.date.split('-').map(Number);

        const isCurrentPeriod =
          budget.period === 'monthly'
            ? (m - 1) === currentMonth && y === currentYear
            : y === currentYear;

        return (
          t.type === TransactionType.EXPENSE &&
          t.categoryId === budget.categoryId &&
          isCurrentPeriod
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + getBudgetSpending(b), 0);
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ngân sách</h1>
            <p className="text-gray-600">Thiết lập và theo dõi ngân sách chi tiêu</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm ngân sách
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm ngân sách mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Số tiền</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Chu kỳ</Label>
                  <Select
                    value={period}
                    onValueChange={(value) => setPeriod(value as 'monthly' | 'yearly')}
                  >
                    <SelectTrigger id="period">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Hàng tháng</SelectItem>
                      <SelectItem value="yearly">Hàng năm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc (tùy chọn)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="rollover" className="cursor-pointer">
                      Dồn tháng
                    </Label>
                    <p className="text-sm text-gray-600">
                      Chuyển số dư sang tháng sau
                    </p>
                  </div>
                  <Switch
                    id="rollover"
                    checked={rollover}
                    onCheckedChange={setRollover}
                  />
                </div>

                <Button onClick={handleAddBudget} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Thêm ngân sách
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Tổng quan ngân sách
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng ngân sách</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Đã chi</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSpent)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Còn lại</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(totalBudget - totalSpent)}
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Đã sử dụng</span>
                <span className="font-semibold">{overallProgress.toFixed(1)}%</span>
              </div>
              <Progress
                value={overallProgress}
                className={`h-3 ${overallProgress > 90 ? 'bg-red-100' : ''}`}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const category = getCategoryInfo(budget.categoryId);
            const spent = getBudgetSpending(budget);
            const remaining = budget.amount - spent;
            const progress = (spent / budget.amount) * 100;
            const isOverBudget = spent > budget.amount;
            const isNearLimit = progress > 80 && !isOverBudget;

            return (
              <Card
                key={budget.id}
                className={`hover:shadow-lg transition-shadow relative group ${isOverBudget ? 'border-red-300' : isNearLimit ? 'border-amber-300' : ''
                  }`}
              >
                <CardContent className="pt-6">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteBudget(budget.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${category?.color}20` }}
                      >
                        {category?.icon || '📦'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{category?.name || 'Danh mục đã xóa'}</h3>
                        <p className="text-sm text-gray-600">
                          {budget.period === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}
                        </p>
                      </div>
                    </div>

                    {isOverBudget ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Vượt mức
                      </Badge>
                    ) : isNearLimit ? (
                      <Badge variant="outline" className="border-amber-300 text-amber-700">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Gần đạt
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ổn định
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-gray-600">Đã chi</span>
                      <div className="text-right">
                        <p
                          className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900'
                            }`}
                        >
                          {formatCurrency(spent)}
                        </p>
                        <p className="text-sm text-gray-500">/ {formatCurrency(budget.amount)}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Tiến độ</span>
                        <span className="font-semibold">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress
                        value={Math.min(progress, 100)}
                        className={`h-2 ${isOverBudget
                          ? '[&>div]:bg-red-600'
                          : isNearLimit
                            ? '[&>div]:bg-amber-500'
                            : ''
                          }`}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm text-gray-600">Còn lại</span>
                      <span
                        className={`font-semibold ${isOverBudget
                          ? 'text-red-600'
                          : remaining < budget.amount * 0.2
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                          }`}
                      >
                        {formatCurrency(Math.max(0, remaining))}
                      </span>
                    </div>

                    {budget.rollover && (
                      <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        <CheckCircle className="w-3 h-3" />
                        <span>Dồn tháng được bật</span>
                      </div>
                    )}

                    {budget.endDate && (
                      <div className="text-xs text-gray-500">
                        Kết thúc: {new Date(budget.endDate).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}