import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ArrowRightLeft,
  Wallet,
  BarChart3,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const mainMenuItems = [
  { icon: Home, label: 'Tổng quan', path: '/' },
  { icon: ArrowRightLeft, label: 'Chuyển tiền', path: '/transfer' },
  { icon: Wallet, label: 'Tài khoản', path: '/accounts' },
  { icon: BarChart3, label: 'Báo cáo', path: '/reports' },
];

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

export default function BottomNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 safe-area-bottom">
      <div className="grid grid-cols-5 h-16">
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? 'text-emerald-600'
                  : 'text-gray-600 active:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center gap-1 text-gray-600 active:bg-gray-50">
              <Menu className="w-5 h-5" />
              <span className="text-xs font-medium">Thêm</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>Tất cả chức năng</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-2 overflow-y-auto h-[calc(80vh-80px)]">
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
                        : 'text-gray-700 active:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}