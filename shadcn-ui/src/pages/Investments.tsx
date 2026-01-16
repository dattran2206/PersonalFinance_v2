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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useInvestments, useAccounts } from '@/hooks/use-db';
import { InvestmentType, TransactionType } from '@/lib/types';
import {
  formatCurrency,
  calculateInvestmentValue,
  calculateInvestmentProfit,
  calculateInvestmentProfitPercentage,
} from '@/lib/calculations';
import { Plus, TrendingUp, TrendingDown, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/db/db';
import { MoneyInput } from '@/components/ui/money-input';

import { PriceUpdaterDialog } from '@/components/investments/PriceUpdaterDialog';

export default function Investments() {
  const investments = useInvestments() || [];
  const accounts = useAccounts() || [];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<InvestmentType>(InvestmentType.STOCK);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [sourceAccountId, setSourceAccountId] = useState<string>('');

  const resetForm = () => {
    setName('');
    setType(InvestmentType.STOCK);
    setPurchasePrice(0);
    setCurrentPrice(0);
    setQuantity(0);
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setSourceAccountId('');
    setEditingId(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
  };

  const handleEditClick = (inv: any) => {
    setName(inv.name);
    setType(inv.type as InvestmentType);
    setPurchasePrice(inv.purchasePrice);
    setCurrentPrice(inv.currentPrice);
    setQuantity(inv.quantity);
    setPurchaseDate(inv.purchaseDate);
    setDescription(inv.description || '');
    setSourceAccountId(inv.accountId || '');
    setEditingId(inv.id);
    setIsDialogOpen(true);
  };

  const handleSaveInvestment = async () => {
    if (!name || !purchasePrice || !quantity || !purchaseDate) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const now = Date.now();
      const totalCost = purchasePrice * quantity;

      const invData = {
        name,
        type,
        purchasePrice: purchasePrice,
        currentPrice: currentPrice || purchasePrice,
        quantity: quantity,
        purchaseDate,
        description,
        accountId: sourceAccountId || undefined,
        updatedAt: now,
      };

      if (editingId) {
        await db.investments.update(editingId, invData);
        toast.success('Cập nhật khoản đầu tư thành công!');
      } else {
        // --- BUY FLOW ---
        let finalSourceAccount = null;
        if (sourceAccountId) {
          finalSourceAccount = accounts.find(a => a.id === sourceAccountId);
          if (finalSourceAccount && finalSourceAccount.balance < totalCost) {
            toast.error('Số dư tài khoản không đủ để thực hiện đầu tư!');
            return;
          }
        }

        await db.investments.add({
          id: self.crypto.randomUUID(),
          ...invData,
          createdAt: now,
          isDeleted: false,
        });

        if (finalSourceAccount && sourceAccountId) {
          await db.accounts.update(sourceAccountId, {
            balance: finalSourceAccount.balance - totalCost,
            updatedAt: now
          });

          await db.transactions.add({
            description: `Đầu tư: ${name} (${quantity} x ${formatCurrency(purchasePrice)})`,
            amount: totalCost,
            date: purchaseDate,
            type: TransactionType.TRANSFER,
            accountId: sourceAccountId,
            toAccountId: 'INVESTMENT',
            note: description,
            categoryId: 'INVESTMENT',
            createdAt: now,
            updatedAt: now,
            isDeleted: false
          });
        }

        toast.success('Thêm khoản đầu tư & trừ tiền thành công!');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save investment:", error);
      toast.error("Có lỗi xảy ra khi lưu khoản đầu tư");
    }
  };

  const handleDeleteInvestment = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khoản đầu tư "${name}"?`)) return;
    try {
      await db.investments.delete(id);
      toast.success(`Đã xóa khoản đầu tư ${name}`);
    } catch (error) {
      console.error("Failed to delete investment:", error);
      toast.error("Có lỗi xảy ra khi xóa khoản đầu tư");
    }
  };

  const getInvestmentTypeLabel = (type: string) => {
    switch (type) {
      case InvestmentType.STOCK: return 'Cổ phiếu';
      case InvestmentType.BOND: return 'Trái phiếu';
      case InvestmentType.FUND: return 'Chứng chỉ quỹ';
      case InvestmentType.CRYPTO: return 'Crypto';
      case InvestmentType.REAL_ESTATE: return 'Bất động sản';
      case InvestmentType.GOLD: return 'Vàng';
      case InvestmentType.COMMODITY: return 'Hàng hóa';
      case InvestmentType.SAVING: return 'Tiết kiệm';
      default: return 'Khác';
    }
  };

  const totalValue = investments.reduce(
    (sum, inv) => sum + calculateInvestmentValue(inv),
    0
  );
  const totalProfit = investments.reduce(
    (sum, inv) => sum + calculateInvestmentProfit(inv),
    0
  );
  const totalInvested = totalValue - totalProfit;
  const totalProfitPercentage =
    totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đầu tư</h1>
            <p className="text-gray-600">Theo dõi danh mục đầu tư của bạn</p>
          </div>

          <div className="flex gap-2">
            <PriceUpdaterDialog investments={investments} />

            <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Đầu tư mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Chỉnh sửa khoản đầu tư' : 'Mua tài sản đầu tư'}</DialogTitle>
                  <DialogDescription>
                    {editingId
                      ? 'Cập nhật thông tin khoản đầu tư'
                      : 'Ghi nhận giao dịch mua tài sản mới. Số tiền sẽ được trừ từ tài khoản nguồn.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">

                  {!editingId && (
                    <div className="space-y-2">
                      <Label htmlFor="sourceAccount">Nguồn tiền (Tài khoản)</Label>
                      <Select value={sourceAccountId} onValueChange={setSourceAccountId}>
                        <SelectTrigger id="sourceAccount">
                          <SelectValue placeholder="Chọn tài khoản thanh toán..." />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map(acc => (
                            <SelectItem key={acc.id} value={acc.id!}>
                              {acc.name} ({formatCurrency(acc.balance)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invName">Tên mã/Tài sản</Label>
                      <Input
                        id="invName"
                        placeholder="VD: VCB, SJC..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invType">Loại tài sản</Label>
                      <Select value={type} onValueChange={(val) => setType(val as InvestmentType)}>
                        <SelectTrigger id="invType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stock">Cổ phiếu</SelectItem>
                          <SelectItem value="bond">Trái phiếu</SelectItem>
                          <SelectItem value="fund">Chứng chỉ quỹ</SelectItem>
                          <SelectItem value="crypto">Crypto (Coin)</SelectItem>
                          <SelectItem value="gold">Vàng</SelectItem>
                          <SelectItem value="real_estate">Bất động sản</SelectItem>
                          <SelectItem value="saving">Sổ tiết kiệm</SelectItem>
                          <SelectItem value="commodity">Hàng hóa khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice">Đơn giá mua</Label>
                      <MoneyInput
                        id="purchasePrice"
                        value={purchasePrice}
                        onValueChange={setPurchasePrice}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Số lượng</Label>
                      <MoneyInput
                        id="quantity"
                        value={quantity}
                        onValueChange={setQuantity}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Tổng giá trị mua:</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {formatCurrency(purchasePrice * quantity)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentPrice">Giá thị trường hiện tại</Label>
                    <MoneyInput
                      id="currentPrice"
                      value={currentPrice}
                      onValueChange={setCurrentPrice}
                      placeholder="Để 0 nếu giống giá mua"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Ngày mua</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invDescription">Ghi chú</Label>
                    <Textarea
                      id="invDescription"
                      placeholder="Ghi chú thêm..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => handleOpenChange(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleSaveInvestment} className="bg-emerald-600 hover:bg-emerald-700">
                    {editingId ? 'Cập nhật' : 'Xác nhận Mua'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Tổng giá trị đầu tư
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Tổng lợi nhuận
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {totalProfit >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <p
                  className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                >
                  {formatCurrency(Math.abs(totalProfit))}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Tỷ suất lợi nhuận
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-3xl font-bold ${totalProfitPercentage >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
              >
                {totalProfitPercentage >= 0 ? '+' : ''}
                {totalProfitPercentage.toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh mục đầu tư</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead className="text-right">Giá mua</TableHead>
                  <TableHead className="text-right">Giá hiện tại</TableHead>
                  <TableHead className="text-right">Số lượng</TableHead>
                  <TableHead className="text-right">Giá trị</TableHead>
                  <TableHead className="text-right">Lợi nhuận</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment) => {
                  const value = calculateInvestmentValue(investment);
                  const profit = calculateInvestmentProfit(investment);
                  const profitPercentage = calculateInvestmentProfitPercentage(investment);

                  return (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">{investment.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getInvestmentTypeLabel(investment.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(investment.purchasePrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(investment.currentPrice)}
                      </TableCell>
                      <TableCell className="text-right">{investment.quantity}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(value)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`font-semibold ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'
                            }`}
                        >
                          {profit >= 0 ? '+' : ''}
                          {formatCurrency(profit)}
                          <div className="text-xs">
                            ({profitPercentage >= 0 ? '+' : ''}
                            {profitPercentage.toFixed(2)}%)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(investment)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteInvestment(investment.id!, investment.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}