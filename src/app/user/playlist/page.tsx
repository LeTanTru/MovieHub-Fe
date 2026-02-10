import { MovieList, Playlist } from '@/app/user/playlist/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách phát',
  description: 'Quản lý và xem các danh sách phát phim yêu thích của bạn'
};

export default function PlaylistPage() {
  return (
    <div className='grow'>
      <Playlist />
      <MovieList />
    </div>
  );
}
