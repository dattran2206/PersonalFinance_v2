import { db } from '@/db/db';

export const backupService = {
    async exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            version: 1,
            tables: {
                accounts: await db.accounts.toArray(),
                transactions: await db.transactions.toArray(),
                categories: await db.categories.toArray(),
                budgets: await db.budgets.toArray(),
                funds: await db.funds.toArray(),
                debts: await db.debts.toArray(),
                investments: await db.investments.toArray(),
                settings: await db.settings.toArray(),
                notifications: await db.notifications.toArray(),
            },
        };
        return data;
    },

    async importData(data: any) {
        if (!data.tables) throw new Error('Invalid backup file');

        await db.transaction('rw',
            [
                db.accounts,
                db.transactions,
                db.categories,
                db.budgets,
                db.funds,
                db.debts,
                db.investments,
                db.settings,
                db.notifications
            ],
            async () => {
                // Clear all existing data
                await Promise.all([
                    db.accounts.clear(),
                    db.transactions.clear(),
                    db.categories.clear(),
                    db.budgets.clear(),
                    db.funds.clear(),
                    db.debts.clear(),
                    db.investments.clear(),
                    db.settings.clear(),
                    db.notifications.clear(),
                ]);

                // Bulk add new data
                if (data.tables.accounts) await db.accounts.bulkAdd(data.tables.accounts);
                if (data.tables.transactions) await db.transactions.bulkAdd(data.tables.transactions);
                if (data.tables.categories) await db.categories.bulkAdd(data.tables.categories);
                if (data.tables.budgets) await db.budgets.bulkAdd(data.tables.budgets);
                if (data.tables.funds) await db.funds.bulkAdd(data.tables.funds);
                if (data.tables.debts) await db.debts.bulkAdd(data.tables.debts);
                if (data.tables.investments) await db.investments.bulkAdd(data.tables.investments);
                if (data.tables.settings) await db.settings.bulkAdd(data.tables.settings);
                if (data.tables.notifications) await db.notifications.bulkAdd(data.tables.notifications);
            });
    },
};
