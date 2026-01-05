export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
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

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  description: string;
  note?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: string;
}

export interface Fund {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  description: string;
  icon: string;
  color: string;
}

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  purchaseDate: string;
  description?: string;
}

export interface Debt {
  id: string;
  name: string;
  type: DebtType;
  amount: number;
  remainingAmount: number;
  interestRate: number;
  startDate: string;
  dueDate: string;
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