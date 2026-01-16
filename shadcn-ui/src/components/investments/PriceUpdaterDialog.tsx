import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Investment } from '@/lib/types';
import { db } from '@/db/db';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/calculations';
import { RefreshCcw, Save } from 'lucide-react';
import { MoneyInput } from '@/components/ui/money-input';

interface PriceUpdaterDialogProps {
    investments: Investment[];
}

export function PriceUpdaterDialog({ investments }: PriceUpdaterDialogProps) {
    const [open, setOpen] = useState(false);
    const [updates, setUpdates] = useState<{ [key: string]: number }>({});
    const [originalPrices, setOriginalPrices] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        if (open) {
            const initialUpdates: { [key: string]: number } = {};
            const initialOriginals: { [key: string]: number } = {};
            investments.forEach(inv => {
                initialUpdates[inv.id as string] = inv.currentPrice;
                initialOriginals[inv.id as string] = inv.currentPrice;
            });
            setUpdates(initialUpdates);
            setOriginalPrices(initialOriginals);
        }
    }, [open, investments]);

    const handlePriceChange = (id: string, newPrice: number) => {
        setUpdates(prev => ({ ...prev, [id]: newPrice }));
    };

    const handleSave = async () => {
        try {
            const promises = Object.entries(updates).map(async ([id, newPrice]) => {
                // Only update if price changed
                if (newPrice !== originalPrices[id]) {
                    await db.investments.update(id, {
                        currentPrice: newPrice,
                        updatedAt: Date.now()
                    });
                }
            });

            await Promise.all(promises);
            toast.success('Đã cập nhật giá thị trường thành công!');
            setOpen(false);
        } catch (error) {
            console.error('Failed to update prices:', error);
            toast.error('Có lỗi xảy ra khi cập nhật giá');
        }
    };

    // Group by Type for better UI
    const groupedInvestments = investments.reduce((acc, inv) => {
        const type = inv.type;
        if (!acc[type]) acc[type] = [];
        acc[type].push(inv);
        return acc;
    }, {} as { [key: string]: Investment[] });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    <RefreshCcw className="w-4 h-4" />
                    Cập nhật thị trường
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Cập nhật giá thị trường (Swift Updater)</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden pr-1">
                    <ScrollArea className="h-[60vh] pr-4">
                        <div className="space-y-6">
                            {Object.entries(groupedInvestments).map(([type, invs]) => (
                                <div key={type} className="space-y-3">
                                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider bg-slate-50 p-2 rounded">
                                        {type.toUpperCase()}
                                    </h3>
                                    <div className="grid gap-4">
                                        {invs.map(inv => (
                                            <div key={inv.id} className="grid grid-cols-12 gap-4 items-center">
                                                <div className="col-span-5">
                                                    <div className="font-medium truncate" title={inv.name}>{inv.name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Mua: {formatCurrency(inv.purchasePrice)}
                                                    </div>
                                                </div>
                                                <div className="col-span-7 flex items-center gap-2">
                                                    {/* Old Price Display */}
                                                    <div className="text-xs text-gray-400 w-16 text-right hidden sm:block">
                                                        {formatCurrency(originalPrices[inv.id as string] || 0)}
                                                    </div>
                                                    {/* New Price Input */}
                                                    <div className="flex-1">
                                                        <MoneyInput
                                                            value={updates[inv.id as string] || 0}
                                                            onValueChange={(val) => handlePriceChange(inv.id as string, val)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                <div className="flex justify-end pt-4 border-t mt-2">
                    <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                        <Save className="w-4 h-4 mr-2" />
                        Lưu tất cả thay đổi
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
