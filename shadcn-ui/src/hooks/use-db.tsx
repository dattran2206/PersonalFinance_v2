import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';

export function useTransactions() {
    return useLiveQuery(() =>
        db.transactions
            .orderBy('date')
            .reverse()
            .toArray()
    );
}

export function useAccounts() {
    return useLiveQuery(() => db.accounts.toArray());
}

export function useCategories() {
    return useLiveQuery(() => db.categories.toArray());
}

export function useBudgets() {
    return useLiveQuery(() => db.budgets.toArray());
}

export function useFunds() {
    return useLiveQuery(() => db.funds.toArray());
}

export function useDebts() {
    return useLiveQuery(() => db.debts.toArray());
}

export function useInvestments() {
    return useLiveQuery(() => db.investments.toArray());
}

export function useNotifications() {
    return useLiveQuery(() => db.notifications.orderBy('date').reverse().limit(20).toArray());
}

export function useTotalAssets() {
    const accounts = useAccounts();
    return accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
}
