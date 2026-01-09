import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Accounts from './pages/Accounts';
import Budget from './pages/Budget';
import Funds from './pages/Funds';
import Investments from './pages/Investments';
import Debts from './pages/Debts';
import Reports from './pages/Reports';
import Predictions from './pages/Predictions';
import Transfer from './pages/Transfer';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => {
  // Only use basename in production deployment on GitHub Pages
  const basename = import.meta.env.MODE === 'production' ? '/PersonalFinance_v2' : '';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;