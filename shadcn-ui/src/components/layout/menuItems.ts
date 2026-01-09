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
    Settings,
} from 'lucide-react';

export const menuItems = [
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
    { icon: Settings, label: 'Cài đặt', path: '/settings' },
];
