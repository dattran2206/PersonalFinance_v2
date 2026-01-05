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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { accounts } from '@/lib/mockData';
import { formatCurrency } from '@/lib/calculations';
import { ArrowRightLeft, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface TransferHistory {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
  note: string;
  status: 'completed' | 'pending';
}

export default function Transfer() {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [transferHistory, setTransferHistory] = useState<TransferHistory[]>([
    {
      id: '1',
      fromAccountId: 'acc1',
      toAccountId: 'acc2',
      amount: 5000000,
      date: '2024-12-28',
      note: 'Chuyển tiền tiết kiệm',
      status: 'completed',
    },
    {
      id: '2',
      fromAccountId: 'acc2',
      toAccountId: 'acc3',
      amount: 2000000,
      date: '2024-12-27',
      note: 'Nạp ví MoMo',
      status: 'completed',
    },
    {
      id: '3',
      fromAccountId: 'acc1',
      toAccountId: 'acc4',
      amount: 1000000,
      date: '2024-12-26',
      note: 'Rút tiền mặt',
      status: 'completed',
    },
  ]);

  const getAccountName = (accountId: string) => {
    return accounts.find((a) => a.id === accountId)?.name || 'Không xác định';
  };

  const getAccountIcon = (accountId: string) => {
    return accounts.find((a) => a.id === accountId)?.icon || '💳';
  };

  const getAccountBalance = (accountId: string) => {
    return accounts.find((a) => a.id === accountId)?.balance || 0;
  };

  const handleTransfer = () => {
    if (!fromAccount || !toAccount || !amount) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (fromAccount === toAccount) {
      toast.error('Không thể chuyển tiền vào cùng một tài khoản!');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (transferAmount <= 0) {
      toast.error('Số tiền phải lớn hơn 0!');
      return;
    }

    const fromBalance = getAccountBalance(fromAccount);
    if (transferAmount > fromBalance) {
      toast.error('Số dư tài khoản nguồn không đủ!');
      return;
    }

    const newTransfer: TransferHistory = {
      id: Date.now().toString(),
      fromAccountId: fromAccount,
      toAccountId: toAccount,
      amount: transferAmount,
      date: new Date().toISOString().split('T')[0],
      note: note || 'Chuyển tiền giữa các tài khoản',
      status: 'completed',
    };

    setTransferHistory([newTransfer, ...transferHistory]);
    toast.success('Chuyển tiền thành công!');

    // Reset form
    setFromAccount('');
    setToAccount('');
    setAmount('');
    setNote('');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chuyển tiền giữa tài khoản</h1>
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

              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền chuyển</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
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
                      <strong>Số tiền:</strong> {formatCurrency(parseFloat(amount))}
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
                    <h4 className="font-semibold text-gray-900 mb-1">Nhập số tiền</h4>
                    <p className="text-sm text-gray-600">
                      Nhập số tiền muốn chuyển, đảm bảo số dư tài khoản nguồn đủ
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
                  <TableHead>Ghi chú</TableHead>
                  <TableHead>Trạng thái</TableHead>
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
                        <span>{getAccountIcon(transfer.fromAccountId)}</span>
                        <span>{getAccountName(transfer.fromAccountId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getAccountIcon(transfer.toAccountId)}</span>
                        <span>{getAccountName(transfer.toAccountId)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-blue-600">
                      {formatCurrency(transfer.amount)}
                    </TableCell>
                    <TableCell className="text-gray-600">{transfer.note}</TableCell>
                    <TableCell>
                      {transfer.status === 'completed' ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Hoàn thành
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                          <Clock className="w-3 h-3 mr-1" />
                          Đang xử lý
                        </Badge>
                      )}
                    </TableCell>
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