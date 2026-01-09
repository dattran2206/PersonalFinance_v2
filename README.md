# Quản Lý Tài Chính Cá Nhân (Personal Finance App)

Ứng dụng quản lý tài chính cá nhân toàn diện, giúp bạn theo dõi thu chi, quản lý ngân sách, đầu tư và đạt được các mục tiêu tài chính một cách hiệu quả.

## 🚀 Tính Năng Chính

Ứng dụng bao gồm các module chức năng chi tiết:

1.  **Dashboard Tổng Quan**: Cái nhìn toàn cảnh về tình hình tài chính với biểu đồ trực quan.
2.  **Quản Lý Thu Chi**: Theo dõi giao dịch hàng ngày, hàng tháng, bộ lọc chi tiết.
3.  **Quản Lý Danh Mục**: Tùy chỉnh danh mục chi tiêu và thu nhập.
4.  **Tài Khoản & Ví**: Quản lý nhiều tài khoản ngân hàng, ví điện tử, tiền mặt.
5.  **Ngân Sách (Budget)**: Thiết lập và giám sát hạn mức chi tiêu cho từng danh mục.
6.  **Quỹ Tiết Kiệm (Funds)**: Theo dõi tiến độ các mục tiêu tiết kiệm.
7.  **Đầu Tư (Investments)**: Theo dõi danh mục đầu tư, tính toán lợi nhuận/lỗ.
8.  **Nợ & Cho Vay (Debts)**: Quản lý các khoản nợ phải trả và khoản cho vay.
9.  **Báo Cáo (Reports)**: Phân tích chi tiêu, thu nhập và tài sản ròng qua biểu đồ.
10. **Dự Báo (Predictions)**: Dự đoán xu hướng tài chính và đưa ra lời khuyên.
11. **Chuyển Tiền (Transfer)**: Chức năng chuyển tiền giữa các tài khoản nội bộ.

## 🛠️ Công Nghệ Sử Dụng

-   **Frontend Framework**: React (Vite)
-   **Language**: TypeScript
-   **UI Library**: Shadcn-UI
-   **Styling**: Tailwind CSS
-   **Charts**: Recharts
-   **Icons**: Lucide React
-   **PWA**: Vite PWA (Hỗ trợ cài đặt như ứng dụng native)

## 📦 Cài Đặt và Chạy Dự Án

### Yêu cầu
-   Node.js (version 18+)
-   pnpm (khuyên dùng) hoặc npm

### Các bước cài đặt

1.  **Cài đặt dependencies**:
    ```bash
    pnpm install
    ```

2.  **Chạy server development**:
    ```bash
    pnpm dev
    ```
    Truy cập `http://localhost:5173` (hoặc port hiển thị trên terminal).

3.  **Build cho production**:
    ```bash
    pnpm build
    ```
    Thư mục đầu ra sẽ là `dist/`.

## 📂 Cấu Trúc Thư Mục

```
src/
├── components/         # Các thành phần UI tái sử dụng
│   ├── dashboard/      # Cards, charts cho dashboard
│   ├── layout/         # Header, Sidebar, BottomNav
│   ├── ui/             # Shadcn UI components
│   └── ...             # Các components theo tính năng
├── pages/              # Các trang chính (Dashboard, Transactions, Budget...)
├── services/           # Xử lý logic nghiệp vụ, API (nếu có)
├── lib/                # Tiện ích, types, dummy data
└── App.tsx             # Routing và cấu hình chính
```
