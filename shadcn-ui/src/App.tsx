import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Wallets from './pages/Wallets';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Debts from './pages/Debts';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/wallets" element={<Wallets />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/budgets" element={<Budgets />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/debts" element={<Debts />} />
                    <Route path="/reports" element={<Dashboard />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;