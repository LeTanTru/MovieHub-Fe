import { MovieList } from '@/app/movie/(type)/single/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phim lẻ'
};

export default function MovieSinglePage() {
  return (
    <>
      <MovieList />
    </>
  );
}
