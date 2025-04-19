// app/layout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/utils/providers/theme';
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { AppProvider } from '@/context/AppContext';

import "./global.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <AppProvider>
            <AppRouterCacheProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </AppRouterCacheProvider>
          </AppProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
