import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction, TransactionType, Category, Account } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
}

export default function RecentTransactions({
  transactions,
  categories,
  accounts,
}: RecentTransactionsProps) {
  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Không xác định';
  };

  return (
    <Card className="h-full border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
          <span>Giao dịch gần đây</span>
          <span className="text-sm font-normal text-emerald-600 cursor-pointer hover:underline">Xem tất cả</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction.id}
              className="group flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl transition-colors ${transaction.type === TransactionType.INCOME
                      ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600'
                      : 'bg-red-50 dark:bg-red-500/20 text-red-600'
                    }`}
                >
                  {transaction.type === TransactionType.INCOME ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{transaction.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {new Date(transaction.date).toLocaleDateString('vi-VN')} • {getCategoryName(transaction.categoryId)}
                  </p>
                </div>
              </div>
              <div
                className={`font-bold font-display ${transaction.type === TransactionType.INCOME
                    ? 'text-emerald-600'
                    : 'text-gray-900 dark:text-white'
                  }`}
              >
                {transaction.type === TransactionType.INCOME ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
