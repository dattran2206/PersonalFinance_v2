import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ArrowRightLeft,
  Wallet,
  BarChart3,
  Menu,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SidebarContent from './SidebarContent';

export default function BottomNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Top 4 priority items for direct access
  const mainNavItems = [
    { icon: Home, label: 'Tổng quan', path: '/' },
    { icon: ArrowRightLeft, label: 'Giao dịch', path: '/transactions' },
    { icon: Wallet, label: 'Tài khoản', path: '/accounts' },
    { icon: BarChart3, label: 'Báo cáo', path: '/reports' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 safe-area-bottom pointer-events-none">
      {/* Floating Glass Bar */}
      <nav className="mx-auto max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl shadow-emerald-900/10 rounded-2xl flex items-center justify-between px-2 py-1 pointer-events-auto">

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300 gap-1 ${isActive
                  ? 'text-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20 translate-y-[-4px] shadow-sm'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <span className="text-[10px] font-bold animate-in zoom-in duration-200">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}

        {/* More/Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300 gap-1 ${isOpen
                  ? 'text-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20 translate-y-[-4px]'
                  : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              <Menu className="w-6 h-6" strokeWidth={2} />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0 border-t border-white/20">
            <div className="h-1 bg-gray-300 rounded-full w-12 mx-auto my-3" />
            <div className="px-6 pb-6 h-full overflow-y-auto">
              <SidebarContent onItemClick={() => setIsOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

      </nav>
    </div>
  );
}