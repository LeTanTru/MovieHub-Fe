import { LoginForm } from '@/app/(auth)/login/_components';
import type { Metadata } from 'next';
import envConfig from '@/config';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description:
    'Đăng nhập vào MovieHub để trải nghiệm xem phim trực tuyến với kho phim đa dạng và cập nhật nhanh chóng.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: ['đăng nhập moviehub', 'xem phim trực tuyến', 'moviehub'],
  alternates: {
    canonical: '/login'
  },
  openGraph: {
    title: 'Đăng nhập | MovieHub',
    description: 'Đăng nhập vào MovieHub để trải nghiệm xem phim trực tuyến.',
    url: '/login',
    siteName: 'MovieHub',
    type: 'website',
    locale: 'vi_VN'
  },
  twitter: {
    card: 'summary',
    title: 'Đăng nhập | MovieHub',
    description: 'Đăng nhập vào MovieHub để trải nghiệm xem phim trực tuyến.'
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function LoginPage() {
  return (
    <div className='max-520:w-[95%] mx-auto flex w-full max-w-125 flex-col text-white'>
      <LoginForm />
    </div>
  );
}
