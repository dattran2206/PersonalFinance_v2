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
import { Progress } from '@/components/ui/progress';
import { funds } from '@/lib/mockData';
import { formatCurrency } from '@/lib/calculations';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function Funds() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý quỹ tiết kiệm</h1>
            <p className="text-gray-600">Theo dõi các mục tiêu tiết kiệm của bạn</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm quỹ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo quỹ tiết kiệm mới</DialogTitle>
                <DialogDescription>Thiết lập mục tiêu tiết kiệm của bạn</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="fundName">Tên quỹ</Label>
                  <Input id="fundName" placeholder="Quỹ du lịch" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Mục tiêu</Label>
                  <Input id="targetAmount" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentAmount">Số tiền hiện tại</Label>
                  <Input id="currentAmount" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fundDescription">Mô tả</Label>
                  <Textarea id="fundDescription" placeholder="Mô tả mục đích của quỹ" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fundIcon">Icon (emoji)</Label>
                  <Input id="fundIcon" placeholder="✈️" maxLength={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fundColor">Màu sắc</Label>
                  <Input id="fundColor" type="color" defaultValue="#3B82F6" />
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
          {funds.map((fund) => {
            const percentage = (fund.currentAmount / fund.targetAmount) * 100;
            const remaining = fund.targetAmount - fund.currentAmount;

            return (
              <Card key={fund.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{fund.icon}</span>
                      <span>{fund.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{fund.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="font-semibold">{percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Hiện tại</span>
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(fund.currentAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Mục tiêu</span>
                      <span className="font-semibold">{formatCurrency(fund.targetAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Còn thiếu</span>
                      <span className="font-semibold text-amber-600">
                        {formatCurrency(remaining)}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Nạp tiền vào quỹ
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <img 
                src="https://mgx-backend-cdn.metadl.com/generate/images/873216/2025-12-29/3def6410-03e2-4454-85f0-574f46c01f65.png" 
                alt="Savings" 
                className="w-8 h-8"
              />
              Lời khuyên về tiết kiệm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-2xl">💡</span>
                <p className="text-sm text-gray-700">
                  Hãy thiết lập chuyển tiền tự động vào các quỹ tiết kiệm mỗi tháng để đảm bảo đạt mục tiêu.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                <span className="text-2xl">🎯</span>
                <p className="text-sm text-gray-700">
                  Chia nhỏ mục tiêu lớn thành các mốc nhỏ hơn để dễ dàng theo dõi và tạo động lực.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}