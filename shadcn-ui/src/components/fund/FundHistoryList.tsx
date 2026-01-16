import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/calculations';
import { getFundHistory } from '@/lib/fundHistoryHelpers';
import { useAccounts } from '@/hooks/use-db';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import type { FundHistory } from '@/db/db';

interface FundHistoryListProps {
    fundId: string;
}

export function FundHistoryList({ fundId }: FundHistoryListProps) {
    const [history, setHistory] = useState<FundHistory[]>([]);
    const accounts = useAccounts() || [];

    useEffect(() => {
        loadHistory();
    }, [fundId]);

    const loadHistory = async () => {
        const data = await getFundHistory(fundId);
        setHistory(data);
    };

    return (
        <div className="space-y-2">
            {history.map(record => (
                <Card key={record.id}>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    {record.type === 'deposit' ? (
                                        <ArrowDownCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <ArrowUpCircle className="w-4 h-4 text-blue-600" />
                                    )}
                                    <span className="font-semibold">
                                        {record.type === 'deposit' ? 'Nạp tiền' : 'Rút tiền'}
                                    </span>
                                </div>

                                {record.note && (
                                    <p className="text-sm text-gray-600 mt-1">{record.note}</p>
                                )}

                                {record.sourceAccountId && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Từ: {accounts.find(a => a.id === record.sourceAccountId)?.name}
                                    </p>
                                )}

                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(record.date).toLocaleDateString('vi-VN')}
                                </p>
                            </div>

                            <div className="text-right">
                                <div
                                    className={`font-semibold ${record.type === 'deposit' ? 'text-green-600' : 'text-blue-600'
                                        }`}
                                >
                                    {record.type === 'deposit' ? '+' : '-'}
                                    {formatCurrency(record.amount)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {history.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    Chưa có lịch sử giao dịch
                </div>
            )}
        </div>
    );
}
