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
import { Badge } from '@/components/ui/badge';
import { accounts } from '@/lib/mockData';
import { AccountType } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { Plus, Pencil, Trash2, Wallet, CreditCard, Smartphone, Banknote } from 'lucide-react';

export default function Accounts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getAccountTypeLabel = (type: AccountType) => {
    switch (type) {
      case AccountType.BANK:
        return 'Ngân hàng';
      case AccountType.EWALLET:
        return 'Ví điện tử';
      case AccountType.CREDIT_CARD:
        return 'Thẻ tín dụng';
      case AccountType.CASH:
        return 'Tiền mặt';
      default:
        return 'Khác';
    }
  };

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case AccountType.BANK:
        return <Wallet className="w-5 h-5" />;
      case AccountType.EWALLET:
        return <Smartphone className="w-5 h-5" />;
      case AccountType.CREDIT_CARD:
        return <CreditCard className="w-5 h-5" />;
      case AccountType.CASH:
        return <Banknote className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý tài khoản</h1>
            <p className="text-gray-600">Theo dõi tất cả tài khoản tài chính của bạn</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm tài khoản
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm tài khoản mới</DialogTitle>
                <DialogDescription>Thêm tài khoản tài chính mới</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Tên tài khoản</Label>
                  <Input id="accountName" placeholder="Vietcombank" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Loại tài khoản</Label>
                  <Select defaultValue="bank">
                    <SelectTrigger id="accountType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Ngân hàng</SelectItem>
                      <SelectItem value="ewallet">Ví điện tử</SelectItem>
                      <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                      <SelectItem value="cash">Tiền mặt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balance">Số dư hiện tại</Label>
                  <Input id="balance" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (emoji)</Label>
                  <Input id="icon" placeholder="🏦" maxLength={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountColor">Màu sắc</Label>
                  <Input id="accountColor" type="color" defaultValue="#10B981" />
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

        <Card className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
          <CardHeader>
            <CardTitle className="text-white">Tổng tài sản</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{formatCurrency(totalBalance)}</p>
            <p className="text-emerald-100 mt-2">Tổng số dư tất cả tài khoản</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    {getAccountIcon(account.type)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{account.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
                  </div>
                  <Badge variant="outline">{getAccountTypeLabel(account.type)}</Badge>
                  <p
                    className={`text-2xl font-bold mt-3 ${
                      account.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}