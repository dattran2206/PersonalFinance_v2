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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { funds } from '@/lib/mockData';
import { formatCurrency } from '@/lib/calculations';
import { Plus, Target, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const fundIcons = ['🚨', '✈️', '🏡', '👴', '🎓', '💍', '🚗', '📱', '🎯', '💰'];
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
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [color, setColor] = useState('#10B981');

  const handleAddFund = () => {
    if (!name || !targetAmount || !currentAmount) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    toast.success('Thêm quỹ tiết kiệm thành công!');
    setIsOpen(false);
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDescription('');
    setDeadline('');
    setIcon('🎯');
    setColor('#10B981');
  };

  const totalSaved = funds.reduce((sum, fund) => sum + fund.currentAmount, 0);
  const totalTarget = funds.reduce((sum, fund) => sum + fund.targetAmount, 0);
  const overallProgress = (totalSaved / totalTarget) * 100;

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    const today = new Date();
    const due = new Date(deadline);
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

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm quỹ mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm quỹ tiết kiệm mới</DialogTitle>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetAmount">Mục tiêu</Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      placeholder="0"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentAmount">Số tiền hiện tại</Label>
                    <Input
                      id="currentAmount"
                      type="number"
                      placeholder="0"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
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
                  <Label>Icon</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {fundIcons.map((i) => (
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

                <Button onClick={handleAddFund} className="w-full">
                  Thêm quỹ
                </Button>
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
            const progress = (fund.currentAmount / fund.targetAmount) * 100;
            const remaining = fund.targetAmount - fund.currentAmount;
            const daysRemaining = fund.deadline ? getDaysRemaining(fund.deadline) : null;

            return (
              <Card key={fund.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
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
                          daysRemaining < 30
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
                      <Progress value={progress} className="h-2" />
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
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}