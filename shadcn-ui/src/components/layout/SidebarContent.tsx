import { Link, useLocation } from 'react-router-dom';
import { menuItems } from './menuItems';

interface SidebarContentProps {
    onItemClick?: () => void;
}

export default function SidebarContent({ onItemClick }: SidebarContentProps) {
    const location = useLocation();

    return (
        <div className="h-full flex flex-col">
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
                                onClick={onItemClick}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
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
        </div>
    );
}
