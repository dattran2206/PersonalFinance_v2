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
import { Textarea } from '@/components/ui/textarea';
import { CURRENCY_SYMBOLS } from '@/constants/currency';
import {
    Plus,
    Target,
    PiggyBank,
    Calendar,
    TrendingUp,
    Edit,
    Trash2,
    CheckCircle
} from 'lucide-react';

const mockGoals = [
    {
        id: 1,
        name: 'Emergency Fund',
        description: 'Build 6 months of expenses for emergencies',
        targetAmount: 15000,
        currentAmount: 8500,
        startDate: '2023-06-01',
        targetDate: '2024-12-31',
        status: 'in-progress',
        priority: 'high'
    },
    {
        id: 2,
        name: 'Vacation to Europe',
        description: 'Save for a 2-week trip to Europe',
        targetAmount: 5000,
        currentAmount: 2200,
        startDate: '2024-01-01',
        targetDate: '2024-08-01',
        status: 'in-progress',
        priority: 'medium'
    },
    {
        id: 3,
        name: 'New Car Down Payment',
        description: 'Save for a down payment on a new car',
        targetAmount: 25000,
        currentAmount: 12000,
        startDate: '2023-09-01',
        targetDate: '2025-03-01',
        status: 'in-progress',
        priority: 'medium'
    },
    {
        id: 4,
        name: 'Home Renovation',
        description: 'Kitchen and bathroom renovation',
        targetAmount: 8000,
        currentAmount: 8000,
        startDate: '2023-01-01',
        targetDate: '2023-12-31',
        status: 'completed',
        priority: 'high'
    }
];

export default function Goals() {
    const [goals, setGoals] = useState(mockGoals);
    const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

    const activeGoals = goals.filter(goal => goal.status === 'in-progress');
    const completedGoals = goals.filter(goal => goal.status === 'completed');
    const totalTargetAmount = activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrentAmount = activeGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'paused': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const calculateDaysRemaining = (targetDate: string) => {
        const today = new Date();
        const target = new Date(targetDate);
        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const newGoal = {
            id: goals.length + 1,
            name: formData.get('name') as string,
            description: formData.get('description') as string || '',
            targetAmount: parseFloat(formData.get('targetAmount') as string),
            currentAmount: parseFloat(formData.get('currentAmount') as string) || 0,
            startDate: formData.get('startDate') as string,
            targetDate: formData.get('targetDate') as string,
            status: 'in-progress',
            priority: formData.get('priority') as string
        };

        setGoals([...goals, newGoal]);
        setIsAddGoalOpen(false);
    };

    const handleAddContribution = (goalId: number, amount: number) => {
        setGoals(goals.map(goal => {
            if (goal.id === goalId) {
                const newAmount = goal.currentAmount + amount;
                return {
                    ...goal,
                    currentAmount: newAmount,
                    status: newAmount >= goal.targetAmount ? 'completed' : goal.status
                };
            }
            return goal;
        }));
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Savings Goals</h1>
                        <p className="text-muted-foreground">Track your financial goals and progress</p>
                    </div>
                    <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center space-x-2">
                                <Plus className="h-4 w-4" />
                                <span>Add Goal</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Savings Goal</DialogTitle>
                                <DialogDescription>
                                    Set a new financial goal to work towards
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddGoal} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Goal Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="e.g., Emergency Fund"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe your goal..."
                                        rows={2}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="targetAmount">Target Amount</Label>
                                        <Input
                                            id="targetAmount"
                                            name="targetAmount"
                                            type="number"
                                            step="0.01"
                                            placeholder="10000.00"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currentAmount">Current Amount</Label>
                                        <Input
                                            id="currentAmount"
                                            name="currentAmount"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
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
                                        <Label htmlFor="targetDate">Target Date</Label>
                                        <Input
                                            id="targetDate"
                                            name="targetDate"
                                            type="date"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select name="priority" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="w-full">Create Goal</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeGoals.length}</div>
                            <p className="text-xs text-muted-foreground">
                                In progress
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Target</CardTitle>
                            <PiggyBank className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalTargetAmount.toLocaleString()}{CURRENCY_SYMBOLS}</div>
                            <p className="text-xs text-muted-foreground">
                                Combined goal amount
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{totalCurrentAmount.toLocaleString()}{CURRENCY_SYMBOLS}</div>
                            <p className="text-xs text-muted-foreground">
                                {((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1)}% of goals
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Goals achieved
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Goals */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Active Goals</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeGoals.map((goal) => {
                            const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                            const remaining = goal.targetAmount - goal.currentAmount;
                            const daysRemaining = calculateDaysRemaining(goal.targetDate);

                            return (
                                <Card key={goal.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg">{goal.name}</CardTitle>
                                                <CardDescription>{goal.description}</CardDescription>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge className={getPriorityColor(goal.priority)}>
                                                    {goal.priority}
                                                </Badge>
                                                <div className="flex space-x-1">
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Progress: {goal.currentAmount.toLocaleString()}{CURRENCY_SYMBOLS}</span>
                                                <span>Target: {goal.targetAmount.toLocaleString()}{CURRENCY_SYMBOLS}</span>
                                            </div>
                                            <Progress value={percentage} className="h-3" />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{percentage.toFixed(1)}% complete</span>
                                                <span>{remaining.toLocaleString()}{CURRENCY_SYMBOLS} remaining</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                                                </span>
                                            </div>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm">Add Money</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Add Contribution</DialogTitle>
                                                        <DialogDescription>
                                                            Add money to your "{goal.name}" goal
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <form onSubmit={(e) => {
                                                        e.preventDefault();
                                                        const formData = new FormData(e.target as HTMLFormElement);
                                                        const amount = parseFloat(formData.get('amount') as string);
                                                        handleAddContribution(goal.id, amount);
                                                    }} className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="amount">Amount</Label>
                                                            <Input
                                                                id="amount"
                                                                name="amount"
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="100.00"
                                                                required
                                                            />
                                                        </div>
                                                        <Button type="submit" className="w-full">Add Contribution</Button>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Completed Goals */}
                {completedGoals.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Completed Goals</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {completedGoals.map((goal) => (
                                <Card key={goal.id} className="border-green-200 bg-green-50">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg flex items-center space-x-2">
                                                    <span>{goal.name}</span>
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                </CardTitle>
                                                <CardDescription>{goal.description}</CardDescription>
                                            </div>
                                            <Badge className={getStatusColor(goal.status)}>
                                                Completed
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <Progress value={100} className="h-3 [&>div]:bg-green-500" />
                                            <div className="flex justify-between text-sm">
                                                <span className="text-green-600 font-medium">
                                                    {goal.targetAmount.toLocaleString()}{CURRENCY_SYMBOLS} achieved!
                                                </span>
                                                <span className="text-muted-foreground">100% complete</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}