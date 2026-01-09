# Ứng Dụng Quản Lý Tài Chính Cá Nhân - Kế Hoạch Phát Triển

## 🏁 Tiến Độ Phát Triển

### ✅ Giai Đoạn 1: Khởi Tạo & Cấu Trúc
- [x] Thiết lập dự án Vite + React + TypeScript
- [x] Cài đặt Tailwind CSS & Shadcn-UI
- [x] Định nghĩa Themes, Colors, Typography
- [x] Thiết lập cấu trúc thư mục chuẩn

### ✅ Giai Đoạn 2: Components Cơ Bản & Layout
- [x] Xây dựng Layout chính (Sidebar, Header)
- [x] Xây dựng Mobile Layout (Bottom Navigation)
- [x] Định nghĩa Types & Mock Data (`lib/types.ts`, `lib/mockData.ts`)
- [x] Các UI Component cơ bản (Cards, Buttons, Inputs, Tables)

### ✅ Giai Đoạn 3: Các Tính Năng Cốt Lõi
- [x] **Dashboard**: Overview cards, charts, recent transactions.
- [x] **Giao Dịch (Transactions)**: Danh sách, thêm/sửa/xóa, bộ lọc.
- [x] **Danh Mục (Categories)**: Quản lý danh mục thu/chi.
- [x] **Tài Khoản (Accounts)**: Quản lý số dư các tài khoản.
- [x] **Chuyển Tiền (Transfer)**: Chuyển tiền giữa các tài khoản.

### ✅ Giai Đoạn 4: Tính Năng Nâng Cao
- [x] **Ngân Sách (Budget)**: Thiết lập ngân sách, progress bars.
- [x] **Quỹ Tiết Kiệm (Funds)**: Theo dõi mục tiêu tích lũy.
- [x] **Đầu Tư (Investments)**: Theo dõi danh mục đầu tư.
- [x] **Nợ (Debts)**: Quản lý nợ vay và cho vay.

### ✅ Giai Đoạn 5: Báo Cáo & Tiện Ích
- [x] **Báo Cáo (Reports)**: Biểu đồ phân tích chi tiết.
- [x] **Dự Báo (Predictions)**: Phân tích xu hướng tương lai.
- [x] **Cài Đặt (Settings)**: Cấu hình ứng dụng.

### ⏳ Giai Đoạn 6: Hoàn Thiện & Deployment
- [x] Kiểm tra và tối ưu UI/UX (Responsive)
- [x] Cấu hình PWA (Progressive Web App)
- [x] Build Production
- [x] Cấu hình GitHub Actions Deployment
- [ ] Verify Deployment trên GitHub Pages

---

## 🎨 Hướng Dẫn Thiết Kế (Reference)

### Bảng Màu Chính
- Primary: #10B981 (Emerald Green)
- Secondary: #3B82F6 (Blue)
- Accent: #F59E0B (Amber)
- Background: #F9FAFB / Card: #FFFFFF

### Cấu Trúc Trang (Pages)
Các trang đã hoàn thành (`src/pages/`):
- `Index.tsx` (Dashboard)
- `Transactions.tsx`
- `Categories.tsx`
- `Accounts.tsx`
- `Budget.tsx`
- `Funds.tsx`
- `Investments.tsx`
- `Debts.tsx`
- `Reports.tsx`
- `Predictions.tsx`
- `Transfer.tsx`
- `Settings.tsx`