import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ToastPortal from '@/components/toast-portal';
import { AppProvider, QueryProvider } from '@/components/providers';
import BodyLoad from '@/components/app/body-load';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    template: '%s | MovieHub',
    default: 'MovieHub'
  },
  description: 'Trang chủ MovieHub'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang='vi'>
      <body
        className={`${inter.variable} ${inter.className} text-foreground antialiased transition-all duration-200 ease-linear`}
      >
        <BodyLoad />
        <QueryProvider>
          <AppProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              {/* <WebVitals /> */}
              <NextTopLoader showSpinner={false} />
              <Suspense>{children}</Suspense>
            </ThemeProvider>
            <ToastPortal />
          </AppProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
