import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {CURRENCY_SYMBOLS} from '@/constants/currency';
import {
    Plus,
    CreditCard,
    UserMinus,
    UserPlus,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Edit,
    Trash2,
    DollarSign
} from 'lucide-react';

const mockDebts = [
    {
        id: 1,
        type: 'borrowed',
        creditorDebtor: 'John Smith',
        amount: 1500.00,
        originalAmount: 2000.00,
        description: 'Emergency loan for car repair',
        startDate: '2023-12-01',
        dueDate: '2024-02-01',
        status: 'pending',
        interestRate: 0,
        priority: 'high'
    },
    {
        id: 2,
        type: 'lent',
        creditorDebtor: 'Sarah Johnson',
        amount: 800.00,
        originalAmount: 800.00,
        description: 'Vacation advance',
        startDate: '2024-01-10',
        dueDate: '2024-03-10',
        status: 'pending',
        interestRate: 0,
        priority: 'medium'
    },
    {
        id: 3,
        type: 'borrowed',
        creditorDebtor: 'Credit Card - Chase',
        amount: 3200.00,
        originalAmount: 5000.00,
        description: 'Credit card debt',
        startDate: '2023-06-01',
        dueDate: '2024-06-01',
        status: 'pending',
        interestRate: 18.5,
        priority: 'high'
    },
    {
        id: 4,
        type: 'lent',
        creditorDebtor: 'Mike Wilson',
        amount: 500.00,
        originalAmount: 500.00,
        description: 'Business startup loan',
        startDate: '2023-11-15',
        dueDate: '2024-01-15',
        status: 'paid',
        interestRate: 0,
        priority: 'low'
    }
];

