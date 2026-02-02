import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ToastPortal from '@/components/toast-portal';
import { AppProvider, QueryProvider } from '@/components/providers';
import BodyLoad from '@/components/app/body-load';
import { PerformanceMonitor } from '@/components/performance-monitor';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: false
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
    <html suppressHydrationWarning lang='vi' data-scroll-behavior='smooth'>
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <BodyLoad />
        <QueryProvider>
          <AppProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='dark'
              enableSystem
              disableTransitionOnChange
            >
              {/* <WebVitals /> */}
              <NextTopLoader showSpinner={false} />
              <Suspense>{children}</Suspense>
              <PerformanceMonitor />
            </ThemeProvider>
            <ToastPortal />
          </AppProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
