import './globals.css';
import { Be_Vietnam_Pro } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import envConfig from '@/config';
import { PerformanceMonitor } from '@/components/performance-monitor';
import { BodyLoad } from '@/components/app/body-load';
import { ToastContainer } from 'react-toastify';
import { QueryProvider } from '@/components/providers/query-provider';
import { AppProvider } from '@/components/providers/app-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { GoToTopButton } from '@/components/app/go-to-top-button';
import { JsonLd } from '@/components/seo/json-ld';

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
    default: 'MovieHub - Xem phim trực tuyến miễn phí'
  },
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  description:
    'Xem phim trực tuyến miễn phí tại MovieHub với kho phim đa dạng, cập nhật mỗi ngày và trải nghiệm mượt mà trên mọi thiết bị.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'MovieHub - Xem phim trực tuyến miễn phí',
    description:
      'Khám phá kho phim đa dạng, cập nhật mỗi ngày và xem phim chất lượng cao tại MovieHub.',
    url: '/',
    siteName: 'MovieHub',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/logo.webp',
        width: 1200,
        height: 630,
        alt: 'MovieHub'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MovieHub - Xem phim trực tuyến miễn phí',
    description:
      'Khám phá kho phim đa dạng, cập nhật mỗi ngày và xem phim chất lượng cao tại MovieHub.',
    images: ['/logo.webp']
  }
};

type RootLayoutProps = { children: React.ReactNode };

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MovieHub',
  url: envConfig.NEXT_PUBLIC_URL,
  logo: `${envConfig.NEXT_PUBLIC_URL}/logo.webp`
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: envConfig.NEXT_PUBLIC_URL,
  name: 'MovieHub',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${envConfig.NEXT_PUBLIC_URL}/search?keyword={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning lang='vi' data-scroll-behavior='smooth'>
      <body
        suppressHydrationWarning
        className={`${beVietnamPro.variable} ${beVietnamPro.className} antialiased`}
      >
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
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
              <GoToTopButton />
              <PerformanceMonitor />
            </ThemeProvider>
            <ToastContainer />
          </AppProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
