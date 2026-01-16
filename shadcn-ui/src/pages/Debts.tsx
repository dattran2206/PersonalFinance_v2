import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoneyInput } from '@/components/ui/money-input'; // Import MoneyInput
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
import { useDebts, useAccounts } from '@/hooks/use-db';
import { DebtType, TransactionType, CategoryType } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { Plus, TrendingDown, TrendingUp, Calendar, DollarSign, Trash2, Pencil, Wallet, Info } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/db/db';

const debtTypeLabels: Record<DebtType, string> = {
  [DebtType.DEBT]: 'Nợ cần trả',
  [DebtType.LOAN]: 'Cho vay',
};

export default function Debts() {
  const debts = useDebts() || [];
  const accounts = useAccounts() || [];
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<DebtType>(DebtType.DEBT);
  const [amount, setAmount] = useState<number>(0);
  const [remainingAmount, setRemainingAmount] = useState<number>(0);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(''); // For smart flow
  const [interestRate, setInterestRate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0); // Changed to number
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setType(DebtType.DEBT);
    setAmount(0);
    setRemainingAmount(0);
    setInterestRate('');
    setStartDate('');
    setDueDate('');
    setMonthlyPayment(0);
    setDescription('');
    setEditingId(null);
    setSelectedAccountId('');
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetForm();
  };

  const handleEditClick = (debt: any) => {
    setName(debt.name);
    setType(debt.type);
    setAmount(debt.amount); // Already number
    setRemainingAmount(debt.remainingAmount); // Already number
    setInterestRate(debt.interestRate.toString());
    setStartDate(debt.startDate);
    setDueDate(debt.dueDate);
    setMonthlyPayment(debt.monthlyPayment || 0);
    setDescription(debt.description || '');
    setEditingId(debt.id);
    setIsOpen(true);
  };

  // Helper to ensure category exists
  const ensureCategory = async (name: string, type: CategoryType, icon: string, color: string) => {
    const existing = await db.categories
      .where('name')
      .equals(name)
      .filter(c => c.type === type && !c.isDeleted)
      .first();

    if (existing) return existing.id;

    const newId = self.crypto.randomUUID();
    await db.categories.add({
      id: newId,
      name,
      type,
      icon,
      color,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false
    });
    return newId;
  };

  const handleSaveDebt = async () => {
    if (!name || !amount || (remainingAmount !== 0 && !remainingAmount) || !startDate || !dueDate) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const now = Date.now();
      const debtData = {
        name,
        type,
        amount: amount, // Already number
        remainingAmount: remainingAmount, // Already number
        interestRate: Number(interestRate || 0),
        startDate,
        dueDate,
        monthlyPayment: monthlyPayment || undefined, // Already number
        description,
        updatedAt: now,
      };

      if (editingId) {
        await db.debts.update(editingId, debtData);
        toast.success('Cập nhật khoản nợ thành công!');
      } else {
        const debtId = self.crypto.randomUUID();
        await db.debts.add({
          id: debtId,
          ...debtData,
          createdAt: now,
          isDeleted: false,
        });

        // HANDLE SMART FLOW (Transaction logic)
        if (selectedAccountId && selectedAccountId !== 'none') {
          const account = accounts.find(a => a.id === selectedAccountId);
          if (account) {
            const txType = type === DebtType.DEBT
              ? TransactionType.INCOME   // Borrowing = Money IN
              : TransactionType.EXPENSE; // Lending = Money OUT

            const txDesc = type === DebtType.DEBT
              ? `Đi vay: ${name}`
              : `Cho vay: ${name}`;

            // Determine Category
            let categoryId = 'uncategorized';
            try {
              if (type === DebtType.DEBT) {
                // Borrowing -> Income -> "Đi vay"
                categoryId = await ensureCategory('Đi vay', CategoryType.INCOME, '💸', '#10B981');
              } else {
                // Lending -> Expense -> "Cho vay"
                categoryId = await ensureCategory('Cho vay', CategoryType.EXPENSE, '🤝', '#F59E0B');
              }
            } catch (e) {
              console.error("Auto-create category failed", e);
            }

            // 1. Create Transaction
            await db.transactions.add({
              date: new Date().toISOString().split('T')[0],
              amount: amount,
              type: txType,
              accountId: selectedAccountId,
              categoryId: categoryId,
              description: txDesc,
              note: `Liên kết với khoản ${type === DebtType.DEBT ? 'nợ' : 'cho vay'}: ${name}`,
              createdAt: now,
              updatedAt: now,
              isDeleted: false
            });

            // 2. Update Account Balance
            const newBalance = type === DebtType.DEBT
              ? account.balance + amount
              : account.balance - amount;

            await db.accounts.update(selectedAccountId, {
              balance: newBalance,
              updatedAt: now
            });

            toast.success(`Đã cập nhật số dư ví ${account.name}`);
          }
        }

        toast.success(type === DebtType.DEBT ? 'Đã thêm khoản nợ' : 'Đã thêm khoản cho vay');
      }
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save debt:", error);
      toast.error("Có lỗi xảy ra khi lưu khoản nợ");
    }
  };

  const handleDeleteDebt = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khoản nợ "${name}"?`)) return;
    try {
      await db.debts.delete(id);
      toast.success(`Đã xóa khoản nợ ${name}`);
    } catch (error) {
      console.error("Failed to delete debt:", error);
      toast.error("Có lỗi xảy ra khi xóa khoản nợ");
    }
  };

  // REPAYMENT LOGIC
  const [repayDialogOpen, setRepayDialogOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<any>(null);
  const [repayAmount, setRepayAmount] = useState(0);
  const [repayAccountId, setRepayAccountId] = useState('');

  const openRepayDialog = (debt: any) => {
    setSelectedDebt(debt);
    setRepayAmount(debt.remainingAmount); // Default to full amount
    setRepayDialogOpen(true);
  };

  const handleRepay = async () => {
    if (!repayAmount || repayAmount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    if (!repayAccountId) {
      toast.error('Vui lòng chọn tài khoản giao dịch');
      return;
    }

    try {
      const now = Date.now();
      const account = accounts.find(a => a.id === repayAccountId);
      if (!account || !selectedDebt) return;

      // 1. Logic for Transaction Type
      // Paying a Debt = Money OUT (Expense)
      // Collecting a Loan = Money IN (Income)
      const txType = selectedDebt.type === DebtType.DEBT ? TransactionType.EXPENSE : TransactionType.INCOME;

      const txDesc = selectedDebt.type === DebtType.DEBT
        ? `Trả nợ: ${selectedDebt.name}`
        : `Thu nợ: ${selectedDebt.name}`;

      // Determine Category
      let categoryId = 'uncategorized';
      try {
        if (selectedDebt.type === DebtType.DEBT) {
          // Repaying Debt -> Expense -> "Trả nợ"
          categoryId = await ensureCategory('Trả nợ', CategoryType.EXPENSE, '💸', '#EF4444');
        } else {
          // Collecting Loan -> Income -> "Thu nợ"
          categoryId = await ensureCategory('Thu nợ', CategoryType.INCOME, '🤝', '#22C55E');
        }
      } catch (e) {
        console.error("Auto-create category failed", e);
      }

      // 2. Create Transaction Record
      await db.transactions.add({
        date: new Date().toISOString().split('T')[0],
        amount: repayAmount,
        type: txType,
        accountId: repayAccountId,
        categoryId: categoryId,
        description: txDesc,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
        note: 'Giao dịch thanh toán nợ/vay'
      });

      // 3. Update Account Balance
      const newBalance = txType === TransactionType.INCOME
        ? account.balance + repayAmount
        : account.balance - repayAmount;

      await db.accounts.update(repayAccountId, {
        balance: newBalance,
        updatedAt: now
      });

      // 4. Update Debt Remaining Amount
      const newRemaining = Math.max(0, selectedDebt.remainingAmount - repayAmount);
      await db.debts.update(selectedDebt.id, {
        remainingAmount: newRemaining,
        updatedAt: now
      });

      toast.success(selectedDebt.type === DebtType.DEBT ? 'Đã trả nợ thành công!' : 'Đã thu nợ thành công!');
      setRepayDialogOpen(false);
      setRepayAmount(0);
      setRepayAccountId('');
      setSelectedDebt(null);

    } catch (error) {
      console.error("Repayment failed", error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const totalDebt = debts
    .filter((d) => d.type === DebtType.DEBT)
    .reduce((sum, d) => sum + d.remainingAmount, 0);

  const totalLoan = debts
    .filter((d) => d.type === DebtType.LOAN)
    .reduce((sum, d) => sum + d.remainingAmount, 0);

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = dueDate.split('-').map(Number);
    const due = new Date(y, m - 1, d);

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

          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm khoản nợ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Chỉnh sửa khoản nợ' : 'Thêm khoản nợ mới'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên khoản {type === DebtType.DEBT ? 'nợ' : 'vay'}</Label>
                  <Input
                    id="name"
                    placeholder={type === DebtType.DEBT ? "VD: Vay mua xe" : "VD: Cho mượn tiền"}
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
                    <MoneyInput
                      id="amount"
                      value={amount}
                      onValueChange={(val) => {
                        setAmount(val);
                        // Auto-fill remaining if creating new
                        if (!editingId) setRemainingAmount(val);
                      }}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remainingAmount">Còn lại</Label>
                    <MoneyInput
                      id="remainingAmount"
                      value={remainingAmount}
                      onValueChange={setRemainingAmount}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Account Link Section - The Smart Flow */}
                {!editingId && (
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md space-y-2 border border-slate-200 dark:border-slate-800">
                    <Label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Wallet className="w-4 h-4" />
                      {type === DebtType.DEBT ? 'Nhận tiền về (Tùy chọn)' : 'Lấy tiền từ (Tùy chọn)'}
                    </Label>

                    <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                      <SelectTrigger className="bg-white dark:bg-black">
                        <SelectValue placeholder={type === DebtType.DEBT ? "Chọn tài khoản nhập tiền..." : "Chọn tài khoản xuất tiền..."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Không liên kết (Chỉ ghi nợ)</SelectItem>
                        {accounts.map(acc => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.name} ({formatCurrency(acc.balance)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedAccountId && selectedAccountId !== 'none' && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        {type === DebtType.DEBT
                          ? `Số dư ${accounts.find(a => a.id === selectedAccountId)?.name} sẽ tăng thêm ${formatCurrency(amount)}`
                          : `Số dư ${accounts.find(a => a.id === selectedAccountId)?.name} sẽ giảm đi ${formatCurrency(amount)}`
                        }
                      </p>
                    )}
                  </div>
                )}

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
                  <MoneyInput
                    id="monthlyPayment"
                    value={monthlyPayment}
                    onValueChange={setMonthlyPayment}
                    placeholder="0"
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

                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline" onClick={() => handleOpenChange(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleSaveDebt} className="bg-emerald-600 hover:bg-emerald-700">
                    {editingId ? 'Cập nhật' : 'Thêm khoản nợ'}
                  </Button>
                </div>
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
            const progress = debt.amount > 0
              ? ((debt.amount - debt.remainingAmount) / debt.amount) * 100
              : 0;
            const daysRemaining = getDaysRemaining(debt.dueDate);

            return (
              <Card key={debt.id} className="hover:shadow-lg transition-shadow relative group">
                <CardContent className="pt-6">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => handleEditClick(debt)}
                      title="Chỉnh sửa"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      onClick={() => openRepayDialog(debt)}
                      title={debt.type === DebtType.DEBT ? "Trả nợ" : "Thu nợ"}
                    >
                      <DollarSign className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteDebt(debt.id!, debt.name)}
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
                      <Progress value={Math.min(progress, 100)} className="h-2" />
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
                          className={`font-semibold ${daysRemaining < 0
                            ? 'text-red-800' // expired
                            : daysRemaining < 30
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

      {/* Repayment Dialog */}
      <Dialog open={repayDialogOpen} onOpenChange={setRepayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDebt?.type === DebtType.DEBT ? 'Thanh toán nợ' : 'Thu hồi nợ'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="p-3 bg-slate-50 rounded-md">
              <p className="text-sm text-slate-500">Khoản: <span className="font-semibold text-slate-800">{selectedDebt?.name}</span></p>
              <p className="text-sm text-slate-500">Còn lại: <span className="font-semibold text-slate-800">{formatCurrency(selectedDebt?.remainingAmount || 0)}</span></p>
            </div>

            <div className="space-y-2">
              <Label>Số tiền {selectedDebt?.type === DebtType.DEBT ? 'trả' : 'thu'}</Label>
              <MoneyInput
                value={repayAmount}
                onValueChange={setRepayAmount}
              />
            </div>

            <div className="space-y-2">
              <Label>{selectedDebt?.type === DebtType.DEBT ? 'Lấy tiền từ ví' : 'Nhận tiền vào ví'}</Label>
              <Select value={repayAccountId} onValueChange={setRepayAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tài khoản..." />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name} ({formatCurrency(acc.balance)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleRepay} className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2">
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout >
  );
}