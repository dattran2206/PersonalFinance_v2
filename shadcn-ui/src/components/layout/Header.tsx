
import { Bell, Search, Check } from 'lucide-react';
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
import { useLocation, useNavigate } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle';
import { useNotifications } from '@/hooks/use-db';
import { useNotificationCheck } from '@/hooks/use-notification-check';
import { db } from '@/db/db';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize notification generator
  useNotificationCheck();

  const notifications = useNotifications() || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = async (id: string, link?: string) => {
    try {
      await db.notifications.update(id, { isRead: true });
      if (link) navigate(link);
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) {
      if (n.id) await db.notifications.update(n.id, { isRead: true });
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 transition-all duration-300 dark:bg-gray-950/80 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        {/* Left: Logo (Mobile Only) */}
        <div className="flex items-center gap-3 md:hidden">
          <img
            src="https://mgx-backend-cdn.metadl.com/generate/images/873216/2025-12-29/62fcebd1-6add-499e-838d-fb54f27c991d.png"
            alt="Logo"
            className="w-8 h-8"
          />
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-display">Tài chính</h1>
        </div>

        {/* Left: Spacer */}
        <div className="hidden md:block"></div>

        {/* Center: Search (Desktop only) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm giao dịch, danh mục..."
              className="pl-10 bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-800"
            />
          </div>
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-2 md:gap-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-2 py-1.5">
                <DropdownMenuLabel className="py-0">Thông báo</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-auto text-xs px-2 py-1" onClick={markAllRead}>
                    Đánh dấu đã đọc
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Không có thông báo nào
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className={`flex flex-col items-start py-3 cursor-pointer ${!notif.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                      onClick={() => handleNotificationClick(notif.id!, notif.link)}
                    >
                      <div className="flex justify-between w-full">
                        <p className={`font-semibold text-sm ${notif.type === 'error' ? 'text-red-600' : notif.type === 'success' ? 'text-emerald-600' : ''}`}>
                          {notif.title}
                        </p>
                        {!notif.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(notif.date, { addSuffix: true, locale: vi })}
                      </p>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
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
            className="pl-10 bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-800"
          />
        </div>
      </div>
    </header>
  );
}
