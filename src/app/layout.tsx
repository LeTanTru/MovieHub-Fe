import './globals.css';
import { AppProvider } from '@/components/providers/app-provider';
import { Be_Vietnam_Pro } from 'next/font/google';
import { BodyLoad } from '@/components/app/body-load';
import { DisclaimerModal } from '@/components/modal';
import { GoToTopButton } from '@/components/app/go-to-top-button';
import { JsonLd } from '@/components/seo';
import { MqttProvider } from '@/components/providers/mqtt-provider';
import { PerformanceMonitor } from '@/components/performance-monitor';
import { QueryProvider } from '@/components/providers/query-provider';
import { Suspense } from 'react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastContainer } from 'react-toastify';
import envConfig from '@/config';
import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';

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
  description:
    'Xem phim trực tuyến miễn phí tại MovieHub với kho phim đa dạng, cập nhật mỗi ngày. Trải nghiệm xem phim chất lượng cao, tốc độ nhanh và mượt mà trên mọi thiết bị.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: [
    'xem phim',
    'phim trực tuyến',
    'phim miễn phí',
    'phim hay',
    'moviehub',
    'phim hd',
    'phim vietsub',
    'phim mới'
  ],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'MovieHub - Xem phim trực tuyến miễn phí',
    description:
      'Khám phá kho phim đa dạng, cập nhật mỗi ngày và xem phim chất lượng cao tại MovieHub. Trải nghiệm giải trí tuyệt vời hoàn toàn miễn phí.',
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
      'Khám phá kho phim đa dạng, cập nhật mỗi ngày và xem phim chất lượng cao tại MovieHub. Trải nghiệm giải trí tuyệt vời hoàn toàn miễn phí.',
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
    target: `${envConfig.NEXT_PUBLIC_URL}/search?keyword={search_term_string}`,
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
              <Suspense>{children}</Suspense>
              <DisclaimerModal />
              <MqttProvider />
              <NextTopLoader showSpinner={false} />
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
