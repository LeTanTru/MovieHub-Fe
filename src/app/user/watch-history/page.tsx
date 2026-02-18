import { Sidebar } from '@/app/user/_components';
import { WatchHistory } from '@/app/user/watch-history/_components';
import { Container } from '@/components/layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xem tiếp',
  description: 'Quản lý và xem lại lịch sử xem phim của bạn'
};

export default async function WatchHistoryPage() {
  return (
    <Container className='min-h-[calc(100dvh-400px)] py-40'>
      <div className='relative z-3 mx-auto flex max-w-410 items-start justify-between gap-10 px-5'>
        <Sidebar />
        <div className='grow'>
          <WatchHistory />
        </div>
      </div>
    </Container>
  );
}
