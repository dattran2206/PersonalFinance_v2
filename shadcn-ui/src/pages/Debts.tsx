import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { debts } from '@/lib/mockData';
import { DebtType } from '@/lib/types';
import { formatCurrency, calculateTotalDebt } from '@/lib/calculations';
import { Plus, AlertCircle, CheckCircle, Pencil, Trash2 } from 'lucide-react';

export default function Debts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalDebt = calculateTotalDebt(debts.filter((d) => d.type === DebtType.DEBT));
  const totalLoan = calculateTotalDebt(debts.filter((d) => d.type === DebtType.LOAN));

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý nợ & cho vay</h1>
            <p className="text-gray-600">Theo dõi các khoản nợ và cho vay</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm khoản nợ/vay
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm khoản nợ/cho vay mới</DialogTitle>
                <DialogDescription>Ghi nhận khoản nợ hoặc cho vay</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="debtType">Loại</Label>
                  <Select defaultValue="debt">
                    <SelectTrigger id="debtType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debt">Khoản nợ (cần trả)</SelectItem>
                      <SelectItem value="loan">Cho vay (người khác nợ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="debtName">Tên khoản nợ/vay</Label>
                  <Input id="debtName" placeholder="Vay mua xe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Số tiền ban đầu</Label>
                  <Input id="amount" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remainingAmount">Số tiền còn lại</Label>
                  <Input id="remainingAmount" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Lãi suất (%/năm)</Label>
                  <Input id="interestRate" type="number" placeholder="0" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Ngày đến hạn</Label>
                  <Input id="dueDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="debtDescription">Mô tả</Label>
                  <Textarea id="debtDescription" placeholder="Ghi chú về khoản nợ/vay" />
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
          <Card className="bg-gradient-to-r from-red-600 to-red-500 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Tổng nợ cần trả
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{formatCurrency(totalDebt)}</p>
              <p className="text-red-100 mt-2">
                {debts.filter((d) => d.type === DebtType.DEBT).length} khoản nợ
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Tổng cho vay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{formatCurrency(totalLoan)}</p>
              <p className="text-emerald-100 mt-2">
                {debts.filter((d) => d.type === DebtType.LOAN).length} khoản cho vay
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Khoản nợ cần trả</h2>
            <div className="space-y-4">
              {debts
                .filter((d) => d.type === DebtType.DEBT)
                .map((debt) => {
                  const percentage = (debt.remainingAmount / debt.amount) * 100;
                  const paid = debt.amount - debt.remainingAmount;
                  const daysUntilDue = Math.ceil(
                    (new Date(debt.dueDate).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <Card key={debt.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {debt.name}
                            </h3>
                            <p className="text-sm text-gray-600">{debt.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-red-600 border-red-600">
                                Lãi suất: {debt.interestRate}%/năm
                              </Badge>
                              {daysUntilDue > 0 ? (
                                <Badge variant="outline">
                                  Còn {daysUntilDue} ngày đến hạn
                                </Badge>
                              ) : (
                                <Badge variant="destructive">Đã quá hạn</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Đã trả</span>
                            <span className="font-semibold">
                              {formatCurrency(paid)} / {formatCurrency(debt.amount)}
                            </span>
                          </div>
                          <Progress value={100 - percentage} className="h-3" />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Còn lại</span>
                            <span className="font-semibold text-red-600">
                              {formatCurrency(debt.remainingAmount)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Khoản cho vay</h2>
            <div className="space-y-4">
              {debts
                .filter((d) => d.type === DebtType.LOAN)
                .map((debt) => {
                  const percentage = (debt.remainingAmount / debt.amount) * 100;
                  const received = debt.amount - debt.remainingAmount;
                  const daysUntilDue = Math.ceil(
                    (new Date(debt.dueDate).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <Card key={debt.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {debt.name}
                            </h3>
                            <p className="text-sm text-gray-600">{debt.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {debt.interestRate > 0 && (
                                <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                                  Lãi suất: {debt.interestRate}%/năm
                                </Badge>
                              )}
                              {daysUntilDue > 0 ? (
                                <Badge variant="outline">
                                  Còn {daysUntilDue} ngày đến hạn
                                </Badge>
                              ) : (
                                <Badge variant="destructive">Đã quá hạn</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Đã thu hồi</span>
                            <span className="font-semibold">
                              {formatCurrency(received)} / {formatCurrency(debt.amount)}
                            </span>
                          </div>
                          <Progress value={100 - percentage} className="h-3 [&>div]:bg-emerald-600" />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Còn lại</span>
                            <span className="font-semibold text-emerald-600">
                              {formatCurrency(debt.remainingAmount)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}