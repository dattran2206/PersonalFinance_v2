import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useFunds, useAccounts } from '@/hooks/use-db';
import { formatCurrency, getAccountAllocatedAmount, getAccountAvailableAmount, validateFundAllocation } from '@/lib/calculations';
import { Plus, Target, Calendar, TrendingUp, Trash2, Pencil, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/db/db';
import { IconPicker } from '@/components/ui/icon-picker';
import { MoneyInput } from '@/components/ui/money-input';
import { createFundHistory } from '@/lib/fundHistoryHelpers';
import { TransactionType } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { FundHistoryList } from '@/components/fund/FundHistoryList';
import { History } from 'lucide-react';

const fundColors = [
  '#EF4444',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
];

export default function Funds() {
  const funds = useFunds() || [];
  const accounts = useAccounts() || [];
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [color, setColor] = useState('#10B981');

  // Deposit/Withdraw dialog
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [actionFundId, setActionFundId] = useState<string>('');
  const [actionAmount, setActionAmount] = useState<number>(0);
  const [selectedSourceAccountId, setSelectedSourceAccountId] = useState<string>('');
  const [actionNote, setActionNote] = useState<string>('');

  // History dialog
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyFundId, setHistoryFundId] = useState<string>('');

  const resetForm = () => {
    setName('');
    setAccountId('');
    setTargetAmount(0);
    setCurrentAmount(0);
    setDescription('');
    setDeadline('');
    setIcon('🎯');
    setColor('#10B981');
    setEditingId(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetForm();
  };

  const handleEditClick = (fund: any) => {
    setName(fund.name);
    setAccountId(fund.accountId);
    setTargetAmount(fund.targetAmount);
    setCurrentAmount(fund.currentAmount);
    setDescription(fund.description || '');
    setDeadline(fund.deadline || '');
    setIcon(fund.icon);
    setColor(fund.color);
    setEditingId(fund.id);
    setIsOpen(true);
  };

  const handleSaveFund = async () => {
    if (!name || !targetAmount) {
      toast.error('Vui lòng điền tên và mục tiêu!');
      return;
    }

    if (!accountId && !editingId) {
      toast.error('Vui lòng chọn tài khoản!');
      return;
    }

    try {
      const now = Date.now();
      if (editingId) {
        // Update
        await db.funds.update(editingId, {
          name,
          targetAmount: targetAmount,
          currentAmount: currentAmount || 0,
          description,
          deadline,
          icon,
          color,
          updatedAt: now
        });
        toast.success('Cập nhật quỹ thành công!');
      } else {
        // Create new fund
        await db.funds.add({
          id: self.crypto.randomUUID(),
          name,
          accountId: accountId,
          targetAmount: targetAmount,
          currentAmount: 0,
          description,
          deadline,
          icon,
          color,
          createdAt: now,
          updatedAt: now,
          isDeleted: false
        });
        toast.success('Thêm quỹ thành công!');
      }
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save fund:", error);
      toast.error("Có lỗi xảy ra khi lưu quỹ");
    }
  };

  const handleDeleteFund = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa quỹ "${name}"?`)) return;
    try {
      await db.funds.delete(id);
      toast.success(`Đã xóa quỹ ${name}`);
    } catch (error) {
      console.error("Failed to delete fund:", error);
      toast.error("Có lỗi xảy ra khi xóa quỹ");
    }
  };

  const handleFundAction = async () => {
    if (!actionFundId || actionAmount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ!');
      return;
    }

    // For deposits, source account is required
    if (actionType === 'deposit' && !selectedSourceAccountId) {
      toast.error('Vui lòng chọn tài khoản nguồn!');
      return;
    }

    try {
      const fund = funds.find(f => f.id === actionFundId);
      const fundAccount = accounts.find(a => a.id === fund?.accountId);
      const sourceAccount = actionType === 'deposit'
        ? accounts.find(a => a.id === selectedSourceAccountId)
        : null;

      if (!fund || !fundAccount) {
        toast.error('Không tìm thấy quỹ hoặc tài khoản!');
        return;
      }

      const now = Date.now();
      let transferTransactionId: number | undefined;

      // CASE 1: Deposit from different account
      if (actionType === 'deposit' && selectedSourceAccountId !== fund.accountId) {
        if (!sourceAccount) {
          toast.error('Tài khoản nguồn không hợp lệ!');
          return;
        }

        // Validate source account has enough balance
        if (sourceAccount.balance < actionAmount) {
          toast.error('Số dư tài khoản nguồn không đủ!');
          return;
        }

        // Create transfer transaction
        transferTransactionId = await db.transactions.add({
          description: `Chuyển tiền để nạp vào quỹ "${fund.name}"`,
          amount: actionAmount,
          date: new Date().toISOString().split('T')[0],
          type: TransactionType.TRANSFER,
          categoryId: '',
          accountId: selectedSourceAccountId,
          toAccountId: fund.accountId,
          note: actionNote,
          createdAt: now,
          updatedAt: now,
          isDeleted: false
        });

        // Update account balances
        await db.accounts.update(selectedSourceAccountId, {
          balance: sourceAccount.balance - actionAmount,
          updatedAt: now
        });

        await db.accounts.update(fund.accountId, {
          balance: fundAccount.balance + actionAmount,
          updatedAt: now
        });
      }

      // CASE 2: Deposit from same account - validate available balance
      if (actionType === 'deposit' && selectedSourceAccountId === fund.accountId) {
        const validation = validateFundAllocation(
          fund.accountId,
          fund.currentAmount + actionAmount,
          fund.currentAmount,
          fundAccount,
          funds
        );

        if (!validation.valid) {
          toast.error(validation.error || 'Số dư khả dụng không đủ!');
          return;
        }
      }

      // CASE 3: Withdraw - validate fund has enough
      if (actionType === 'withdraw') {
        if (fund.currentAmount < actionAmount) {
          toast.error('Số dư quỹ không đủ!');
          return;
        }
      }

      // Update fund amount
      const newAmount = actionType === 'deposit'
        ? fund.currentAmount + actionAmount
        : fund.currentAmount - actionAmount;

      await db.funds.update(actionFundId, {
        currentAmount: newAmount,
        updatedAt: now
      });

      // Create fund history
      await createFundHistory(
        actionFundId,
        actionAmount,
        actionType,
        actionNote || undefined,
        actionType === 'deposit' ? selectedSourceAccountId : undefined,
        transferTransactionId
      );

      toast.success(
        actionType === 'deposit'
          ? 'Nạp tiền vào quỹ thành công!'
          : 'Rút tiền từ quỹ thành công!'
      );

      // Reset form
      setActionDialogOpen(false);
      setActionAmount(0);
      setActionFundId('');
      setSelectedSourceAccountId('');
      setActionNote('');
    } catch (error) {
      console.error('Failed to update fund:', error);
      toast.error('Có lỗi xảy ra!');
    }
  };

  const totalSaved = funds.reduce((sum, fund) => sum + (fund.currentAmount || 0), 0);
  const totalTarget = funds.reduce((sum, fund) => sum + fund.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part

    // Parse local date
    const [y, m, d] = deadline.split('-').map(Number);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quỹ tiết kiệm</h1>
            <p className="text-gray-600">Theo dõi các mục tiêu tiết kiệm của bạn</p>
          </div>

          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm quỹ mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Chỉnh sửa quỹ tiết kiệm' : 'Thêm quỹ tiết kiệm mới'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên quỹ</Label>
                  <Input
                    id="name"
                    placeholder="VD: Quỹ du lịch"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {!editingId && (
                  <div className="space-y-2">
                    <Label htmlFor="account">Tài khoản</Label>
                    <Select value={accountId} onValueChange={setAccountId}>
                      <SelectTrigger id="account">
                        <SelectValue placeholder="Chọn tài khoản" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(acc => (
                          <SelectItem key={acc.id} value={acc.id}>
                            <div className="flex items-center gap-2">
                              <span>{acc.icon}</span>
                              <span>{acc.name}</span>
                              <span className="text-xs text-gray-500">
                                ({formatCurrency(acc.balance)})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetAmount">Mục tiêu</Label>
                    <MoneyInput
                      id="targetAmount"
                      value={targetAmount}
                      onValueChange={setTargetAmount}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Thời hạn (tùy chọn)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả về quỹ tiết kiệm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Biểu tượng</Label>
                  <div>
                    <IconPicker
                      value={icon}
                      onChange={setIcon}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Màu sắc</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {fundColors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-full h-10 rounded-lg border-2 transition-all ${color === c ? 'border-gray-900 scale-110' : 'border-gray-200'
                          }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline" onClick={() => handleOpenChange(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleSaveFund} className="bg-emerald-600 hover:bg-emerald-700">
                    {editingId ? 'Cập nhật' : 'Thêm quỹ'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              Tổng quan tiết kiệm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đã tiết kiệm</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalSaved)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Mục tiêu</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalTarget)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Còn lại</p>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(totalTarget - totalSaved)}
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tiến độ tổng thể</span>
                <span className="font-semibold">{overallProgress.toFixed(1)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {funds.map((fund) => {
            const currentAmount = fund.currentAmount || 0;
            const progress = (currentAmount / fund.targetAmount) * 100;
            const remaining = fund.targetAmount - currentAmount;
            const daysRemaining = fund.deadline ? getDaysRemaining(fund.deadline) : null;

            return (
              <Card key={fund.id} className="hover:shadow-lg transition-shadow relative group">
                <CardContent className="pt-6">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setHistoryFundId(fund.id!);
                        setHistoryDialogOpen(true);
                      }}
                      title="Lịch sử"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => handleEditClick(fund)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteFund(fund.id!, fund.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
                      style={{ backgroundColor: `${fund.color}20` }}
                    >
                      {fund.icon}
                    </div>
                    {daysRemaining !== null && (
                      <Badge
                        variant="outline"
                        className={
                          daysRemaining < 0
                            ? 'border-gray-200 text-gray-500' // expired
                            : daysRemaining < 30
                              ? 'border-red-200 text-red-700'
                              : daysRemaining < 90
                                ? 'border-amber-200 text-amber-700'
                                : 'border-emerald-200 text-emerald-700'
                        }
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        {daysRemaining > 0 ? `${daysRemaining} ngày` : 'Đã quá hạn'}
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-xl mb-2">{fund.name}</h3>
                  {fund.description && (
                    <p className="text-sm text-gray-600 mb-4">{fund.description}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-gray-600">Đã tiết kiệm</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">
                          {formatCurrency(fund.currentAmount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          / {formatCurrency(fund.targetAmount)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Tiến độ</span>
                        <span className="font-semibold">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>Còn lại</span>
                      </div>
                      <span className="font-semibold text-amber-600">
                        {formatCurrency(remaining)}
                      </span>
                    </div>

                    {fund.deadline && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Thời hạn</span>
                        <span className="font-semibold">
                          {new Date(fund.deadline).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setActionFundId(fund.id!);
                          setActionType('deposit');
                          setActionAmount(0);
                          setActionDialogOpen(true);
                        }}
                      >
                        <ArrowDownCircle className="w-4 h-4 mr-2" />
                        Nạp tiền
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setActionFundId(fund.id!);
                          setActionType('withdraw');
                          setActionAmount(0);
                          setActionDialogOpen(true);
                        }}
                      >
                        <ArrowUpCircle className="w-4 h-4 mr-2" />
                        Rút tiền
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'deposit' ? 'Nạp tiền vào quỹ' : 'Rút tiền từ quỹ'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {actionType === 'deposit' && (
                <div className="space-y-2">
                  <Label>Tài khoản nguồn</Label>
                  <Select value={selectedSourceAccountId} onValueChange={setSelectedSourceAccountId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tài khoản" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map(acc => {
                        const allocated = getAccountAllocatedAmount(acc.id, funds);
                        const available = acc.balance - allocated;

                        return (
                          <SelectItem key={acc.id} value={acc.id}>
                            <div className="flex flex-col">
                              <span>{acc.icon} {acc.name}</span>
                              <span className="text-xs text-gray-500">
                                Khả dụng: {formatCurrency(available)}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedSourceAccountId && actionType === 'deposit' && (
                <div className="bg-blue-50 p-3 rounded-md space-y-1">
                  <div className="text-sm">
                    <span className="text-gray-600">Số dư tài khoản: </span>
                    <span className="font-semibold">
                      {formatCurrency(accounts.find(a => a.id === selectedSourceAccountId)?.balance || 0)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Đã phân bổ cho quỹ khác: </span>
                    <span className="font-semibold text-amber-600">
                      {formatCurrency(getAccountAllocatedAmount(selectedSourceAccountId, funds))}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Khả dụng để nạp: </span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(getAccountAvailableAmount(
                        accounts.find(a => a.id === selectedSourceAccountId)!,
                        funds
                      ))}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Số tiền</Label>
                <MoneyInput
                  value={actionAmount}
                  onValueChange={setActionAmount}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Ghi chú (tùy chọn)</Label>
                <Textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="VD: Lương tháng 1, Tiền thưởng..."
                  rows={2}
                />
              </div>

              <Button onClick={handleFundAction} className="w-full">
                {actionType === 'deposit' ? 'Nạp tiền' : 'Rút tiền'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lịch sử giao dịch quỹ</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {historyFundId && <FundHistoryList fundId={historyFundId} />}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}