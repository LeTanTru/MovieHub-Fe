import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ToastPortal from '@/components/toast-portal';
import { AppProvider, QueryProvider } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'MovieHub',
  description: 'A movie streaming platform built with Next.js and React.'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${inter.variable} ${inter.className} text-foreground antialiased transition-all duration-200 ease-linear`}
      >
        <QueryProvider>
          <AppProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
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
