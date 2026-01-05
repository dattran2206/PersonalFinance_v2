# Ứng Dụng Quản Lý Tài Chính Cá Nhân - Kế Hoạch Phát Triển

## Hướng Dẫn Thiết Kế

### Tham Khảo Thiết Kế
- **Mint.com**: Giao diện dashboard rõ ràng, biểu đồ trực quan
- **YNAB (You Need A Budget)**: Quản lý ngân sách hiệu quả
- **Phong cách**: Modern Financial Dashboard + Clean UI + Data Visualization

### Bảng Màu
- Primary: #10B981 (Emerald Green - màu chủ đạo, biểu tượng tăng trưởng tài chính)
- Secondary: #3B82F6 (Blue - màu phụ cho các thành phần quan trọng)
- Accent: #F59E0B (Amber - cảnh báo, nhấn mạnh)
- Success: #22C55E (Green - thu nhập, lợi nhuận)
- Danger: #EF4444 (Red - chi tiêu, nợ)
- Background: #F9FAFB (Light Gray - nền chính)
- Card: #FFFFFF (White - nền card)
- Text: #111827 (Dark Gray - text chính)
- Text Secondary: #6B7280 (Gray - text phụ)

### Typography
- Heading1: Inter font-weight 700 (32px)
- Heading2: Inter font-weight 600 (24px)
- Heading3: Inter font-weight 600 (20px)
- Body/Normal: Inter font-weight 400 (14px)
- Body/Emphasis: Inter font-weight 600 (14px)
- Navigation: Inter font-weight 500 (16px)

### Các Thành Phần Chính
- **Buttons**: Primary (bg-emerald-600, text-white), Secondary (bg-blue-600), Outline (border-gray-300)
- **Cards**: White background, subtle shadow, 8px rounded corners, hover: slight elevation
- **Forms**: Clean inputs with focus ring, labels above inputs
- **Tables**: Striped rows, hover effects, sortable headers
- **Charts**: Sử dụng recharts với màu sắc nhất quán

### Layout & Spacing
- Sidebar: 280px width, fixed position, dark background
- Main content: Padding 24px, max-width for readability
- Card spacing: 16px gaps between cards
- Section padding: 32px vertical

### Hình Ảnh Cần Tạo
1. **dashboard-hero-bg.jpg** - Background gradient cho header dashboard, modern financial theme (Style: abstract, gradient, professional)
2. **empty-state-transactions.svg** - Illustration cho trạng thái không có giao dịch, friendly style (Style: minimalist illustration, line art)
3. **empty-state-investments.svg** - Illustration cho trạng thái không có đầu tư (Style: minimalist illustration, line art)
4. **financial-growth-icon.png** - Icon biểu tượng tăng trưởng tài chính cho logo (Style: modern icon, emerald green)
5. **budget-planning-illustration.svg** - Illustration cho trang ngân sách (Style: minimalist illustration, colorful)
6. **savings-jar-icon.png** - Icon hũ tiết kiệm (Style: 3d icon, cute)

---

## Các File Cần Tạo

### 1. Cấu Trúc Thư Mục
```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── dashboard/
│   │   ├── OverviewCards.tsx
│   │   ├── SpendingChart.tsx
│   │   └── RecentTransactions.tsx
│   ├── transactions/
│   │   ├── TransactionList.tsx
│   │   ├── TransactionForm.tsx
│   │   └── TransactionFilters.tsx
│   ├── categories/
│   │   ├── CategoryList.tsx
│   │   └── CategoryForm.tsx
│   ├── accounts/
│   │   ├── AccountList.tsx
│   │   └── AccountForm.tsx
│   ├── budget/
│   │   ├── BudgetOverview.tsx
│   │   └── BudgetForm.tsx
│   ├── funds/
│   │   ├── FundList.tsx
│   │   └── FundForm.tsx
│   ├── investments/
│   │   ├── InvestmentList.tsx
│   │   └── InvestmentForm.tsx
│   ├── debts/
│   │   ├── DebtList.tsx
│   │   └── DebtForm.tsx
│   ├── reports/
│   │   ├── SpendingReport.tsx
│   │   ├── IncomeReport.tsx
│   │   └── NetWorthChart.tsx
│   └── predictions/
│       └── PredictionPanel.tsx
├── pages/
│   ├── Index.tsx (Dashboard)
│   ├── Transactions.tsx
│   ├── Categories.tsx
│   ├── Accounts.tsx
│   ├── Budget.tsx
│   ├── Funds.tsx
│   ├── Investments.tsx
│   ├── Debts.tsx
│   ├── Reports.tsx
│   └── Predictions.tsx
├── lib/
│   ├── types.ts
│   ├── mockData.ts
│   └── calculations.ts
└── App.tsx (cập nhật routes)
```

