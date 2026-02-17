import { WatchHistory } from '@/app/user/watch-history/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xem tiếp',
  description: 'Quản lý và xem lại lịch sử xem phim của bạn'
};

export default async function WatchHistoryPage() {
  return (
    <div className='grow'>
      <WatchHistory />
    </div>
  );
}
