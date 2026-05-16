import { Sidebar } from '@/app/user/_components';
import { NotificationList } from '@/app/user/notification/_components';
import { Container } from '@/components/layout';
import envConfig from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thông báo',
  description:
    'Xem và quản lý các thông báo về phim mới, bình luận và hoạt động cộng đồng trên MovieHub.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: ['thông báo moviehub', 'cập nhật phim mới', 'hoạt động cộng đồng'],
  alternates: {
    canonical: '/user/notification'
  },
  openGraph: {
    title: 'Thông báo | MovieHub',
    description:
      'Xem và quản lý các thông báo về phim mới, bình luận và hoạt động cộng đồng trên MovieHub.',
    url: '/user/notification',
    siteName: 'MovieHub',
    type: 'website',
    locale: 'vi_VN'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thông báo | MovieHub',
    description:
      'Xem và quản lý các thông báo về phim mới, bình luận và hoạt động cộng đồng trên MovieHub.'
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function NotificationPage() {
  return (
    <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
      <div className='max-1120:flex-col max-1360:gap-8 max-1120:gap-8 max-990:gap-6 relative z-3 mx-auto flex max-w-410 items-start justify-between gap-10 px-5'>
        <Sidebar />
        <div className='w-full grow'>
          <NotificationList />
        </div>
      </div>
    </Container>
  );
}
