import SuggestionItem from './suggestion-item';
import { MovieResType } from '@/types';

export default function SuggestionList({
  movieList
}: {
  movieList: MovieResType[];
}) {
  return (
    <div className='border-t border-solid border-white/10 pt-7.5'>
      <div className='relative block'>
        <div className='mb-4 flex min-h-10 items-center gap-4 text-xl font-semibold text-white'>
          Đề xuất cho bạn
        </div>
        <div className='flex flex-col gap-4'>
          {movieList.map((movie) => (
            <SuggestionItem key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
