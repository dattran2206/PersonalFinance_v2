import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    name: string;
    email: string;
    picture: string;
}

interface AuthState {
    user: User | null;
    token: string | null; // ID Token
    accessToken: string | null; // Google Drive Access Token
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            accessToken: null,
            isAuthenticated: false,
            login: (user, token) => set({ user, token, isAuthenticated: true }),
            setAccessToken: (accessToken) => set({ accessToken }),
            logout: () => set({ user: null, token: null, accessToken: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
