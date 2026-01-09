import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Cloud, Upload, Download, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { driveService } from '@/services/driveService';
import { backupService } from '@/services/backupService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function BackupSettings() {
    const { user, accessToken, setAccessToken } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [lastBackup, setLastBackup] = useState<string | null>(null);

    // Request Drive scope
    const driveLogin = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/drive.file',
        onSuccess: (codeResponse) => {
            setAccessToken(codeResponse.access_token);
            toast.success("Đã kết nối Google Drive!");
            checkBackupStatus(codeResponse.access_token);
        },
        onError: () => toast.error("Kết nối Drive thất bại"),
    });

    const checkBackupStatus = async (token: string) => {
        try {
            const file = await driveService.findFile(token, 'finance_backup.json');
            if (file) {
                setLastBackup(file.createdTime);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleBackup = async () => {
        if (!accessToken) return driveLogin();

        setIsLoading(true);
        try {
            const data = await backupService.exportData();
            const existingFile = await driveService.findFile(accessToken, 'finance_backup.json');
            await driveService.uploadFile(accessToken, data, 'finance_backup.json', existingFile?.id);

            toast.success("Sao lưu dữ liệu thành công!");
            await checkBackupStatus(accessToken);
        } catch (error) {
            console.error(error);
            toast.error("Sao lưu thất bại. Vui lòng thử lại.");
            // Token might be expired
            if ((error as any)?.status === 401) {
                driveLogin();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async () => {
        if (!accessToken) return driveLogin();

        if (!confirm("Cảnh báo: Hành động này sẽ ghi đè toàn bộ dữ liệu hiện tại bằng dữ liệu từ bản sao lưu. Bạn có chắc chắn không?")) {
            return;
        }

        setIsLoading(true);
        try {
            const file = await driveService.findFile(accessToken, 'finance_backup.json');
            if (!file) {
                toast.error("Không tìm thấy bản sao lưu nào trên Drive.");
                return;
            }

            const data = await driveService.downloadFile(accessToken, file.id);
            await backupService.importData(data);

            toast.success("Khôi phục dữ liệu thành công!");
            // Optionally reload to refresh data
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error(error);
            toast.error("Khôi phục thất bại.");
            if ((error as any)?.status === 401) {
                driveLogin();
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Case 1: Not logged in to App
    if (!user) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-gray-400" />
                        Đồng bộ Google Drive
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6 text-muted-foreground bg-gray-50 rounded-lg">
                        <p>Vui lòng đăng nhập tài khoản Google (ở góc trên bên phải) để sử dụng tính năng này.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-blue-500" />
                    Đồng bộ Google Drive
                </CardTitle>
                <CardDescription>
                    Sao lưu dữ liệu của bạn lên Google Drive để không bị mất dữ liệu khi đổi thiết bị.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!accessToken ? (
                    <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                        <p className="text-sm text-blue-700">
                            Bạn cần cấp quyền truy cập Google Drive để ứng dụng có thể lưu file backup.
                            <br />
                            Ứng dụng chỉ truy cập các file do chính nó tạo ra (an toàn tuyệt đối).
                        </p>
                        <Button onClick={() => driveLogin()} className="w-full bg-blue-600 hover:bg-blue-700">
                            <Cloud className="w-4 h-4 mr-2" />
                            Kết nối Google Drive
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <span className="text-sm font-medium">Trạng thái</span>
                            <span className="text-sm text-emerald-600 font-bold flex items-center gap-1">
                                <RefreshCw className="w-3 h-3" /> Đã kết nối Drive
                            </span>
                        </div>

                        {lastBackup && (
                            <div className="text-sm text-muted-foreground text-center">
                                Bản sao lưu cuối: {format(new Date(lastBackup), "PP pp", { locale: vi })}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={handleBackup}
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                Sao lưu ngay
                            </Button>
                            <Button
                                onClick={handleRestore}
                                disabled={isLoading}
                                variant="outline"
                                className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                                Khôi phục
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
