import Dexie, { Table } from 'dexie';

export interface Transaction {
    id?: number;
    description: string;
    amount: number;
    date: string; // ISO string
    type: 'income' | 'expense' | 'transfer';
    categoryId: string;
    accountId: string;
    toAccountId?: string;
    fee?: number;
    note?: string;
    recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

    // Sync fields
    createdAt: number;
    updatedAt: number;
    isDeleted: boolean;
}

export interface Account {
    id?: string; // Using string to match current mock data (or we can migrate to UUID)
    name: string;
    balance: number;
    type: string;
    color?: string;
    icon?: string;
    creditLimit?: number;
    dueDate?: string;

    // Sync fields
    createdAt: number;
    updatedAt: number;
    isDeleted: boolean;
}

export interface Category {
    id?: string;
    name: string;
    type: 'income' | 'expense';
    icon?: string;
    color?: string;

    // Sync fields
    createdAt: number;
    updatedAt: number;
    isDeleted: boolean;
}

export interface Budget {
    id?: string;
    categoryId: string;
    amount: number;
    period: 'monthly' | 'yearly';
    startDate: string;
    endDate?: string;
    rollover?: boolean;

    // Sync fields
    createdAt: number;
    updatedAt: number;
    isDeleted: boolean;
}

export interface Fund {
    id?: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    description?: string;
    icon: string;
    color: string;
    deadline?: string;

    // Sync fields
    createdAt: number;
    updatedAt: number;
    isDeleted: boolean;
}

export interface Debt {
    id?: string;
    name: string;
    type: 'debt' | 'loan';
    amount: number;
    remainingAmount: number;
    interestRate: number;
    startDate: string;
    dueDate: string;
    monthlyPayment?: number;
    description?: string;

    // Sync fields
    createdAt: number;
    updatedAt: number;
    isDeleted: boolean;
}

export interface Investment {
    id?: string;
    name: string;
    type: 'stock' | 'bond' | 'fund' | 'crypto' | 'real_estate' | 'other';
    purchasePrice: number;
    currentPrice: number;
    quantity: number;
    purchaseDate: string;
    description?: string;

    // Sync fields
    createdAt: number;
    updatedAt: number;
    isDeleted: boolean;
}

export interface Notification {
    id?: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    date: number;
    isRead: boolean;
    link?: string;
}

export interface Setting {
    key: string;
    value: any;
    updatedAt: number;
}

export class FinanceDB extends Dexie {
    transactions!: Table<Transaction, number>;
    accounts!: Table<Account, string>;
    categories!: Table<Category, string>;
    budgets!: Table<Budget, string>;
    funds!: Table<Fund, string>;
    debts!: Table<Debt, string>;
    investments!: Table<Investment, string>;
    notifications!: Table<Notification, string>;
    settings!: Table<Setting, string>;

    constructor() {
        super('FinanceDB');

        // Schema definition
        this.version(1).stores({
            transactions: '++id, date, type, categoryId, accountId, updatedAt',
            accounts: 'id, name, updatedAt', // Primary key is 'id' (string)
            categories: 'id, type, updatedAt', // Primary key is 'id' (string)
            settings: 'key, updatedAt'
        });

        this.version(2).stores({
            budgets: 'id, categoryId, period, updatedAt'
        });

        this.version(3).stores({
            funds: 'id, name, updatedAt'
        });

        this.version(4).stores({
            debts: 'id, name, type, dueDate, updatedAt'
        });

        this.version(5).stores({
            investments: 'id, name, type, updatedAt'
        });

        this.version(6).stores({
            notifications: 'id, date, isRead, type'
        });
    }
}

export const db = new FinanceDB();
