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
import { investments } from '@/lib/mockData';
import { InvestmentType } from '@/lib/types';
import {
  formatCurrency,
  calculateInvestmentValue,
  calculateInvestmentProfit,
  calculateInvestmentProfitPercentage,
} from '@/lib/calculations';
import { Plus, TrendingUp, TrendingDown, Pencil, Trash2 } from 'lucide-react';

export default function Investments() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getInvestmentTypeLabel = (type: InvestmentType) => {
    switch (type) {
      case InvestmentType.STOCK:
        return 'Cổ phiếu';
      case InvestmentType.BOND:
        return 'Trái phiếu';
      case InvestmentType.FUND:
        return 'Quỹ đầu tư';
      case InvestmentType.CRYPTO:
        return 'Tiền mã hóa';
      case InvestmentType.REAL_ESTATE:
        return 'Bất động sản';
      default:
        return 'Khác';
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
  const totalProfitPercentage =
    totalValue > 0 ? (totalProfit / (totalValue - totalProfit)) * 100 : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đầu tư</h1>
            <p className="text-gray-600">Theo dõi danh mục đầu tư của bạn</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm khoản đầu tư
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm khoản đầu tư mới</DialogTitle>
                <DialogDescription>Ghi nhận khoản đầu tư của bạn</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="invName">Tên khoản đầu tư</Label>
                  <Input id="invName" placeholder="VNM - Vinamilk" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invType">Loại đầu tư</Label>
                  <Select defaultValue="stock">
                    <SelectTrigger id="invType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Cổ phiếu</SelectItem>
                      <SelectItem value="bond">Trái phiếu</SelectItem>
                      <SelectItem value="fund">Quỹ đầu tư</SelectItem>
                      <SelectItem value="crypto">Tiền mã hóa</SelectItem>
                      <SelectItem value="real_estate">Bất động sản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Giá mua</Label>
                  <Input id="purchasePrice" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPrice">Giá hiện tại</Label>
                  <Input id="currentPrice" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Số lượng</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Ngày mua</Label>
                  <Input id="purchaseDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invDescription">Mô tả</Label>
                  <Textarea id="invDescription" placeholder="Ghi chú về khoản đầu tư" />
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
                  className={`text-3xl font-bold ${
                    totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'
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
                className={`text-3xl font-bold ${
                  totalProfitPercentage >= 0 ? 'text-emerald-600' : 'text-red-600'
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
                          className={`font-semibold ${
                            profit >= 0 ? 'text-emerald-600' : 'text-red-600'
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