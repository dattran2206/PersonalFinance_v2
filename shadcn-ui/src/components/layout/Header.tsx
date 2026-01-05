import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Link, useLocation } from 'react-router-dom';

const allMenuItems = [
  { label: 'Tổng quan', path: '/' },
  { label: 'Giao dịch', path: '/transactions' },
  { label: 'Chuyển tiền', path: '/transfer' },
  { label: 'Danh mục', path: '/categories' },
  { label: 'Tài khoản', path: '/accounts' },
  { label: 'Ngân sách', path: '/budget' },
  { label: 'Quỹ tiết kiệm', path: '/funds' },
  { label: 'Đầu tư', path: '/investments' },
  { label: 'Nợ & Cho vay', path: '/debts' },
  { label: 'Báo cáo', path: '/reports' },
  { label: 'Dự đoán', path: '/predictions' },
];

export default function Header() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <img 
                    src="https://mgx-backend-cdn.metadl.com/generate/images/873216/2025-12-29/62fcebd1-6add-499e-838d-fb54f27c991d.png" 
                    alt="Logo" 
                    className="w-8 h-8"
                  />
                  <span>Quản Lý Tài Chính</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {allMenuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 md:hidden">
            <img 
              src="https://mgx-backend-cdn.metadl.com/generate/images/873216/2025-12-29/62fcebd1-6add-499e-838d-fb54f27c991d.png" 
              alt="Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-lg font-bold text-gray-900">Tài chính</h1>
          </div>
        </div>

        {/* Center: Search (Desktop only) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm giao dịch, danh mục..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start py-3">
                <p className="font-semibold text-sm">Vượt ngân sách</p>
                <p className="text-xs text-gray-600">Chi tiêu ăn uống đã vượt 90% ngân sách</p>
                <p className="text-xs text-gray-400 mt-1">2 giờ trước</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-3">
                <p className="font-semibold text-sm">Nhắc nhở thanh toán</p>
                <p className="text-xs text-gray-600">Hóa đơn điện đến hạn trong 3 ngày</p>
                <p className="text-xs text-gray-400 mt-1">1 ngày trước</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-3">
                <p className="font-semibold text-sm">Đạt mục tiêu</p>
                <p className="text-xs text-gray-600">Quỹ du lịch đã đạt 50% mục tiêu</p>
                <p className="text-xs text-gray-400 mt-1">2 ngày trước</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2 md:px-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline font-medium">Người dùng</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
              <DropdownMenuItem>Cài đặt</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>
    </header>
  );
}