export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export enum AccountType {
  BANK = 'bank',
  EWALLET = 'ewallet',
  CREDIT_CARD = 'credit_card',
  CASH = 'cash',
}

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum InvestmentType {
  STOCK = 'stock',
  BOND = 'bond',
  FUND = 'fund',
  CRYPTO = 'crypto',
  REAL_ESTATE = 'real_estate',
}

export enum DebtType {
  DEBT = 'debt',
  LOAN = 'loan',
}

export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category extends BaseEntity {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  parentId?: string | null;
}

export interface Account extends BaseEntity {
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  icon: string;
  color: string;
  creditLimit?: number;
  dueDate?: string;
}

export interface Transaction extends BaseEntity {
  date: string;
  amount: number;
  type: TransactionType;
  categoryId?: string;
  accountId: string;
  toAccountId?: string;
  fee?: number;
  description?: string;
  note?: string;
  recurrence?: RecurrenceType;
}

export interface Budget extends BaseEntity {
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  rollover?: boolean;
}

export interface Fund extends BaseEntity {
  name: string;
  targetAmount: number;
  currentAmount: number;
  description?: string;
  icon: string;
  color: string;
  deadline?: string | null;
}

export interface Investment extends BaseEntity {
  name: string;
  type: InvestmentType;
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  purchaseDate: string;
  sellDate?: string;
  profit?: number;
  description?: string;
}

export interface Debt extends BaseEntity {
  name: string;
  type: DebtType;
  amount: number;
  remainingAmount: number;
  interestRate: number;
  startDate: string;
  dueDate: string;
  monthlyPayment?: number | null;
  description?: string;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
  netIncome: number;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  color: string;
}