export default function Debts() {
    const [debts, setDebts] = useState(mockDebts);
    const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);

    const pendingDebts = debts.filter(debt => debt.status === 'pending');
    const paidDebts = debts.filter(debt => debt.status === 'paid');
    const borrowedDebts = pendingDebts.filter(debt => debt.type === 'borrowed');
    const lentDebts = pendingDebts.filter(debt => debt.type === 'lent');

    const totalBorrowed = borrowedDebts.reduce((sum, debt) => sum + debt.amount, 0);
    const totalLent = lentDebts.reduce((sum, debt) => sum + debt.amount, 0);
    const netPosition = totalLent - totalBorrowed;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'paid': return 'bg-green-100 text-green-800';
            case 'overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
    };

    const calculateDaysUntilDue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleAddDebt = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const newDebt = {
            id: debts.length + 1,
            type: formData.get('type') as string,
            creditorDebtor: formData.get('creditorDebtor') as string,
            amount: parseFloat(formData.get('amount') as string),
            originalAmount: parseFloat(formData.get('amount') as string),
            description: formData.get('description') as string || '',
            startDate: formData.get('startDate') as string,
            dueDate: formData.get('dueDate') as string,
            status: 'pending',
            interestRate: parseFloat(formData.get('interestRate') as string) || 0,
            priority: formData.get('priority') as string
        };

        setDebts([...debts, newDebt]);
        setIsAddDebtOpen(false);
    };

    const handleMarkAsPaid = (debtId: number) => {
        setDebts(debts.map(debt =>
            debt.id === debtId ? { ...debt, status: 'paid' } : debt
        ));
    };

    const handleMakePayment = (debtId: number, paymentAmount: number) => {
        setDebts(debts.map(debt => {
            if (debt.id === debtId) {
                const newAmount = debt.amount - paymentAmount;
                return {
                    ...debt,
                    amount: Math.max(0, newAmount),
                    status: newAmount <= 0 ? 'paid' : debt.status
                };
            }
            return debt;
        }));
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Debts & Loans</h1>
                        <p className="text-muted-foreground">Track money you owe and money owed to you</p>
                    </div>
                    <Dialog open={isAddDebtOpen} onOpenChange={setIsAddDebtOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center space-x-2">
                                <Plus className="h-4 w-4" />
                                <span>Add Debt/Loan</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Debt or Loan</DialogTitle>
                                <DialogDescription>
                                    Record money you've borrowed or lent
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddDebt} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select name="type" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="borrowed">Money I Borrowed</SelectItem>
                                            <SelectItem value="lent">Money I Lent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="creditorDebtor">Creditor/Debtor</Label>
                                    <Input
                                        id="creditorDebtor"
                                        name="creditorDebtor"
                                        placeholder="e.g., John Smith, Chase Bank"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount</Label>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            step="0.01"
                                            placeholder="1000.00"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="interestRate">Interest Rate (%)</Label>
                                        <Input
                                            id="interestRate"
                                            name="interestRate"
                                            type="number"
                                            step="0.1"
                                            placeholder="0.0"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="What is this debt/loan for?"
                                        rows={2}
                                    />
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
                                        <Label htmlFor="dueDate">Due Date</Label>
                                        <Input
                                            id="dueDate"
                                            name="dueDate"
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
                                <Button type="submit" className="w-full">Add Debt/Loan</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Money I Owe</CardTitle>
                            <UserMinus className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{totalBorrowed.toLocaleString()}{CURRENCY_SYMBOLS}</div>
                            <p className="text-xs text-muted-foreground">
                                {borrowedDebts.length} active debt{borrowedDebts.length !== 1 ? 's' : ''}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Money Owed to Me</CardTitle>
                            <UserPlus className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{totalLent.toLocaleString()}{CURRENCY_SYMBOLS}</div>
                            <p className="text-xs text-muted-foreground">
                                {lentDebts.length} active loan{lentDebts.length !== 1 ? 's' : ''}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Position</CardTitle>
                            <DollarSign className={`h-4 w-4 ${netPosition >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${netPosition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {netPosition >= 0 ? '+' : ''}{netPosition.toLocaleString()}{CURRENCY_SYMBOLS}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {netPosition >= 0 ? 'Net creditor' : 'Net debtor'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{paidDebts.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Paid off debts/loans
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="pending" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="pending">Active ({pendingDebts.length})</TabsTrigger>
                        <TabsTrigger value="completed">Completed ({paidDebts.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pendingDebts.map((debt) => {
                                const daysUntilDue = calculateDaysUntilDue(debt.dueDate);
                                const overdue = isOverdue(debt.dueDate);
                                const progress = ((debt.originalAmount - debt.amount) / debt.originalAmount) * 100;

                                return (
                                    <Card key={debt.id} className={overdue ? 'border-red-200' : ''}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <CardTitle className="flex items-center space-x-2">
                                                        {debt.type === 'borrowed' ?
                                                            <UserMinus className="h-5 w-5 text-red-600" /> :
                                                            <UserPlus className="h-5 w-5 text-green-600" />
                                                        }
                                                        <span>{debt.creditorDebtor}</span>
                                                    </CardTitle>
                                                    <CardDescription>{debt.description}</CardDescription>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge className={getPriorityColor(debt.priority)}>
                                                        {debt.priority}
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
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-2xl font-bold ${debt.type === 'borrowed' ? 'text-red-600' : 'text-green-600'
                                                        }`}>
                                                        {debt.amount.toLocaleString()}{CURRENCY_SYMBOLS}
                                                    </span>
                                                    {debt.interestRate > 0 && (
                                                        <Badge variant="outline">{debt.interestRate}% APR</Badge>
                                                    )}
                                                </div>

                                                {debt.originalAmount !== debt.amount && (
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm text-muted-foreground">
                                                            <span>Original: {debt.originalAmount.toLocaleString()}{CURRENCY_SYMBOLS}</span>
                                                            <span>{progress.toFixed(1)}% paid</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-green-600 h-2 rounded-full"
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t">
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <Calendar className="h-4 w-4" />
                                                    <span className={overdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                                                        {overdue ?
                                                            `Overdue by ${Math.abs(daysUntilDue)} days` :
                                                            `Due in ${daysUntilDue} days`
                                                        }
                                                    </span>
                                                    {overdue && <AlertTriangle className="h-4 w-4 text-red-600" />}
                                                </div>
                                                <div className="flex space-x-2">
                                                    {debt.type === 'borrowed' ? (
                                                        <>
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button size="sm" variant="outline">Pay</Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Make Payment</DialogTitle>
                                                                        <DialogDescription>
                                                                            Make a payment towards "{debt.creditorDebtor}"
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <form onSubmit={(e) => {
                                                                        e.preventDefault();
                                                                        const formData = new FormData(e.target as HTMLFormElement);
                                                                        const amount = parseFloat(formData.get('amount') as string);
                                                                        handleMakePayment(debt.id, amount);
                                                                    }} className="space-y-4">
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor="amount">Payment Amount</Label>
                                                                            <Input
                                                                                id="amount"
                                                                                name="amount"
                                                                                type="number"
                                                                                step="0.01"
                                                                                max={debt.amount}
                                                                                placeholder="100.00"
                                                                                required
                                                                            />
                                                                            <p className="text-xs text-muted-foreground">
                                                                                Remaining balance: {debt.amount.toLocaleString()}{CURRENCY_SYMBOLS}
                                                                            </p>
                                                                        </div>
                                                                        <Button type="submit" className="w-full">Make Payment</Button>
                                                                    </form>
                                                                </DialogContent>
                                                            </Dialog>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleMarkAsPaid(debt.id)}
                                                            >
                                                                Mark Paid
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleMarkAsPaid(debt.id)}
                                                        >
                                                            Mark Received
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="completed">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {paidDebts.map((debt) => (
                                <Card key={debt.id} className="border-green-200 bg-green-50">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="flex items-center space-x-2">
                                                    {debt.type === 'borrowed' ?
                                                        <UserMinus className="h-5 w-5 text-green-600" /> :
                                                        <UserPlus className="h-5 w-5 text-green-600" />
                                                    }
                                                    <span>{debt.creditorDebtor}</span>
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                </CardTitle>
                                                <CardDescription>{debt.description}</CardDescription>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800">
                                                Completed
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="text-2xl font-bold text-green-600">
                                                {debt.originalAmount.toLocaleString()}{CURRENCY_SYMBOLS}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {debt.type === 'borrowed' ? 'Fully repaid' : 'Fully received'}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
}