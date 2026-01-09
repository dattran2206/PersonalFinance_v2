import Layout from '@/components/layout/Layout';
import { BackupSettings } from '@/components/settings/BackupSettings';

const Settings = () => {
    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 font-display">
                        Cài đặt
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Quản lý cấu hình ứng dụng và dữ liệu cá nhân.
                    </p>
                </div>

                <div className="space-y-6">
                    <BackupSettings />

                    {/* Placeholder for future settings */}
                    {/* <Card>
              <CardHeader>
                  <CardTitle>Giao diện</CardTitle>
              </CardHeader>
              <CardContent>...</CardContent>
          </Card> */}
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
