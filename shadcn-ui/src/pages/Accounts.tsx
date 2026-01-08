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
import { useAccounts } from '@/hooks/use-db';
import { AccountType } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { Plus, Wallet, CreditCard, Calendar, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { db } from '@/db/db';

const accountTypeLabels: Record<AccountType, string> = {
  [AccountType.BANK]: 'Ngân hàng',
  [AccountType.EWALLET]: 'Ví điện tử',
  [AccountType.CREDIT_CARD]: 'Thẻ tín dụng',
  [AccountType.CASH]: 'Tiền mặt',
};

const accountIcons = ['🏦', '📱', '💳', '💵', '💰', '🏧', '💼'];
const accountColors = [
  '#10B981',
  '#3B82F6',
  '#EC4899',
  '#F59E0B',
  '#8B5CF6',
  '#EF4444',
  '#14B8A6',
];

export default function Accounts() {
  const accounts = useAccounts();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>(AccountType.BANK);
  const [balance, setBalance] = useState('');
  const [icon, setIcon] = useState('🏦');
  const [color, setColor] = useState('#10B981');
  const [creditLimit, setCreditLimit] = useState('');
  const [dueDate, setDueDate] = useState('');

  if (!accounts) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </Layout>
    )
  }

  const resetForm = () => {
    setName('');
    setType(AccountType.BANK);
    setBalance('');
    setIcon('🏦');
    setColor('#10B981');
    setCreditLimit('');
    setDueDate('');
    setEditingId(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetForm();
  };

  const handleEditClick = (account: any) => {
    setName(account.name);
    setType(account.type);
    setBalance(account.balance.toString());
    setIcon(account.icon || '🏦');
    setColor(account.color || '#10B981');
    setCreditLimit(account.creditLimit?.toString() || '');
    setDueDate(account.dueDate || '');
    setEditingId(account.id);
    setIsOpen(true);
  };

  const handleSaveAccount = async () => {
    if (!name || !balance) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (type === AccountType.CREDIT_CARD && !creditLimit) {
      toast.error('Vui lòng nhập hạn mức thẻ tín dụng!');
      return;
    }

    try {
      const now = Date.now();

      if (editingId) {
        // Update existing account
        await db.accounts.update(editingId, {
          name,
          balance: Number(balance),
          type,
          icon,
          color,
          creditLimit: creditLimit ? Number(creditLimit) : undefined,
          dueDate,
          updatedAt: now
        });
        toast.success('Cập nhật tài khoản thành công!');
      } else {
        // Create new account
        const accountData = {
          id: self.crypto.randomUUID(),
          name: name,
          balance: Number(balance),
          type: type,
          icon: icon,
          color: color,
          creditLimit: creditLimit ? Number(creditLimit) : undefined,
          dueDate: dueDate,
          createdAt: now,
          updatedAt: now,
          isDeleted: false
        };
        await db.accounts.add(accountData);
        toast.success('Thêm tài khoản thành công!');
      }

      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save account:", error);
      toast.error("Có lỗi xảy ra khi lưu tài khoản");
    }
  };

  const handleDeleteAccount = async (id: string, name: string) => {
    try {
      // Check if any transactions use this account
      const countSource = await db.transactions.where('accountId').equals(id).count();
      const countDest = await db.transactions.filter(t => t.toAccountId === id).count();
      const totalUsage = countSource + countDest;

      if (totalUsage > 0) {
        toast.error(`Không thể xóa tài khoản "${name}" vì đang có ${totalUsage} giao dịch liên quan!`);
        return;
      }

      if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản "${name}"?`)) return;

      await db.accounts.delete(id);
      toast.success(`Đã xóa tài khoản ${name}`);
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Có lỗi xảy ra khi xóa tài khoản");
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tài khoản</h1>
            <p className="text-gray-600">Quản lý các tài khoản tài chính của bạn</p>
          </div>

          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm tài khoản
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên tài khoản</Label>
                  <Input
                    id="name"
                    placeholder="VD: Vietcombank"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Loại tài khoản</Label>
                  <Select
                    value={type}
                    onValueChange={(value) => setType(value as AccountType)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(accountTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="balance">Số dư</Label>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="0"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                  />
                  {editingId && (
                    <p className="text-xs text-amber-600 italic">
                      Lưu ý: Thay đổi số dư tại đây sẽ không tạo giao dịch điều chỉnh.
                    </p>
                  )}
                </div>

                {type === AccountType.CREDIT_CARD && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="creditLimit">Hạn mức thẻ</Label>
                      <Input
                        id="creditLimit"
                        type="number"
                        placeholder="0"
                        value={creditLimit}
                        onChange={(e) => setCreditLimit(e.target.value)}
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
                  </>
                )}

                <div className="space-y-2">
                  <Label>Icon</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {accountIcons.map((i) => (
                      <button
                        key={i}
                        onClick={() => setIcon(i)}
                        className={`text-2xl p-2 rounded-lg border-2 transition-colors ${icon === i
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Màu sắc</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {accountColors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${color === c ? 'border-gray-900 scale-110' : 'border-gray-200'
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
                  <Button onClick={handleSaveAccount} className="bg-emerald-600 hover:bg-emerald-700">
                    {editingId ? 'Cập nhật' : 'Thêm tài khoản'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              Tổng tài sản ròng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalBalance)}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className="hover:shadow-lg transition-shadow relative group">
              <CardContent className="pt-6">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => handleEditClick(account)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteAccount(account.id, account.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    {account.icon}
                  </div>
                  <Badge variant="outline">{accountTypeLabels[account.type]}</Badge>
                </div>

                <h3 className="font-semibold text-lg mb-1">{account.name}</h3>
                <p
                  className={`text-2xl font-bold mb-4 ${account.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                >
                  {formatCurrency(account.balance)}
                </p>

                {account.type === AccountType.CREDIT_CARD && account.creditLimit && (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        Hạn mức
                      </span>
                      <span className="font-semibold">{formatCurrency(account.creditLimit)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Đã sử dụng</span>
                      <span className="font-semibold">
                        {formatCurrency(Math.abs(account.balance))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Còn lại</span>
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(account.creditLimit + account.balance)}
                      </span>
                    </div>
                    {account.dueDate && (
                      <div className="flex items-center justify-between text-sm pt-2 border-t">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Đáo hạn
                        </span>
                        <span className="font-semibold">
                          {new Date(account.dueDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}