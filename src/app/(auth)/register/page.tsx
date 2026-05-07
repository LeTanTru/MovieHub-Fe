import { RegisterForm } from '@/app/(auth)/register/_components';
import type { Metadata } from 'next';
import envConfig from '@/config';

export const metadata: Metadata = {
  title: 'Đăng ký',
  description:
    'Tạo tài khoản MovieHub để lưu phim yêu thích, bình luận và tham gia cộng đồng phim.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: [
    'đăng ký moviehub',
    'tạo tài khoản moviehub',
    'xem phim trực tuyến'
  ],
  alternates: {
    canonical: '/register'
  },
  openGraph: {
    title: 'Đăng ký | MovieHub',
    description: 'Tạo tài khoản MovieHub để trải nghiệm xem phim trực tuyến.',
    url: '/register',
    siteName: 'MovieHub',
    type: 'website',
    locale: 'vi_VN'
  },
  twitter: {
    card: 'summary',
    title: 'Đăng ký | MovieHub',
    description: 'Tạo tài khoản MovieHub để trải nghiệm xem phim trực tuyến.'
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function RegisterPage() {
  return (
    <div className='max-520:w-[95%] mx-auto flex w-full max-w-125 flex-col text-white'>
      <RegisterForm />
    </div>
  );
}
