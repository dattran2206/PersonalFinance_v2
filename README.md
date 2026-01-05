# Project Summary
The project is a personal finance management application designed to help users track their financial activities, manage budgets, and generate reports. It features a user-friendly dashboard that provides insights into spending, income, and investments, making it easier for individuals to maintain their financial health. Recent updates have enhanced the mobile user experience with a bottom navigation feature and improved responsiveness for various devices.

# Project Module Description
The application consists of several functional modules:
1. **Dashboard** - Overview of financial status with charts and statistics.
2. **Transaction Management** - Track daily, monthly, and yearly transactions.
3. **Category Management** - Organize income and expense categories.
4. **Account Management** - Manage bank accounts and digital wallets.
5. **Budget Management** - Set and monitor budgets for different categories.
6. **Savings Goal Management** - Track savings goals and progress.
7. **Investment Tracking** - Monitor various investment assets.
8. **Loan and Debt Management** - Keep track of loans and debts.
9. **Reporting & Analytics** - Detailed reports and visual analytics.
10. **Project & Recommendation** - Financial recommendations based on user data.
11. **Responsive Layout** - Improved layout for mobile and desktop views.

# Directory Tree
```
shadcn-ui/
├── README.md               # Project overview and documentation
├── components.json         # Component configuration
├── eslint.config.js        # ESLint configuration file
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── public/                 # Public assets
│   ├── favicon.svg         # Application favicon
│   └── robots.txt          # Robots.txt for SEO
├── src/                    # Source code
│   ├── App.css             # Global styles
│   ├── App.tsx             # Main application component
│   ├── components/         # UI components
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utility functions and types
│   ├── pages/              # Application pages
│   ├── layout/             # Layout components (Header, Sidebar, BottomNav)
│   └── main.tsx            # Application entry point
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.*              # TypeScript configurations
└── vite.config.ts          # Vite configuration
```

# File Description Inventory
- **README.md**: Contains project documentation and setup instructions.
- **components.json**: Configuration for UI components.
- **eslint.config.js**: Configuration for code linting.
- **index.html**: Entry point for the web application.
- **package.json**: Lists dependencies and scripts for project management.
- **postcss.config.js**: Configuration for PostCSS.
- **src/**: Contains the source code for the application, including components, pages, hooks, and styles.
- **layout/**: Contains layout components like Header, Sidebar, and BottomNav for responsive design.

# Technology Stack
- **React**: Front-end library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript for building robust applications.
- **Shadcn-UI**: Component library for building UI components.
- **Vite**: Build tool for modern web applications.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Recharts**: Charting library for rendering graphs and data visualizations.

# Usage
1. Install dependencies:
   ```
   pnpm install
   ```
2. Build the application:
   ```
   pnpm run build
   ```
3. Run linting to check for code quality:
   ```
   pnpm run lint
   ```
