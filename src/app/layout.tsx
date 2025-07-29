import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastContainer } from 'react-toastify';
import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/header';
import { AppProvider, QueryProvider } from '@/app/providers';

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
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <AppProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <NextTopLoader showSpinner={false} />
              <Suspense>{children}</Suspense>
            </QueryProvider>
          </ThemeProvider>
        </AppProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
