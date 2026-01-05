import {
  Category,
  CategoryType,
  RecurrenceType,
  Account,
  AccountType,
  Transaction,
  TransactionType,
  Budget,
  Fund,
  Investment,
  InvestmentType,
  Debt,
  DebtType,
} from './types';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Lương', type: CategoryType.INCOME, icon: '💼', color: '#10B981', parentId: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'cat-2', name: 'Thưởng', type: CategoryType.INCOME, icon: '🎁', color: '#22C55E', parentId: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'cat-3', name: 'Đầu tư', type: CategoryType.INCOME, icon: '📈', color: '#3B82F6', parentId: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'cat-4', name: 'Thu nhập khác', type: CategoryType.INCOME, icon: '💰', color: '#14B8A6', parentId: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },

  { id: 'cat-5', name: 'Ăn uống', type: CategoryType.EXPENSE, icon: '🍔', color: '#F59E0B', parentId: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'cat-6', name: 'Đi lại', type: CategoryType.EXPENSE, icon: '🚗', color: '#EF4444', parentId: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'cat-7', name: 'Mua sắm', type: CategoryType.EXPENSE, icon: '🛍️', color: '#EC4899', parentId: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'cat-8', name: 'Giải trí', type: CategoryType.EXPENSE, icon: '🎮', color: '#8B5CF6', parentId: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'cat-9', name: 'Nhà ở', type: CategoryType.EXPENSE, icon: '🏠', color: '#6366F1', parentId: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'cat-10', name: 'Y tế', type: CategoryType.EXPENSE, icon: '⚕️', color: '#06B6D4', parentId: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'cat-11', name: 'Giáo dục', type: CategoryType.EXPENSE, icon: '📚', color: '#0EA5E9', parentId: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'cat-12', name: 'Tiết kiệm', type: CategoryType.EXPENSE, icon: '🏦', color: '#10B981', parentId: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
];

