import {
  Category,
  CategoryType,
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
  // Income categories
  { id: 'cat-1', name: 'Lương', type: CategoryType.INCOME, icon: '💼', color: '#10B981' },
  { id: 'cat-2', name: 'Thưởng', type: CategoryType.INCOME, icon: '🎁', color: '#22C55E' },
  { id: 'cat-3', name: 'Đầu tư', type: CategoryType.INCOME, icon: '📈', color: '#3B82F6' },
  { id: 'cat-4', name: 'Thu nhập khác', type: CategoryType.INCOME, icon: '💰', color: '#14B8A6' },
  
  // Expense categories
  { id: 'cat-5', name: 'Ăn uống', type: CategoryType.EXPENSE, icon: '🍔', color: '#F59E0B' },
  { id: 'cat-6', name: 'Đi lại', type: CategoryType.EXPENSE, icon: '🚗', color: '#EF4444' },
  { id: 'cat-7', name: 'Mua sắm', type: CategoryType.EXPENSE, icon: '🛍️', color: '#EC4899' },
  { id: 'cat-8', name: 'Giải trí', type: CategoryType.EXPENSE, icon: '🎮', color: '#8B5CF6' },
  { id: 'cat-9', name: 'Nhà ở', type: CategoryType.EXPENSE, icon: '🏠', color: '#6366F1' },
  { id: 'cat-10', name: 'Y tế', type: CategoryType.EXPENSE, icon: '⚕️', color: '#06B6D4' },
  { id: 'cat-11', name: 'Giáo dục', type: CategoryType.EXPENSE, icon: '📚', color: '#0EA5E9' },
  { id: 'cat-12', name: 'Tiết kiệm', type: CategoryType.EXPENSE, icon: '🏦', color: '#10B981' },
];

export const accounts: Account[] = [
  { id: 'acc-1', name: 'Vietcombank', type: AccountType.BANK, balance: 50000000, currency: 'VND', icon: '🏦', color: '#10B981' },
  { id: 'acc-2', name: 'Techcombank', type: AccountType.BANK, balance: 30000000, currency: 'VND', icon: '🏦', color: '#3B82F6' },
  { id: 'acc-3', name: 'MoMo', type: AccountType.EWALLET, balance: 5000000, currency: 'VND', icon: '📱', color: '#EC4899' },
  { id: 'acc-4', name: 'ZaloPay', type: AccountType.EWALLET, balance: 3000000, currency: 'VND', icon: '📱', color: '#0EA5E9' },
  { id: 'acc-5', name: 'Visa Credit', type: AccountType.CREDIT_CARD, balance: -2000000, currency: 'VND', icon: '💳', color: '#F59E0B' },
  { id: 'acc-6', name: 'Tiền mặt', type: AccountType.CASH, balance: 2000000, currency: 'VND', icon: '💵', color: '#22C55E' },
];

export const transactions: Transaction[] = [
  { id: 'txn-1', date: '2025-12-28', amount: 20000000, type: TransactionType.INCOME, categoryId: 'cat-1', accountId: 'acc-1', description: 'Lương tháng 12' },
  { id: 'txn-2', date: '2025-12-27', amount: 500000, type: TransactionType.EXPENSE, categoryId: 'cat-5', accountId: 'acc-3', description: 'Ăn trưa nhà hàng' },
  { id: 'txn-3', date: '2025-12-26', amount: 200000, type: TransactionType.EXPENSE, categoryId: 'cat-6', accountId: 'acc-4', description: 'Xăng xe' },
  { id: 'txn-4', date: '2025-12-25', amount: 1500000, type: TransactionType.EXPENSE, categoryId: 'cat-7', accountId: 'acc-2', description: 'Mua quần áo' },
  { id: 'txn-5', date: '2025-12-24', amount: 800000, type: TransactionType.EXPENSE, categoryId: 'cat-8', accountId: 'acc-3', description: 'Xem phim và ăn tối' },
  { id: 'txn-6', date: '2025-12-23', amount: 5000000, type: TransactionType.EXPENSE, categoryId: 'cat-9', accountId: 'acc-1', description: 'Tiền thuê nhà tháng 1' },
  { id: 'txn-7', date: '2025-12-22', amount: 3000000, type: TransactionType.INCOME, categoryId: 'cat-2', accountId: 'acc-1', description: 'Thưởng cuối năm' },
  { id: 'txn-8', date: '2025-12-21', amount: 300000, type: TransactionType.EXPENSE, categoryId: 'cat-5', accountId: 'acc-6', description: 'Đi chợ' },
  { id: 'txn-9', date: '2025-12-20', amount: 1000000, type: TransactionType.EXPENSE, categoryId: 'cat-10', accountId: 'acc-2', description: 'Khám bệnh' },
  { id: 'txn-10', date: '2025-12-19', amount: 2000000, type: TransactionType.EXPENSE, categoryId: 'cat-11', accountId: 'acc-1', description: 'Học phí khóa học' },
];

