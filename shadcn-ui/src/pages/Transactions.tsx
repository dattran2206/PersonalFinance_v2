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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useTransactions, useCategories, useAccounts } from '@/hooks/use-db';
import { TransactionType, RecurrenceType } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { Plus, Search, ArrowUpCircle, ArrowDownCircle, Repeat, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/db/db';

const transactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.INCOME]: 'Thu nhập',
  [TransactionType.EXPENSE]: 'Chi tiêu',
  [TransactionType.TRANSFER]: 'Chuyển khoản',
};

const recurrenceLabels: Record<RecurrenceType, string> = {
  [RecurrenceType.NONE]: 'Không lặp lại',
  [RecurrenceType.DAILY]: 'Hàng ngày',
  [RecurrenceType.WEEKLY]: 'Hàng tuần',
  [RecurrenceType.MONTHLY]: 'Hàng tháng',
  [RecurrenceType.YEARLY]: 'Hàng năm',
};

export default function Transactions() {
  const transactions = useTransactions();
  const categories = useCategories();
  const accounts = useAccounts();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [date, setDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [amount, setAmount] = useState<number>(0); // Changed to number
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [fee, setFee] = useState<number>(0); // Changed to number
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceType>(RecurrenceType.NONE);

  if (!transactions || !categories || !accounts) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </Layout>
    )
  }

  const handleAddTransaction = async () => {
    if (!amount || !accountId) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (type !== TransactionType.TRANSFER && !categoryId) {
      toast.error('Vui lòng chọn danh mục!');
      return;
    }

    if (type === TransactionType.TRANSFER) {
      if (!toAccountId) {
        toast.error('Vui lòng chọn tài khoản đích!');
        return;
      }
      if (accountId === toAccountId) {
        toast.error('Không thể chuyển khoản đến cùng một tài khoản!');
        return;
      }
    }

    // Check balance for Expense and Transfer
    if (type === TransactionType.EXPENSE || type === TransactionType.TRANSFER) {
      const sourceAccount = accounts?.find(a => a.id === accountId);
      if (sourceAccount) {
        // amount and fee are already numbers
        const totalAmount = amount + (type === TransactionType.TRANSFER && fee ? fee : 0);
        if (sourceAccount.balance < totalAmount) {
          toast.error('Số dư tài khoản không đủ để thực hiện giao dịch!');
          return;
        }
      }
    }

    try {
      const now = Date.now();
      const transactionData = {
        description: description || '',
        amount: amount, // already number
        date: date, // ISO Date string from input type="date"
        type: type,
        categoryId: categoryId || '',
        accountId: accountId,
        toAccountId: toAccountId,
        fee: fee ? fee : undefined, // already number
        note: note,
        recurrence: recurrence,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
      };

      await db.transactions.add(transactionData);

      // Handle account balance updates
      const sourceAccount = accounts.find((a) => a.id === accountId);
      if (sourceAccount) {
        let newBalance = sourceAccount.balance;
        if (type === TransactionType.EXPENSE) {
          newBalance -= amount;
        } else if (type === TransactionType.INCOME) {
          newBalance += amount;
        } else if (type === TransactionType.TRANSFER) {
          newBalance -= amount;
          if (fee) newBalance -= fee;
        }
        await db.accounts.update(accountId, { balance: newBalance, updatedAt: now });
      }

      if (type === TransactionType.TRANSFER && toAccountId) {
        const destAccount = accounts.find((a) => a.id === toAccountId);
        if (destAccount) {
          const newDestBalance = destAccount.balance + amount;
          await db.accounts.update(toAccountId, { balance: newDestBalance, updatedAt: now });
        }
      }

      toast.success('Thêm giao dịch thành công!');
      setIsOpen(false);
      setAmount(0);
      setCategoryId('');
      setAccountId('');
      setToAccountId('');
      setFee(0);
      setDescription('');
      setNote('');
      setRecurrence(RecurrenceType.NONE);
    } catch (error) {
      console.error("Failed to add transaction:", error);
      toast.error("Có lỗi xảy ra khi lưu giao dịch");
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) return;

    try {
      const transaction = transactions.find((t) => t.id === id);
      if (!transaction) return;

      const now = Date.now();
      await db.transactions.delete(id);

      // Revert account balance
      const sourceAccount = accounts.find((a) => a.id === transaction.accountId);
      if (sourceAccount) {
        let newBalance = sourceAccount.balance;

        // Reverse logic
        if (transaction.type === TransactionType.EXPENSE) {
          newBalance += transaction.amount;
        } else if (transaction.type === TransactionType.INCOME) {
          newBalance -= transaction.amount;
        } else if (transaction.type === TransactionType.TRANSFER) {
          newBalance += transaction.amount;
          if (transaction.fee) newBalance += transaction.fee;
        }
        await db.accounts.update(sourceAccount.id, { balance: newBalance, updatedAt: now });
      }

      if (transaction.type === TransactionType.TRANSFER && transaction.toAccountId) {
        const destAccount = accounts.find((a) => a.id === transaction.toAccountId);
        if (destAccount) {
          const newDestBalance = destAccount.balance - transaction.amount; // Reverse transfer
          await db.accounts.update(destAccount.id, { balance: newDestBalance, updatedAt: now });
        }
      }

      toast.success('Đã xóa giao dịch và cập nhật số dư!');
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      toast.error("Có lỗi xảy ra khi xóa giao dịch");
    }
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Chuyển khoản';
    return categories.find((c) => c.id === categoryId)?.name || 'Không xác định';
  };

  const getCategoryIcon = (categoryId?: string) => {
    if (!categoryId) return '🔄';
    return categories.find((c) => c.id === categoryId)?.icon || '❓';
  };

  const getAccountName = (accountId: string) => {
    return accounts.find((a) => a.id === accountId)?.name || 'Không xác định';
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      (transaction.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(transaction.categoryId).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory =
      filterCategory === 'all' || transaction.categoryId === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const availableCategories =
    type === TransactionType.TRANSFER
      ? []
      : categories.filter((c) =>
        type === TransactionType.INCOME ? c.type === 'income' : c.type === 'expense'
      );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Giao dịch</h1>
            <p className="text-gray-600">Quản lý các giao dịch thu chi của bạn</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm giao dịch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm giao dịch mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Ngày</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Loại giao dịch</Label>
                  <Select
                    value={type}
                    onValueChange={(value) => {
                      setType(value as TransactionType);
                      setCategoryId('');
                      setToAccountId('');
                    }}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(transactionTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Số tiền</Label>
                  <MoneyInput
                    id="amount"
                    value={amount}
                    onValueChange={setAmount}
                    placeholder="0"
                  />
                </div>

                {type !== TransactionType.TRANSFER && (
                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((cat) => (
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
                )}

                <div className="space-y-2">
                  <Label htmlFor="account">
                    {type === TransactionType.TRANSFER ? 'Tài khoản nguồn' : 'Tài khoản'}
                  </Label>
                  <Select value={accountId} onValueChange={setAccountId}>
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Chọn tài khoản" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          <div className="flex items-center gap-2">
                            <span>{acc.icon}</span>
                            <span>{acc.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {type === TransactionType.TRANSFER && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="toAccount">Tài khoản đích</Label>
                      <Select value={toAccountId} onValueChange={setToAccountId}>
                        <SelectTrigger id="toAccount">
                          <SelectValue placeholder="Chọn tài khoản đích" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((acc) => acc.id !== accountId)
                            .map((acc) => (
                              <SelectItem key={acc.id} value={acc.id}>
                                <div className="flex items-center gap-2">
                                  <span>{acc.icon}</span>
                                  <span>{acc.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fee">Phí giao dịch (tùy chọn)</Label>
                      <MoneyInput
                        id="fee"
                        value={fee}
                        onValueChange={setFee}
                        placeholder="0"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="recurrence">Lặp lại</Label>
                  <Select
                    value={recurrence}
                    onValueChange={(value) => setRecurrence(value as RecurrenceType)}
                  >
                    <SelectTrigger id="recurrence">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(recurrenceLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Input
                    id="description"
                    placeholder="VD: Ăn trưa"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Textarea
                    id="note"
                    placeholder="Ghi chú thêm (tùy chọn)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <Button onClick={handleAddTransaction} className="w-full">
                  Thêm giao dịch
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bộ lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Tìm kiếm</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Tìm kiếm giao dịch..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filterType">Loại giao dịch</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger id="filterType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value={TransactionType.INCOME}>Thu nhập</SelectItem>
                    <SelectItem value={TransactionType.EXPENSE}>Chi tiêu</SelectItem>
                    <SelectItem value={TransactionType.TRANSFER}>Chuyển khoản</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filterCategory">Danh mục</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger id="filterCategory">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách giao dịch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Tài khoản</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead className="text-right">Số tiền</TableHead>
                    <TableHead>Lặp lại</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {new Date(transaction.date).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{getCategoryIcon(transaction.categoryId)}</span>
                          <span>{getCategoryName(transaction.categoryId)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{getAccountName(transaction.accountId)}</span>
                          {transaction.toAccountId && (
                            <span className="text-xs text-gray-500">
                              → {getAccountName(transaction.toAccountId)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {transaction.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {transaction.type === TransactionType.INCOME ? (
                            <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
                          ) : transaction.type === TransactionType.TRANSFER ? (
                            <Repeat className="w-4 h-4 text-blue-600" />
                          ) : (
                            <ArrowDownCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span
                            className={`font-semibold ${transaction.type === TransactionType.INCOME
                              ? 'text-emerald-600'
                              : transaction.type === TransactionType.TRANSFER
                                ? 'text-blue-600'
                                : 'text-red-600'
                              }`}
                          >
                            {transaction.type === TransactionType.INCOME ? '+' : transaction.type === TransactionType.TRANSFER ? '' : '-'}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        {transaction.fee && transaction.fee > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Phí: {formatCurrency(transaction.fee)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {transaction.recurrence && transaction.recurrence !== RecurrenceType.NONE && (
                          <Badge variant="outline" className="text-xs">
                            {recurrenceLabels[transaction.recurrence]}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteTransaction(transaction.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}