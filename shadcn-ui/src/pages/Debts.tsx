import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { debts } from '@/lib/mockData';
import { DebtType } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { Plus, TrendingDown, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const debtTypeLabels: Record<DebtType, string> = {
  [DebtType.DEBT]: 'Nợ cần trả',
  [DebtType.LOAN]: 'Cho vay',
};

export default function Debts() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<DebtType>(DebtType.DEBT);
  const [amount, setAmount] = useState('');
  const [remainingAmount, setRemainingAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [description, setDescription] = useState('');

  const handleAddDebt = () => {
    if (!name || !amount || !remainingAmount || !startDate || !dueDate) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    toast.success('Thêm khoản nợ thành công!');
    setIsOpen(false);
    setName('');
    setAmount('');
    setRemainingAmount('');
    setInterestRate('');
    setStartDate('');
    setDueDate('');
    setMonthlyPayment('');
    setDescription('');
  };

  const totalDebt = debts
    .filter((d) => d.type === DebtType.DEBT)
    .reduce((sum, d) => sum + d.remainingAmount, 0);

  const totalLoan = debts
    .filter((d) => d.type === DebtType.LOAN)
    .reduce((sum, d) => sum + d.remainingAmount, 0);

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nợ & Cho vay</h1>
            <p className="text-gray-600">Quản lý các khoản nợ và cho vay của bạn</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm khoản nợ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm khoản nợ mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên khoản nợ</Label>
                  <Input
                    id="name"
                    placeholder="VD: Vay mua xe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Loại</Label>
                  <Select value={type} onValueChange={(value) => setType(value as DebtType)}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(debtTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Số tiền gốc</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remainingAmount">Còn lại</Label>
                    <Input
                      id="remainingAmount"
                      type="number"
                      placeholder="0"
                      value={remainingAmount}
                      onChange={(e) => setRemainingAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">Lãi suất (%/năm)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
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
                    <Label htmlFor="dueDate">Ngày đáo hạn</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyPayment">Trả hàng tháng (tùy chọn)</Label>
                  <Input
                    id="monthlyPayment"
                    type="number"
                    placeholder="0"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Ghi chú về khoản nợ"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <Button onClick={handleAddDebt} className="w-full">
                  Thêm khoản nợ
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                Tổng nợ cần trả
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Tổng cho vay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalLoan)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {debts.map((debt) => {
            const progress = ((debt.amount - debt.remainingAmount) / debt.amount) * 100;
            const daysRemaining = getDaysRemaining(debt.dueDate);

            return (
              <Card key={debt.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{debt.name}</h3>
                        <Badge
                          variant="outline"
                          className={
                            debt.type === DebtType.DEBT
                              ? 'border-red-200 text-red-700'
                              : 'border-emerald-200 text-emerald-700'
                          }
                        >
                          {debtTypeLabels[debt.type]}
                        </Badge>
                      </div>
                      {debt.description && (
                        <p className="text-sm text-gray-600 mb-3">{debt.description}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Còn lại</p>
                      <p
                        className={`text-2xl font-bold ${debt.type === DebtType.DEBT ? 'text-red-600' : 'text-emerald-600'
                          }`}
                      >
                        {formatCurrency(debt.remainingAmount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        / {formatCurrency(debt.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Tiến độ trả nợ</span>
                        <span className="font-semibold">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Lãi suất
                        </p>
                        <p className="font-semibold">{debt.interestRate}%/năm</p>
                      </div>

                      {debt.monthlyPayment && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Trả hàng tháng</p>
                          <p className="font-semibold">{formatCurrency(debt.monthlyPayment)}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Ngày đáo hạn
                        </p>
                        <p className="font-semibold">
                          {new Date(debt.dueDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600 mb-1">Còn lại</p>
                        <p
                          className={`font-semibold ${daysRemaining < 30
                              ? 'text-red-600'
                              : daysRemaining < 90
                                ? 'text-amber-600'
                                : 'text-gray-900'
                            }`}
                        >
                          {daysRemaining > 0 ? `${daysRemaining} ngày` : 'Đã quá hạn'}
                        </p>
                      </div>
                    </div>
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