### 2. Chi Tiết Các File

#### Types & Data (src/lib/types.ts)
- Định nghĩa các interface: Transaction, Category, Account, Budget, Fund, Investment, Debt
- Enum cho TransactionType, AccountType, CategoryType

#### Mock Data (src/lib/mockData.ts)
- Dữ liệu mẫu cho tất cả các entities
- Hàm generate dữ liệu ngẫu nhiên cho demo

#### Calculations (src/lib/calculations.ts)
- Tính tổng thu/chi
- Tính số dư tài khoản
- Tính phần trăm sử dụng ngân sách
- Dự đoán chi tiêu dựa trên lịch sử

#### Layout Components
- Sidebar: Navigation menu với icons
- Header: User info, notifications
- Layout: Wrapper cho toàn bộ app

#### Dashboard Components
- OverviewCards: Hiển thị tổng tài sản, thu nhập, chi tiêu tháng này
- SpendingChart: Biểu đồ xu hướng chi tiêu
- RecentTransactions: 5 giao dịch gần nhất

#### Transaction Components
- TransactionList: Bảng danh sách giao dịch với filter, sort, pagination
- TransactionForm: Form thêm/sửa giao dịch
- TransactionFilters: Bộ lọc theo ngày, danh mục, tài khoản

#### Category Components
- CategoryList: Danh sách danh mục với icon, màu sắc
- CategoryForm: Form thêm/sửa danh mục

#### Account Components
- AccountList: Danh sách tài khoản với số dư
- AccountForm: Form thêm/sửa tài khoản

#### Budget Components
- BudgetOverview: Tổng quan ngân sách với progress bars
- BudgetForm: Form thiết lập ngân sách theo danh mục

#### Fund Components
- FundList: Danh sách các quỹ tiết kiệm
- FundForm: Form thêm/sửa quỹ

#### Investment Components
- InvestmentList: Danh sách đầu tư với giá trị hiện tại, lợi nhuận
- InvestmentForm: Form thêm/sửa khoản đầu tư

#### Debt Components
- DebtList: Danh sách nợ/cho vay với lịch trả
- DebtForm: Form thêm/sửa khoản nợ

#### Report Components
- SpendingReport: Biểu đồ tròn chi tiêu theo danh mục
- IncomeReport: Biểu đồ thu nhập theo nguồn
- NetWorthChart: Biểu đồ tài sản ròng theo thời gian

#### Prediction Components
- PredictionPanel: Hiển thị dự đoán và khuyến nghị

### 3. Pages
Mỗi page sẽ import các components tương ứng và hiển thị đầy đủ chức năng

### 4. Routing (App.tsx)
Cập nhật routes cho tất cả các pages

### 5. Styling
- Sử dụng Tailwind CSS với bảng màu đã định nghĩa
- Responsive design cho mobile, tablet, desktop
- Dark mode support (optional)

## Thứ Tự Phát Triển

1. Tạo types và mock data
2. Tạo layout components (Sidebar, Header, Layout)
3. Tạo Dashboard page với overview cards và charts
4. Tạo Transactions page với CRUD operations
5. Tạo Categories page
6. Tạo Accounts page
7. Tạo Budget page
8. Tạo Funds page
9. Tạo Investments page
10. Tạo Debts page
11. Tạo Reports page
12. Tạo Predictions page
13. Cập nhật routing trong App.tsx
14. Testing và polish UI