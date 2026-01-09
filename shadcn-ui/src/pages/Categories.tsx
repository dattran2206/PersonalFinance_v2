import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
import { useCategories } from '@/hooks/use-db';
import { CategoryType } from '@/lib/types';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { db } from '@/db/db';
import { IconPicker } from '@/components/ui/icon-picker';

export default function Categories() {
  const categories = useCategories() || [];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<CategoryType>(CategoryType.EXPENSE);
  const [newCatIcon, setNewCatIcon] = useState('🍔');
  const [newCatColor, setNewCatColor] = useState('#10B981');

  if (!categories) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </Layout>
    )
  }

  const resetForm = () => {
    setNewCatName('');
    setNewCatType(CategoryType.EXPENSE);
    setNewCatIcon('🍔');
    setNewCatColor('#10B981');
    setEditingId(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
  };

  const handleEditClick = (category: any) => {
    setNewCatName(category.name);
    setNewCatType(category.type);
    setNewCatIcon(category.icon);
    setNewCatColor(category.color);
    setEditingId(category.id);
    setIsDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!newCatName) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      const now = Date.now();

      if (editingId) {
        // Update existing category
        await db.categories.update(editingId, {
          name: newCatName,
          type: newCatType,
          icon: newCatIcon,
          color: newCatColor,
          updatedAt: now
        });
        toast.success('Cập nhật danh mục thành công!');
      } else {
        // Create new category
        const categoryData = {
          id: self.crypto.randomUUID(),
          name: newCatName,
          type: newCatType,
          icon: newCatIcon,
          color: newCatColor,
          createdAt: now,
          updatedAt: now,
          isDeleted: false
        };
        await db.categories.add(categoryData);
        toast.success('Thêm danh mục thành công!');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save category:", error);
      toast.error("Có lỗi xảy ra khi lưu danh mục");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    try {
      // Check if any transactions use this category
      const count = await db.transactions.where('categoryId').equals(id).count();
      if (count > 0) {
        toast.error(`Không thể xóa danh mục "${name}" vì đang có ${count} giao dịch sử dụng!`);
        return;
      }

      if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) return;

      await db.categories.delete(id);
      toast.success(`Đã xóa danh mục ${name}`);
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Có lỗi xảy ra khi xóa danh mục");
    }
  };

  const incomeCategories = categories.filter((c) => c.type === CategoryType.INCOME);
  const expenseCategories = categories.filter((c) => c.type === CategoryType.EXPENSE);

  const CategoryCard = ({ category }: { category: typeof categories[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${category.color}20` }}
            >
              {category.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <Badge variant="outline" className="mt-1">
                {category.type === CategoryType.INCOME ? 'Thu nhập' : 'Chi tiêu'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEditClick(category)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDeleteCategory(category.id, category.name)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý danh mục</h1>
            <p className="text-gray-600">Tổ chức các danh mục thu chi của bạn</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm danh mục
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
                <DialogDescription>
                  {editingId ? 'Cập nhật thông tin danh mục' : 'Tạo danh mục thu chi mới'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên danh mục</Label>
                  <Input
                    id="name"
                    placeholder="Nhập tên danh mục"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Loại</Label>
                  <Select value={newCatType} onValueChange={(v) => setNewCatType(v as CategoryType)}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Thu nhập</SelectItem>
                      <SelectItem value="expense">Chi tiêu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Biểu tượng</Label>
                  <div>
                    <IconPicker
                      value={newCatIcon}
                      onChange={setNewCatIcon}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Màu sắc</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      className="w-12 h-10 p-1"
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                    />
                    <Input
                      type="text"
                      className="flex-1"
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => handleOpenChange(false)}>
                  Hủy
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveCategory}>
                  {editingId ? 'Cập nhật' : 'Lưu'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Danh mục thu nhập</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incomeCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Danh mục chi tiêu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expenseCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}