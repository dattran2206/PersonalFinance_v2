import { db } from '@/db/db';
import type { FundHistory } from '@/db/db';

/**
 * Create a new fund history record
 */
export const createFundHistory = async (
    fundId: string,
    amount: number,
    type: 'deposit' | 'withdraw',
    note?: string,
    sourceAccountId?: string,
    transactionId?: number
): Promise<number> => {
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];

    return await db.fundHistory.add({
        fundId,
        date: today,
        amount,
        type,
        note,
        sourceAccountId,
        transactionId,
        createdAt: now,
        updatedAt: now,
        isDeleted: false
    });
};

/**
 * Get all history for a specific fund
 */
export const getFundHistory = async (fundId: string): Promise<FundHistory[]> => {
    return await db.fundHistory
        .where('fundId')
        .equals(fundId)
        .and(h => !h.isDeleted)
        .reverse()
        .sortBy('date');
};

/**
 * Get fund history within a date range
 */
export const getFundHistoryByDateRange = async (
    fundId: string,
    startDate: string,
    endDate: string
): Promise<FundHistory[]> => {
    const history = await getFundHistory(fundId);
    return history.filter(h => h.date >= startDate && h.date <= endDate);
};

/**
 * Delete a fund history record (soft delete)
 */
export const deleteFundHistory = async (id: number): Promise<void> => {
    await db.fundHistory.update(id, {
        isDeleted: true,
        updatedAt: Date.now()
    });
};
