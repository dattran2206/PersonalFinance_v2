import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';

import { seedDatabase } from './db/seed';

import { ThemeProvider } from "@/components/theme-provider"

// Initialize Database
import { GoogleOAuthProvider } from '@react-oauth/google';

// ...

seedDatabase().then(() => {
    createRoot(document.getElementById('root')!).render(
        <GoogleOAuthProvider clientId="723496647102-ukjev9qdes909ik7gdpp4vrfg1sesdcf.apps.googleusercontent.com">
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <App />
            </ThemeProvider>
        </GoogleOAuthProvider>
    );
});