export const accounts: Account[] = [
  { id: 'acc-1', name: 'Vietcombank', type: AccountType.BANK, balance: 50000000, currency: 'VND', icon: '🏦', color: '#10B981', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'acc-2', name: 'Techcombank', type: AccountType.BANK, balance: 30000000, currency: 'VND', icon: '🏦', color: '#3B82F6', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'acc-3', name: 'MoMo', type: AccountType.EWALLET, balance: 5000000, currency: 'VND', icon: '📱', color: '#EC4899', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'acc-4', name: 'ZaloPay', type: AccountType.EWALLET, balance: 3000000, currency: 'VND', icon: '📱', color: '#0EA5E9', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'acc-5', name: 'Visa Credit', type: AccountType.CREDIT_CARD, balance: -2000000, currency: 'VND', icon: '💳', color: '#F59E0B',
    creditLimit: 20000000, dueDate: '2025-12-25', createdAt: '2025-01-01', updatedAt: '2025-01-01'
  },
  { id: 'acc-6', name: 'Tiền mặt', type: AccountType.CASH, balance: 2000000, currency: 'VND', icon: '💵', color: '#22C55E', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
];

export const transactions: Transaction[] = [
  { id: 'txn-1', date: '2025-12-28', amount: 20000000, type: TransactionType.INCOME, categoryId: 'cat-1', accountId: 'acc-1', description: 'Lương tháng 12',
    recurrence: RecurrenceType.MONTHLY, createdAt: '2025-12-28', updatedAt: '2025-12-28' },

  { id: 'txn-2', date: '2025-12-27', amount: 500000, type: TransactionType.EXPENSE, categoryId: 'cat-5', accountId: 'acc-3', description: 'Ăn trưa nhà hàng',
    recurrence: RecurrenceType.NONE, createdAt: '2025-12-27', updatedAt: '2025-12-27' },

  { id: 'txn-3', date: '2025-12-26', amount: 200000, type: TransactionType.EXPENSE, categoryId: 'cat-6', accountId: 'acc-4', description: 'Xăng xe',
    recurrence: RecurrenceType.NONE, createdAt: '2025-12-26', updatedAt: '2025-12-26' },

  { id: 'txn-4', date: '2025-12-25', amount: 1500000, type: TransactionType.EXPENSE, categoryId: 'cat-7', accountId: 'acc-2', description: 'Mua quần áo',
    recurrence: RecurrenceType.NONE, createdAt: '2025-12-25', updatedAt: '2025-12-25' },

  { id: 'txn-5', date: '2025-12-24', amount: 800000, type: TransactionType.EXPENSE, categoryId: 'cat-8', accountId: 'acc-3', description: 'Xem phim và ăn tối',
    recurrence: RecurrenceType.NONE, createdAt: '2025-12-24', updatedAt: '2025-12-24' },

  { id: 'txn-6', date: '2025-12-23', amount: 5000000, type: TransactionType.EXPENSE, categoryId: 'cat-9', accountId: 'acc-1', description: 'Tiền thuê nhà tháng 1',
    recurrence: RecurrenceType.MONTHLY, createdAt: '2025-12-23', updatedAt: '2025-12-23' },

  { id: 'txn-7', date: '2025-12-22', amount: 3000000, type: TransactionType.INCOME, categoryId: 'cat-2', accountId: 'acc-1', description: 'Thưởng cuối năm',
    recurrence: RecurrenceType.NONE, createdAt: '2025-12-22', updatedAt: '2025-12-22' },

  { id: 'txn-8', date: '2025-12-21', amount: 300000, type: TransactionType.EXPENSE, categoryId: 'cat-5', accountId: 'acc-6', description: 'Đi chợ',
    recurrence: RecurrenceType.NONE, createdAt: '2025-12-21', updatedAt: '2025-12-21' },

  { id: 'txn-9', date: '2025-12-20', amount: 1000000, type: TransactionType.EXPENSE, categoryId: 'cat-10', accountId: 'acc-2', description: 'Khám bệnh',
    recurrence: RecurrenceType.NONE, createdAt: '2025-12-20', updatedAt: '2025-12-20' },

  { id: 'txn-10', date: '2025-12-19', amount: 2000000, type: TransactionType.EXPENSE, categoryId: 'cat-11', accountId: 'acc-1', description: 'Học phí khóa học',
    recurrence: RecurrenceType.NONE, createdAt: '2025-12-19', updatedAt: '2025-12-19' },
];

export const budgets: Budget[] = [
  { id: 'bud-1', categoryId: 'cat-5', amount: 5000000, period: 'monthly', startDate: '2025-12-01', rollover: false, createdAt: '2025-12-01', updatedAt: '2025-12-01' },
  { id: 'bud-2', categoryId: 'cat-6', amount: 2000000, period: 'monthly', startDate: '2025-12-01', rollover: false, createdAt: '2025-12-01', updatedAt: '2025-12-01' },
  { id: 'bud-3', categoryId: 'cat-7', amount: 3000000, period: 'monthly', startDate: '2025-12-01', rollover: false, createdAt: '2025-12-01', updatedAt: '2025-12-01' },
  { id: 'bud-4', categoryId: 'cat-8', amount: 2000000, period: 'monthly', startDate: '2025-12-01', rollover: false, createdAt: '2025-12-01', updatedAt: '2025-12-01' },
  { id: 'bud-5', categoryId: 'cat-9', amount: 5000000, period: 'monthly', startDate: '2025-12-01', rollover: false, createdAt: '2025-12-01', updatedAt: '2025-12-01' },
];

export const funds: Fund[] = [
  { id: 'fund-1', name: 'Quỹ khẩn cấp', targetAmount: 50000000, currentAmount: 30000000, description: 'Dự phòng cho các trường hợp khẩn cấp', icon: '🚨', color: '#EF4444',
    deadline: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },

  { id: 'fund-2', name: 'Quỹ du lịch', targetAmount: 20000000, currentAmount: 12000000, description: 'Tiết kiệm cho chuyến du lịch hè', icon: '✈️', color: '#3B82F6',
    deadline: '2025-06-01', createdAt: '2025-01-01', updatedAt: '2025-01-01' },

  { id: 'fund-3', name: 'Quỹ mua nhà', targetAmount: 500000000, currentAmount: 150000000, description: 'Tiết kiệm để mua nhà', icon: '🏡', color: '#10B981',
    deadline: null, createdAt: '2025-01-01', updatedAt: '2025-01-01' },

  { id: 'fund-4', name: 'Quỹ hưu trí', targetAmount: 1000000000, currentAmount: 80000000, description: 'Tiết kiệm cho tuổi già', icon: '👴', color: '#F59E0B',
    deadline: '2050-01-01', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
];

export const investments: Investment[] = [
  { id: 'inv-1', name: 'VNM - Vinamilk', type: InvestmentType.STOCK, purchasePrice: 80000, currentPrice: 85000, quantity: 100, purchaseDate: '2025-01-15',
    profit: (85000 - 80000) * 100, createdAt: '2025-01-01', updatedAt: '2025-01-01' },

  { id: 'inv-2', name: 'VCB - Vietcombank', type: InvestmentType.STOCK, purchasePrice: 90000, currentPrice: 95000, quantity: 50, purchaseDate: '2025-03-20',
    profit: (95000 - 90000) * 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },

  { id: 'inv-3', name: 'Quỹ DCDS', type: InvestmentType.FUND, purchasePrice: 15000, currentPrice: 16500, quantity: 500, purchaseDate: '2025-06-10',
    profit: (16500 - 15000) * 500, createdAt: '2025-01-01', updatedAt: '2025-01-01' },

  { id: 'inv-4', name: 'Bitcoin', type: InvestmentType.CRYPTO, purchasePrice: 2000000000, currentPrice: 2300000000, quantity: 0.01, purchaseDate: '2025-08-05',
    profit: (2300000000 - 2000000000) * 0.01, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
];

export const debts: Debt[] = [
  { id: 'debt-1', name: 'Vay mua xe', type: DebtType.DEBT, amount: 200000000, remainingAmount: 150000000,
    interestRate: 8.5, startDate: '2024-01-01', dueDate: '2027-01-01',
    monthlyPayment: 6000000, description: 'Vay ngân hàng mua xe', createdAt: '2025-01-01', updatedAt: '2025-01-01' },

  { id: 'debt-2', name: 'Cho Anh Nam vay', type: DebtType.LOAN, amount: 10000000, remainingAmount: 10000000,
    interestRate: 0, startDate: '2025-11-01', dueDate: '2026-01-01',
    monthlyPayment: null, description: 'Cho bạn vay không lãi', createdAt: '2025-01-01', updatedAt: '2025-01-01' },

  { id: 'debt-3', name: 'Thẻ tín dụng', type: DebtType.DEBT, amount: 5000000, remainingAmount: 2000000,
    interestRate: 18, startDate: '2025-12-01', dueDate: '2026-01-15',
    monthlyPayment: null, description: 'Nợ thẻ tín dụng', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
];