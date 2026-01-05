import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ArrowRightLeft as Transaction,
  FolderOpen,
  Wallet,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Receipt,
  BarChart3,
  Lightbulb,
  ArrowRightLeft,
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Tổng quan', path: '/' },
  { icon: Transaction, label: 'Giao dịch', path: '/transactions' },
  { icon: ArrowRightLeft, label: 'Chuyển tiền', path: '/transfer' },
  { icon: FolderOpen, label: 'Danh mục', path: '/categories' },
  { icon: Wallet, label: 'Tài khoản', path: '/accounts' },
  { icon: Receipt, label: 'Ngân sách', path: '/budget' },
  { icon: PiggyBank, label: 'Quỹ tiết kiệm', path: '/funds' },
  { icon: TrendingUp, label: 'Đầu tư', path: '/investments' },
  { icon: CreditCard, label: 'Nợ & Cho vay', path: '/debts' },
  { icon: BarChart3, label: 'Báo cáo', path: '/reports' },
  { icon: Lightbulb, label: 'Dự đoán', path: '/predictions' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <img 
            src="https://mgx-backend-cdn.metadl.com/generate/images/873216/2025-12-29/62fcebd1-6add-499e-838d-fb54f27c991d.png" 
            alt="Logo" 
            className="w-10 h-10"
          />
          <h1 className="text-xl font-bold text-gray-900">Quản Lý Tài Chính</h1>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}