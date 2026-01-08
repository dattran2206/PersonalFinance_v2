import { db } from './db';
import { CategoryType } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_CATEGORIES = [
    { name: 'Lương', type: CategoryType.INCOME, icon: '💼', color: '#10B981' },
    { name: 'Thưởng', type: CategoryType.INCOME, icon: '🎁', color: '#22C55E' },
    { name: 'Đầu tư', type: CategoryType.INCOME, icon: '📈', color: '#3B82F6' },
    { name: 'Thu nhập khác', type: CategoryType.INCOME, icon: '💰', color: '#14B8A6' },

    { name: 'Ăn uống', type: CategoryType.EXPENSE, icon: '🍔', color: '#F59E0B' },
    { name: 'Đi lại', type: CategoryType.EXPENSE, icon: '🚗', color: '#EF4444' },
    { name: 'Mua sắm', type: CategoryType.EXPENSE, icon: '🛍️', color: '#EC4899' },
    { name: 'Giải trí', type: CategoryType.EXPENSE, icon: '🎮', color: '#8B5CF6' },
    { name: 'Nhà ở', type: CategoryType.EXPENSE, icon: '🏠', color: '#6366F1' },
    { name: 'Y tế', type: CategoryType.EXPENSE, icon: '⚕️', color: '#06B6D4' },
    { name: 'Giáo dục', type: CategoryType.EXPENSE, icon: '📚', color: '#0EA5E9' },
    { name: 'Tiết kiệm', type: CategoryType.EXPENSE, icon: '🏦', color: '#10B981' },
];

export async function seedDatabase() {
    try {
        // Check for the new "clean state" flag
        // If it doesn't exist, we assume we need to reset/migrate to clean state
        const isCleanState = await db.settings.get('isCleanState');

        if (!isCleanState) {
            console.log("Migrating to clean state (removing mock data)...");

            // Use Date.now() (number) to match db.ts schema for createdAt/updatedAt
            const timestamp = Date.now();

            // Clear ALL existing data to remove mock data
            await db.transaction('rw', db.accounts, db.categories, db.transactions, db.settings, async () => {
                await db.accounts.clear();
                await db.categories.clear();
                await db.transactions.clear();

                // Add Default Categories
                const categoryData = DEFAULT_CATEGORIES.map(c => ({
                    id: uuidv4(),
                    name: c.name,
                    type: c.type,
                    icon: c.icon,
                    color: c.color,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                    isDeleted: false
                }));

                await db.categories.bulkAdd(categoryData);

                // Mark as clean state initialized
                await db.settings.put({ key: 'isCleanState', value: true, updatedAt: timestamp });
                await db.settings.put({ key: 'isInitialized', value: true, updatedAt: timestamp });
            });

            console.log("Database reset to clean state complete!");
        } else {
            console.log("Database is already in clean state.");
        }
    } catch (error) {
        console.error("Failed to seed database:", error);
    }
}
