import { ReactNode } from 'react';
import FloatingSidebar from './FloatingSidebar';
import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-foreground">
      {/* Modern Floating Sidebar (Desktop) */}
      <FloatingSidebar />

      {/* Main Content Area */}
      <div className="md:pl-80 transition-all duration-300">
        <Header />
        <main className="p-4 md:p-8 pb-32 md:pb-8 max-w-7xl mx-auto animate-in fade-in duration-500">
          {children}
        </main>
      </div>

      {/* Modern Bottom Nav (Mobile) */}
      <BottomNav />
    </div>
  );
}