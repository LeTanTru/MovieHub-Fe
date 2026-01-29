import { MovieList } from '@/app/movie/(type)/series/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phim bộ'
};

export default function MovieSeriesPage() {
  return (
    <>
      <MovieList />
    </>
  );
}
