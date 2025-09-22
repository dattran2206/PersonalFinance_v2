import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    Home,
    Wallet,
    Receipt,
    Target,
    PiggyBank,
    CreditCard,
    BarChart3,
    Menu,
    Sun,
    Moon,
    LogOut
} from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Wallets', href: '/wallets', icon: Wallet },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Budgets', href: '/budgets', icon: Target },
    { name: 'Goals', href: '/goals', icon: PiggyBank },
    { name: 'Debts', href: '/debts', icon: CreditCard },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export default function Layout({ children }: LayoutProps) {
    const [darkMode, setDarkMode] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };
    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            navigate('/');
        }, 1000);
    };

    const NavLinks = () => (
        <>
            {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                    >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </>
    );

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-background">
                {/* Desktop Sidebar */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center">
                            <PiggyBank className="h-8 w-8 text-primary" />
                            <span className="ml-2 text-xl font-bold">FinanceApp</span>
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        <NavLinks />
                                    </ul>
                                </li>
                                <li className="mt-auto">
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={toggleDarkMode}
                                            className="flex items-center space-x-2"
                                        >
                                            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                            <span>{darkMode ? 'Light' : 'Dark'}</span>
                                        </Button>
                                        <Button
                                            onClick={handleLogout}
                                            variant="ghost" size="sm"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span className="ml-2">Logout</span>
                                        </Button>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Mobile header */}
                <div className="lg:hidden">
                    <div className="flex items-center justify-between px-4 py-4 border-b bg-card">
                        <div className="flex items-center">
                            <PiggyBank className="h-8 w-8 text-primary" />
                            <span className="ml-2 text-xl font-bold">FinanceApp</span>
                        </div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72">
                                <div className="flex items-center mb-8">
                                    <PiggyBank className="h-8 w-8 text-primary" />
                                    <span className="ml-2 text-xl font-bold">FinanceApp</span>
                                </div>
                                <nav className="flex flex-col space-y-2">
                                    <NavLinks />
                                </nav>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={toggleDarkMode}
                                            className="flex items-center space-x-2"
                                        >
                                            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                            <span>{darkMode ? 'Light' : 'Dark'}</span>
                                        </Button>
                                        <Button
                                            onClick={handleLogout}
                                            variant="ghost" size="sm"
                                        >
                                            <LogOut className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Main content */}
                <div className="lg:pl-72">
                    <main className="py-6 px-4 lg:px-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}