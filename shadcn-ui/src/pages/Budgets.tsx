import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CURRENCY_SYMBOLS } from '@/constants/currency';
import {
    Plus,
    Target,
    AlertTriangle,
    CheckCircle,
    Edit,
    Trash2
} from 'lucide-react';

const mockBudgets = [
    {
        id: 1,
        category: 'Groceries',
        limit: 500,
        spent: 340,
        period: 'Monthly',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'on-track'
    },
    {
        id: 2,
        category: 'Entertainment',
        limit: 300,
        spent: 180,
        period: 'Monthly',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'on-track'
    },
    {
        id: 3,
        category: 'Transportation',
        limit: 250,
        spent: 220,
        period: 'Monthly',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'warning'
    },
    {
        id: 4,
        category: 'Shopping',
        limit: 200,
        spent: 250,
        period: 'Monthly',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'exceeded'
    }
];

const categories = [
    'Groceries', 'Transportation', 'Entertainment', 'Shopping',
    'Utilities', 'Healthcare', 'Dining', 'Travel', 'Education', 'Other'
];

export default function Budgets() {
    const [budgets, setBudgets] = useState(mockBudgets);
    const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);

    const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    const overBudgetCount = budgets.filter(b => b.status === 'exceeded').length;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'on-track': return 'text-green-600';
            case 'warning': return 'text-yellow-600';
            case 'exceeded': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'on-track': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
            case 'exceeded': return <AlertTriangle className="h-4 w-4 text-red-600" />;
            default: return null;
        }
    };

    const getBudgetStatus = (spent: number, limit: number) => {
        const percentage = (spent / limit) * 100;
        if (percentage >= 100) return 'exceeded';
        if (percentage >= 80) return 'warning';
        return 'on-track';
    };

    const handleAddBudget = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const limit = parseFloat(formData.get('limit') as string);

        const newBudget = {
            id: budgets.length + 1,
            category: formData.get('category') as string,
            limit,
            spent: 0,
            period: formData.get('period') as string,
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
            status: 'on-track'
        };

        setBudgets([...budgets, newBudget]);
        setIsAddBudgetOpen(false);
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Budgets</h1>
                        <p className="text-muted-foreground">Set spending limits and track your progress</p>
                    </div>
                    <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center space-x-2">
                                <Plus className="h-4 w-4" />
                                <span>Add Budget</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Budget</DialogTitle>
                                <DialogDescription>
                                    Set a spending limit for a category
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddBudget} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select name="category" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>{category}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="limit">Budget Limit</Label>
                                        <Input
                                            id="limit"
                                            name="limit"
                                            type="number"
                                            step="0.01"
                                            placeholder="500.00"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="period">Period</Label>
                                        <Select name="period" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select period" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Weekly">Weekly</SelectItem>
                                                <SelectItem value="Monthly">Monthly</SelectItem>
                                                <SelectItem value="Quarterly">Quarterly</SelectItem>
                                                <SelectItem value="Yearly">Yearly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="startDate">Start Date</Label>
                                        <Input
                                            id="startDate"
                                            name="startDate"
                                            type="date"
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endDate">End Date</Label>
                                        <Input
                                            id="endDate"
                                            name="endDate"
                                            type="date"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Create Budget</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalBudget.toLocaleString()}{CURRENCY_SYMBOLS}</div>
                            <p className="text-xs text-muted-foreground">
                                Monthly allocation
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalSpent.toLocaleString()}{CURRENCY_SYMBOLS}</div>
                            <p className="text-xs text-muted-foreground">
                                {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget used
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {(totalBudget - totalSpent).toLocaleString()}{CURRENCY_SYMBOLS}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Available to spend
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts */}
                {overBudgetCount > 0 && (
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            You have {overBudgetCount} budget{overBudgetCount > 1 ? 's' : ''} that exceeded the limit this month.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Budget Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {budgets.map((budget) => {
                        const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                        const remaining = budget.limit - budget.spent;

                        return (
                            <Card key={budget.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center space-x-2">
                                                <span>{budget.category}</span>
                                                {getStatusIcon(budget.status)}
                                            </CardTitle>
                                            <CardDescription>
                                                {budget.period} • {budget.startDate} to {budget.endDate}
                                            </CardDescription>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Spent: {budget.spent.toLocaleString()}{CURRENCY_SYMBOLS}</span>
                                            <span>Limit: {budget.limit.toLocaleString()}{CURRENCY_SYMBOLS}</span>
                                        </div>
                                        <Progress
                                            value={percentage}
                                            className={`h-2 ${budget.status === 'exceeded' ? '[&>div]:bg-red-500' :
                                                    budget.status === 'warning' ? '[&>div]:bg-yellow-500' :
                                                        '[&>div]:bg-green-500'
                                                }`}
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{percentage.toFixed(1)}% used</span>
                                            <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                {remaining >= 0 ? `$${remaining.toLocaleString()} left` : `$${Math.abs(remaining).toLocaleString()} over`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t">
                                        <Badge
                                            variant={budget.status === 'on-track' ? 'default' : 'destructive'}
                                            className={getStatusColor(budget.status)}
                                        >
                                            {budget.status === 'on-track' ? 'On Track' :
                                                budget.status === 'warning' ? 'Near Limit' : 'Over Budget'}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}