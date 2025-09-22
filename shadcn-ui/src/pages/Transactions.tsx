import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CURRENCY_SYMBOLS } from '@/constants/currency';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Search,
    Calendar
} from 'lucide-react';

const mockTransactions = [
    {
        id: 1,
        type: 'income',
        amount: 3200.00,
        category: 'Salary',
        wallet: 'Main Checking',
        date: '2024-01-15',
        note: 'Monthly salary payment',
        status: 'completed'
    },
    {
        id: 2,
        type: 'expense',
        amount: -85.50,
        category: 'Groceries',
        wallet: 'Main Checking',
        date: '2024-01-15',
        note: 'Weekly grocery shopping',
        status: 'completed'
    },
    {
        id: 3,
        type: 'expense',
        amount: -45.00,
        category: 'Transportation',
        wallet: 'Main Checking',
        date: '2024-01-14',
        note: 'Gas station fill-up',
        status: 'completed'
    },
    {
        id: 4,
        type: 'expense',
        amount: -120.00,
        category: 'Utilities',
        wallet: 'Main Checking',
        date: '2024-01-13',
        note: 'Electricity bill',
        status: 'completed'
    },
    {
        id: 5,
        type: 'income',
        amount: 500.00,
        category: 'Freelance',
        wallet: 'Main Checking',
        date: '2024-01-12',
        note: 'Web design project',
        status: 'completed'
    },
    {
        id: 6,
        type: 'expense',
        amount: -75.00,
        category: 'Entertainment',
        wallet: 'Main Checking',
        date: '2024-01-11',
        note: 'Movie night with friends',
        status: 'completed'
    }
];

const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
    expense: ['Groceries', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other Expense']
};

const wallets = ['Main Checking', 'Emergency Savings', 'Investment Portfolio', 'Vacation Fund'];

export default function Transactions() {
    const [transactions, setTransactions] = useState(mockTransactions);
    const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = transactions.filter(transaction => {
        const matchesType = filterType === 'all' || transaction.type === filterType;
        const matchesSearch = transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.note.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const type = formData.get('type') as string;
        const amount = parseFloat(formData.get('amount') as string);

        const newTransaction = {
            id: transactions.length + 1,
            type,
            amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
            category: formData.get('category') as string,
            wallet: formData.get('wallet') as string,
            date: formData.get('date') as string,
            note: formData.get('note') as string || '',
            status: 'completed'
        };

        setTransactions([newTransaction, ...transactions]);
        setIsAddTransactionOpen(false);
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Transactions</h1>
                        <p className="text-muted-foreground">Track your income and expenses</p>
                    </div>
                    <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center space-x-2">
                                <Plus className="h-4 w-4" />
                                <span>Add Transaction</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add Transaction</DialogTitle>
                                <DialogDescription>
                                    Record a new income or expense
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddTransaction} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select name="type" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="income">Income</SelectItem>
                                            <SelectItem value="expense">Expense</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount</Label>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input
                                            id="date"
                                            name="date"
                                            type="date"
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select name="category" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <optgroup label="Income">
                                                {categories.income.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Expense">
                                                {categories.expense.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </optgroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="wallet">Wallet</Label>
                                    <Select name="wallet" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select wallet" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {wallets.map((wallet) => (
                                                <SelectItem key={wallet} value={wallet}>{wallet}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="note">Note (Optional)</Label>
                                    <Textarea
                                        id="note"
                                        name="note"
                                        placeholder="Add a note..."
                                        rows={2}
                                    />
                                </div>
                                <Button type="submit" className="w-full">Add Transaction</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {totalIncome.toLocaleString()}{CURRENCY_SYMBOLS}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {totalExpenses.toLocaleString()}{CURRENCY_SYMBOLS}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                            <Calendar className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {(totalIncome - totalExpenses).toLocaleString()}{CURRENCY_SYMBOLS}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Tabs value={filterType} onValueChange={setFilterType}>
                                <TabsList>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="income">Income</TabsTrigger>
                                    <TabsTrigger value="expense">Expenses</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>
                            {filteredTransactions.length} transactions found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-2 rounded-full ${transaction.type === 'income'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                            }`}>
                                            {transaction.type === 'income' ?
                                                <ArrowUpRight className="h-4 w-4" /> :
                                                <ArrowDownRight className="h-4 w-4" />
                                            }
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <p className="font-medium">{transaction.category}</p>
                                                <Badge variant="outline">{transaction.wallet}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {transaction.date} • {transaction.note}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {transaction.type === 'income' ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()}{CURRENCY_SYMBOLS}
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {transaction.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}