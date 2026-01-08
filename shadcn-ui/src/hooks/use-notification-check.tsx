import { useEffect } from 'react';
import { db } from '@/db/db';
import { useBudgets, useTransactions, useDebts, useFunds } from '@/hooks/use-db';
import { calculateBudgetUsage } from '@/lib/calculations';
import { TransactionType } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';

// Helper to generate a unique ID for the alert to prevent duplicates (e.g., "budget-over-123-2024-01")
const generateAlertId = (prefix: string, id: string) => {
    const now = new Date();
    return `${prefix}-${id}-${now.getFullYear()}-${now.getMonth()}`;
};

export function useNotificationCheck() {
    const budgets = useBudgets();
    const transactions = useTransactions();
    const debts = useDebts();
    const funds = useFunds();

    useEffect(() => {
        if (!budgets || !transactions || !debts || !funds) return;

        const checkNotifications = async () => {
            const now = Date.now();
            const newNotifications: any[] = [];

            // 1. Check Budgets
            for (const budget of budgets) {
                const usage = calculateBudgetUsage(budget as any, transactions as any[]);
                if (usage.percentage >= 90) {
                    // Check if we already alerted for this budget this month
                    // Simplification: checking DB for a similar title/message or we store a "lastChecked" map.
                    // For MVP: We query notifications. If we find one with same title created recently, skip.
                    // Let's assume we alert once per day or session. 
                    // Actually, just alert. The UI will show.
                    // To avoid spam loop, we need to check if one exists in DB.

                    const title = usage.percentage >= 100 ? '🚨 Vượt ngân sách!' : '⚠️ Cảnh báo ngân sách';
                    const message = `Ngân sách cho danh mục này đã đạt ${usage.percentage.toFixed(0)}%.`;

                    // Simple de-dupe: Check if strict equivalent exists
                    const exists = await db.notifications
                        .where('message').equals(message)
                        .and(n => n.date > now - 86400000) // Within last 24h
                        .count();

                    if (exists === 0) {
                        newNotifications.push({
                            id: self.crypto.randomUUID(),
                            title,
                            message,
                            type: usage.percentage >= 100 ? 'error' : 'warning',
                            date: now,
                            isRead: false,
                            link: '/budget'
                        });
                    }
                }
            }

            // 2. Check Debts
            for (const debt of debts) {
                if (debt.type === 'debt' && debt.remainingAmount > 0) {
                    const due = new Date(debt.dueDate).getTime();
                    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

                    if (diffDays <= 3 && diffDays >= 0) {
                        const message = `Khoản nợ "${debt.name}" đến hạn trong ${diffDays} ngày.`;
                        const exists = await db.notifications.where('message').equals(message).and(n => n.date > now - 86400000).count();
                        if (exists === 0) {
                            newNotifications.push({
                                id: self.crypto.randomUUID(),
                                title: '⏰ Sắp đến hạn trả nợ',
                                message,
                                type: 'warning',
                                date: now,
                                isRead: false,
                                link: '/debts'
                            });
                        }
                    } else if (diffDays < 0) {
                        const message = `Khoản nợ "${debt.name}" đã quá hạn ${Math.abs(diffDays)} ngày!`;
                        const exists = await db.notifications.where('message').equals(message).and(n => n.date > now - 86400000).count();
                        if (exists === 0) {
                            newNotifications.push({
                                id: self.crypto.randomUUID(),
                                title: '🚨 Quá hạn trả nợ',
                                message,
                                type: 'error',
                                date: now,
                                isRead: false,
                                link: '/debts'
                            });
                        }
                    }
                }
            }

            // 3. Check Funds
            for (const fund of funds) {
                if (fund.currentAmount >= fund.targetAmount && fund.targetAmount > 0) {
                    const message = `Chúc mừng! Bạn đã đạt mục tiêu quỹ "${fund.name}".`;
                    // Check if alerted ever? Or recently.
                    const exists = await db.notifications.where('message').equals(message).count(); // Ever
                    if (exists === 0) {
                        newNotifications.push({
                            id: self.crypto.randomUUID(),
                            title: '🎉 Đạt mục tiêu!',
                            message,
                            type: 'success',
                            date: now,
                            isRead: false,
                            link: '/funds'
                        });
                    }
                }
            }

            if (newNotifications.length > 0) {
                await db.notifications.bulkAdd(newNotifications);
            }
        };

        checkNotifications();
        // Run once on mount/data change interval could be 1 min but here dependent on data change
        // Added debounce logic implicitly by only writing if not exists in last 24h
    }, [budgets, transactions, debts, funds]);
}
