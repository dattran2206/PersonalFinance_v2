import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {CURRENCY_SYMBOLS} from '@/constants/currency';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Wallet,
    Plus,
    ArrowRightLeft,
    Edit,
    Trash2,
    CreditCard,
    PiggyBank,
    TrendingUp
} from 'lucide-react';

const mockWallets = [
    {
        id: 1,
        name: 'Main Checking',
        balance: 5420.50,
        type: 'Checking',
        icon: CreditCard,
        color: 'bg-blue-500'
    },
    {
        id: 2,
        name: 'Emergency Savings',
        balance: 12800.00,
        type: 'Savings',
        icon: PiggyBank,
        color: 'bg-green-500'
    },
    {
        id: 3,
        name: 'Investment Portfolio',
        balance: 8750.25,
        type: 'Investment',
        icon: TrendingUp,
        color: 'bg-purple-500'
    },
    {
        id: 4,
        name: 'Vacation Fund',
        balance: 2200.00,
        type: 'Savings',
        icon: PiggyBank,
        color: 'bg-orange-500'
    }
];

const mockTransfers = [
    { id: 1, from: 'Main Checking', to: 'Emergency Savings', amount: 500, date: '2024-01-15' },
    { id: 2, from: 'Main Checking', to: 'Vacation Fund', amount: 200, date: '2024-01-14' },
    { id: 3, from: 'Emergency Savings', to: 'Main Checking', amount: 300, date: '2024-01-12' }
];

export default function Wallets() {
    const [wallets, setWallets] = useState(mockWallets);
    const [transfers, setTransfers] = useState(mockTransfers);
    const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);

    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

    const handleAddWallet = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const newWallet = {
            id: wallets.length + 1,
            name: formData.get('name') as string,
            balance: parseFloat(formData.get('balance') as string) || 0,
            type: formData.get('type') as string,
            icon: CreditCard,
            color: 'bg-gray-500'
        };
        setWallets([...wallets, newWallet]);
        setIsAddWalletOpen(false);
    };

    const handleTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const amount = parseFloat(formData.get('amount') as string);
        const fromWalletId = parseInt(formData.get('fromWallet') as string);
        const toWalletId = parseInt(formData.get('toWallet') as string);

        // Update wallet balances
        setWallets(wallets.map(wallet => {
            if (wallet.id === fromWalletId) {
                return { ...wallet, balance: wallet.balance - amount };
            }
            if (wallet.id === toWalletId) {
                return { ...wallet, balance: wallet.balance + amount };
            }
            return wallet;
        }));

        // Add transfer record
        const fromWallet = wallets.find(w => w.id === fromWalletId);
        const toWallet = wallets.find(w => w.id === toWalletId);
        const newTransfer = {
            id: transfers.length + 1,
            from: fromWallet?.name || '',
            to: toWallet?.name || '',
            amount,
            date: new Date().toISOString().split('T')[0]
        };
        setTransfers([newTransfer, ...transfers]);
        setIsTransferOpen(false);
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Wallets</h1>
                        <p className="text-muted-foreground">Manage your accounts and balances</p>
                    </div>
                    <div className="flex space-x-2">
                        <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex items-center space-x-2">
                                    <ArrowRightLeft className="h-4 w-4" />
                                    <span>Transfer</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Transfer Money</DialogTitle>
                                    <DialogDescription>
                                        Move money between your wallets
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleTransfer} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fromWallet">From Wallet</Label>
                                            <Select name="fromWallet" required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select wallet" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {wallets.map((wallet) => (
                                                        <SelectItem key={wallet.id} value={wallet.id.toString()}>
                                                            {wallet.name} ({wallet.balance.toLocaleString()}{CURRENCY_SYMBOLS})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="toWallet">To Wallet</Label>
                                            <Select name="toWallet" required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select wallet" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {wallets.map((wallet) => (
                                                        <SelectItem key={wallet.id} value={wallet.id.toString()}>
                                                            {wallet.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
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
                                    <Button type="submit" className="w-full">Transfer Money</Button>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center space-x-2">
                                    <Plus className="h-4 w-4" />
                                    <span>Add Wallet</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Wallet</DialogTitle>
                                    <DialogDescription>
                                        Create a new wallet to track your money
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddWallet} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Wallet Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="e.g., Business Checking"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Wallet Type</Label>
                                        <Select name="type" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Checking">Checking</SelectItem>
                                                <SelectItem value="Savings">Savings</SelectItem>
                                                <SelectItem value="Investment">Investment</SelectItem>
                                                <SelectItem value="Cash">Cash</SelectItem>
                                                <SelectItem value="Credit">Credit Card</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="balance">Initial Balance</Label>
                                        <Input
                                            id="balance"
                                            name="balance"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">Create Wallet</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Summary Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Wallet className="h-5 w-5" />
                            <span>Total Balance</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-primary">
                            {totalBalance.toLocaleString()}{CURRENCY_SYMBOLS}
                        </div>
                        <p className="text-muted-foreground">Across {wallets.length} wallets</p>
                    </CardContent>
                </Card>

                <Tabs defaultValue="wallets" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="wallets">Wallets</TabsTrigger>
                        <TabsTrigger value="transfers">Transfer History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="wallets">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wallets.map((wallet) => {
                                const Icon = wallet.icon;
                                return (
                                    <Card key={wallet.id} className="relative">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-2 rounded-lg ${wallet.color} text-white`}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">{wallet.name}</CardTitle>
                                                        <Badge variant="secondary">{wallet.type}</Badge>
                                                    </div>
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
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="text-3xl font-bold">
                                                    {wallet.balance.toLocaleString()}{CURRENCY_SYMBOLS}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Available balance
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="transfers">
                        <Card>
                            <CardHeader>
                                <CardTitle>Transfer History</CardTitle>
                                <CardDescription>Recent money transfers between wallets</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {transfers.map((transfer) => (
                                        <div key={transfer.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                                    <ArrowRightLeft className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {transfer.from} → {transfer.to}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{transfer.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-lg font-semibold">
                                                {transfer.amount.toLocaleString()}{CURRENCY_SYMBOLS}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
}