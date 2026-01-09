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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAccounts, useTransactions } from '@/hooks/use-db';
import { db } from '@/db/db';
import { TransactionType } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { ArrowRightLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Transfer() {
  const accounts = useAccounts() || [];
  const transactions = useTransactions() || [];

  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState<number>(0); // Changed to number
  const [fee, setFee] = useState<number>(0); // Changed to number
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const transferHistory = transactions
    .filter(t => t.type === TransactionType.TRANSFER)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getAccountName = (accountId: string) => {
    return accounts.find((a) => a.id === accountId)?.name || 'Không xác định';
  };

  const getAccountIcon = (accountId: string) => {
    return accounts.find((a) => a.id === accountId)?.icon || '💳';
  };

  const getAccountBalance = (accountId: string) => {
    return accounts.find((a) => a.id === accountId)?.balance || 0;
  };

  const handleTransfer = async () => {
    if (!fromAccount || !toAccount || !amount || !date) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (fromAccount === toAccount) {
      toast.error('Không thể chuyển tiền vào cùng một tài khoản!');
      return;
    }

    const transferAmount = amount; // Already number
    const transferFee = fee || 0; // Already number
    const totalDeduction = transferAmount + transferFee;

    if (transferAmount <= 0) {
      toast.error('Số tiền phải lớn hơn 0!');
      return;
    }

    const fromBalance = getAccountBalance(fromAccount);
    if (totalDeduction > fromBalance) {
      toast.error(`Số dư không đủ (Cần: ${formatCurrency(totalDeduction)})`);
      return;
    }

    try {
      const now = Date.now();

      await db.transactions.add({
        description: 'Chuyển khoản',
        amount: transferAmount,
        date: date,
        type: TransactionType.TRANSFER as any, // Cast to match DB enum if strictly typed
        categoryId: 'transfer', // Use a 'transfer' category ID or System defined
        accountId: fromAccount,
        toAccountId: toAccount,
        fee: transferFee,
        note: note,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
      });

      // Update balances
      const sourceAccount = accounts.find(a => a.id === fromAccount);
      if (sourceAccount) {
        await db.accounts.update(fromAccount, {
          balance: sourceAccount.balance - totalDeduction,
          updatedAt: now
        });
      }

      const destAccount = accounts.find(a => a.id === toAccount);
      if (destAccount) {
        await db.accounts.update(toAccount, {
          balance: destAccount.balance + transferAmount,
          updatedAt: now
        });
      }

      toast.success('Chuyển tiền thành công!');

      // Reset form
      setAmount(0);
      setFee(0);
      setNote('');
      // Keep accounts selected for convenience
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error("Có lỗi xảy ra khi chuyển tiền");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chuyển tiền</h1>
          <p className="text-gray-600">Quản lý dòng tiền giữa các tài khoản của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
                Thực hiện chuyển tiền
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fromAccount">Từ tài khoản</Label>
                  <Select value={fromAccount} onValueChange={setFromAccount}>
                    <SelectTrigger id="fromAccount">
                      <SelectValue placeholder="Chọn tài khoản nguồn" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          <div className="flex items-center gap-2">
                            <span>{acc.icon}</span>
                            <span>{acc.name}</span>
                            <span className="text-gray-500 text-sm">
                              ({formatCurrency(acc.balance)})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fromAccount && (
                    <p className="text-sm text-gray-600">
                      Số dư: {formatCurrency(getAccountBalance(fromAccount))}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toAccount">Đến tài khoản</Label>
                  <Select value={toAccount} onValueChange={setToAccount}>
                    <SelectTrigger id="toAccount">
                      <SelectValue placeholder="Chọn tài khoản đích" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          <div className="flex items-center gap-2">
                            <span>{acc.icon}</span>
                            <span>{acc.name}</span>
                            <span className="text-gray-500 text-sm">
                              ({formatCurrency(acc.balance)})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {toAccount && (
                    <p className="text-sm text-gray-600">
                      Số dư: {formatCurrency(getAccountBalance(toAccount))}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Số tiền chuyển</Label>
                  <MoneyInput
                    id="amount"
                    value={amount}
                    onValueChange={setAmount}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Ngày giao dịch</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee">Phí giao dịch (Nếu có)</Label>
                <MoneyInput
                  id="fee"
                  value={fee}
                  onValueChange={setFee}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">Phí sẽ được trừ vào tài khoản nguồn</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea
                  id="note"
                  placeholder="Nhập ghi chú (tùy chọn)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {fromAccount && toAccount && amount && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Xác nhận chuyển tiền</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>
                      <strong>Từ:</strong> {getAccountIcon(fromAccount)}{' '}
                      {getAccountName(fromAccount)}
                    </p>
                    <p>
                      <strong>Đến:</strong> {getAccountIcon(toAccount)}{' '}
                      {getAccountName(toAccount)}
                    </p>
                    <p>
                      <strong>Số tiền:</strong> {formatCurrency(amount)}
                    </p>
                    {fee > 0 && (
                      <p>
                        <strong>Phí:</strong> {formatCurrency(fee)}
                      </p>
                    )}
                    <p className="pt-2 font-bold">
                      Tổng trừ ví nguồn: {formatCurrency(amount + (fee || 0))}
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleTransfer}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                size="lg"
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Xác nhận chuyển tiền
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Chọn tài khoản</h4>
                    <p className="text-sm text-gray-600">
                      Chọn tài khoản nguồn và tài khoản đích cho giao dịch chuyển tiền
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Nhập số tiền & Phí</h4>
                    <p className="text-sm text-gray-600">
                      Nhập số tiền chuyển và phí giao dịch (nếu có). Tổng số tiền sẽ được trừ vào tài khoản nguồn.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Xác nhận</h4>
                    <p className="text-sm text-gray-600">
                      Kiểm tra thông tin và nhấn xác nhận để hoàn tất giao dịch
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Lưu ý:</strong> Giao dịch chuyển tiền sẽ được ghi nhận ngay lập tức và
                  không thể hoàn tác.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lịch sử chuyển tiền</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Từ tài khoản</TableHead>
                  <TableHead>Đến tài khoản</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                  <TableHead className="text-right">Phí</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transferHistory.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">
                      {new Date(transfer.date).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getAccountIcon(transfer.accountId)}</span>
                        <span>{getAccountName(transfer.accountId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getAccountIcon(transfer.toAccountId || '')}</span>
                        <span>{getAccountName(transfer.toAccountId || '')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-blue-600">
                      {formatCurrency(transfer.amount)}
                    </TableCell>
                    <TableCell className="text-right text-gray-500">
                      {transfer.fee ? formatCurrency(transfer.fee) : '-'}
                    </TableCell>
                    <TableCell className="text-gray-600">{transfer.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}