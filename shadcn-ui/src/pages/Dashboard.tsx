import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CURRENCY_SYMBOLS } from '@/constants/currency';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Target,
    PiggyBank,
    CreditCard,
    Plus,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const mockData = {
    wallets: [
        { id: 1, name: 'Techcombank', balance: 1000000, type: 'bank' },
        { id: 2, name: 'Momo', balance: 3500000, type: 'wallet' },
        { id: 3, name: 'Vietcombank', balance: 55925000, type: 'Savings' }
    ],
    recentTransactions: [
        { id: 1, type: 'expense', amount: -20000, category: 'Groceries', date: '2024-01-15', wallet: 'Momo' },
        { id: 2, type: 'income', amount: 15400000, category: 'Salary', date: '2024-01-15', wallet: 'Vietcombank' },
        { id: 3, type: 'expense', amount: -540000, category: 'Gas', date: '2024-01-14', wallet: 'Momo' },
        { id: 4, type: 'expense', amount: -60000, category: 'Utilities', date: '2024-01-13', wallet: 'Momo' }
    ],
    budgets: [
        { category: 'Coffee', spent: 40000, limit: 200000 },
        { category: 'Home Cost', spent: 2000000, limit: 2000000 },
        { category: 'Network', spent: 200000, limit: 200000 }
    ],
    goals: [
        { name: 'Get wife', current: 9000000, target: 150000000, percentage: 6 },
        { name: 'New camera', current: 0, target: 6800000, percentage: 0 },
        { name: 'New Motobike', current: 0, target: 80000000, percentage: 0 }
    ],
    monthlyData: [
        { month: 'Oct', income: 15400000, expenses: 10000000 },
        { month: 'Nov', income: 16000000, expenses: 11000000 },
        { month: 'Dec', income: 15000000, expenses: 16000000 },
        { month: 'Jan', income: 15300000, expenses: 15500000 }
    ],
    categoryData: [
        { name: 'Groceries', value: 340, color: '#8884d8' },
        { name: 'Utilities', value: 280, color: '#82ca9d' },
        { name: 'Entertainment', value: 180, color: '#ffc658' },
        { name: 'Transportation', value: 220, color: '#ff7c7c' }
    ]
};

export default function Dashboard() {
    const [totalBalance, setTotalBalance] = useState(0);
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [monthlyExpenses, setMonthlyExpenses] = useState(0);

    useEffect(() => {
        const total = mockData.wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
        setTotalBalance(total);

        const currentMonth = mockData.monthlyData[mockData.monthlyData.length - 1];
        setMonthlyIncome(currentMonth.income);
        setMonthlyExpenses(currentMonth.expenses);
    }, []);

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
                    </div>
                    <Button className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Transaction</span>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalBalance.toLocaleString()}{CURRENCY_SYMBOLS}</div>
                            <p className="text-xs text-muted-foreground">
                                +2.5% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{monthlyIncome.toLocaleString()}{CURRENCY_SYMBOLS}</div>
                            <p className="text-xs text-muted-foreground">
                                +12% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{monthlyExpenses.toLocaleString()}{CURRENCY_SYMBOLS}</div>
                            <p className="text-xs text-muted-foreground">
                                -5% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
                            <PiggyBank className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{(monthlyIncome - monthlyExpenses).toLocaleString()}{CURRENCY_SYMBOLS}</div>
                            <p className="text-xs text-muted-foreground">
                                +28% from last month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Income vs Expenses</CardTitle>
                            <CardDescription>Monthly comparison over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={mockData.monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="income" fill="#22c55e" name="Income" />
                                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Spending by Category</CardTitle>
                            <CardDescription>This month's expense breakdown</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={mockData.categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {mockData.categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Transactions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Your latest financial activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockData.recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {transaction.type === 'income' ?
                                                    <ArrowUpRight className="h-4 w-4" /> :
                                                    <ArrowDownRight className="h-4 w-4" />
                                                }
                                            </div>
                                            <div>
                                                <p className="font-medium">{transaction.category}</p>
                                                <p className="text-sm text-muted-foreground">{transaction.wallet}</p>
                                            </div>
                                        </div>
                                        <div className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {transaction.type === 'income' ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()}{CURRENCY_SYMBOLS}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Budget Progress */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Budget Progress</CardTitle>
                            <CardDescription>How you're doing this month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockData.budgets.map((budget, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{budget.category}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {budget.spent}{CURRENCY_SYMBOLS} / {budget.limit}{CURRENCY_SYMBOLS}
                                            </span>
                                        </div>
                                        <Progress value={(budget.spent / budget.limit) * 100} className="h-2" />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{(budget.spent / budget.limit) * 100}% used</span>
                                            <span>{budget.limit - budget.spent}{CURRENCY_SYMBOLS} remaining</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Savings Goals */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Savings Goals</CardTitle>
                            <CardDescription>Track your progress</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockData.goals.map((goal, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{goal.name}</span>
                                            <Badge variant="outline">{(goal.current / goal.target) * 100}%</Badge>
                                        </div>
                                        <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{goal.current.toLocaleString()}{CURRENCY_SYMBOLS}</span>
                                            <span>{goal.target.toLocaleString()}{CURRENCY_SYMBOLS}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}