export const budgets: Budget[] = [
  { id: 'bud-1', categoryId: 'cat-5', amount: 5000000, period: 'monthly', startDate: '2025-12-01' },
  { id: 'bud-2', categoryId: 'cat-6', amount: 2000000, period: 'monthly', startDate: '2025-12-01' },
  { id: 'bud-3', categoryId: 'cat-7', amount: 3000000, period: 'monthly', startDate: '2025-12-01' },
  { id: 'bud-4', categoryId: 'cat-8', amount: 2000000, period: 'monthly', startDate: '2025-12-01' },
  { id: 'bud-5', categoryId: 'cat-9', amount: 5000000, period: 'monthly', startDate: '2025-12-01' },
];

export const funds: Fund[] = [
  { id: 'fund-1', name: 'Quỹ khẩn cấp', targetAmount: 50000000, currentAmount: 30000000, description: 'Dự phòng cho các trường hợp khẩn cấp', icon: '🚨', color: '#EF4444' },
  { id: 'fund-2', name: 'Quỹ du lịch', targetAmount: 20000000, currentAmount: 12000000, description: 'Tiết kiệm cho chuyến du lịch hè', icon: '✈️', color: '#3B82F6' },
  { id: 'fund-3', name: 'Quỹ mua nhà', targetAmount: 500000000, currentAmount: 150000000, description: 'Tiết kiệm để mua nhà', icon: '🏡', color: '#10B981' },
  { id: 'fund-4', name: 'Quỹ hưu trí', targetAmount: 1000000000, currentAmount: 80000000, description: 'Tiết kiệm cho tuổi già', icon: '👴', color: '#F59E0B' },
];

export const investments: Investment[] = [
  { id: 'inv-1', name: 'VNM - Vinamilk', type: InvestmentType.STOCK, purchasePrice: 80000, currentPrice: 85000, quantity: 100, purchaseDate: '2025-01-15', description: 'Cổ phiếu Vinamilk' },
  { id: 'inv-2', name: 'VCB - Vietcombank', type: InvestmentType.STOCK, purchasePrice: 90000, currentPrice: 95000, quantity: 50, purchaseDate: '2025-03-20', description: 'Cổ phiếu Vietcombank' },
  { id: 'inv-3', name: 'Quỹ DCDS', type: InvestmentType.FUND, purchasePrice: 15000, currentPrice: 16500, quantity: 500, purchaseDate: '2025-06-10', description: 'Quỹ cổ phiếu Dragon Capital' },
  { id: 'inv-4', name: 'Bitcoin', type: InvestmentType.CRYPTO, purchasePrice: 2000000000, currentPrice: 2300000000, quantity: 0.01, purchaseDate: '2025-08-05', description: 'Đầu tư Bitcoin' },
];

export const debts: Debt[] = [
  { id: 'debt-1', name: 'Vay mua xe', type: DebtType.DEBT, amount: 200000000, remainingAmount: 150000000, interestRate: 8.5, startDate: '2024-01-01', dueDate: '2027-01-01', description: 'Vay ngân hàng mua xe' },
  { id: 'debt-2', name: 'Cho Anh Nam vay', type: DebtType.LOAN, amount: 10000000, remainingAmount: 10000000, interestRate: 0, startDate: '2025-11-01', dueDate: '2026-01-01', description: 'Cho bạn vay không lãi' },
  { id: 'debt-3', name: 'Thẻ tín dụng', type: DebtType.DEBT, amount: 5000000, remainingAmount: 2000000, interestRate: 18, startDate: '2025-12-01', dueDate: '2026-01-15', description: 'Nợ thẻ tín dụng' },
];