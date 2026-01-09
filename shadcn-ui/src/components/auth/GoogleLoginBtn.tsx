import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

interface GoogleUser {
    name: string;
    email: string;
    picture: string;
}

export function GoogleLoginBtn() {
    const login = useAuthStore((state) => state.login);

    const handleSuccess = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            try {
                const decoded = jwtDecode<GoogleUser>(credentialResponse.credential);
                login(decoded, credentialResponse.credential);
                toast.success(`Chào mừng ${decoded.name}!`);
            } catch (error) {
                console.error("Login Failed:", error);
                toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
            }
        }
    };

    const handleError = () => {
        toast.error("Đăng nhập thất bại.");
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            auto_select
        />
    );
}
