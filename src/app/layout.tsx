import './globals.css';
import { Be_Vietnam_Pro } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import {
  AppProvider,
  QueryProvider,
  ThemeProvider
} from '@/components/providers';
import { PerformanceMonitor } from '@/components/performance-monitor';
import { BodyLoad } from '@/components/app/body-load';
import { ToastContainer } from 'react-toastify';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: {
    template: '%s | MovieHub',
    default: 'MovieHub'
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang='vi' data-scroll-behavior='smooth'>
      <body
        className={`${beVietnamPro.variable} ${beVietnamPro.className} antialiased`}
      >
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
            <ToastContainer />
          </AppProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
