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
  GOLD = 'gold',
  COMMODITY = 'commodity',
  SAVING = 'saving',
  OTHER = 'other',
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

export enum FundAction {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export interface BaseEntity {
  id?: string | number;
  createdAt: string | number;
  updatedAt: string | number;
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
  isDeleted?: boolean;
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
  accountId: string;
  targetAmount: number;
  currentAmount: number;
  description?: string;
  icon: string;
  color: string;
  deadline?: string | null;
  isDeleted?: boolean;
}

export interface FundHistory extends BaseEntity {
  fundId: string;
  date: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  note?: string;
  sourceAccountId?: string;
  transactionId?: number;
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
  accountId?: string; // Source/Holding Account
  unit: string;
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
