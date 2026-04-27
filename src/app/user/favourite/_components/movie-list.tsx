import { MovieCard } from '@/components/app/movie-card';
import { MovieGrid } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { FAVOURITE_TYPE_MOVIE } from '@/constants';
import { MovieResType } from '@/types';

type MovieListProps = {
  isLoading: boolean;
  movieList: MovieResType[];
  handleDeleteFavourite: (targetId: string) => void;
};

export default function MovieList({
  isLoading,
  movieList,
  handleDeleteFavourite
}: MovieListProps) {
  return (
    <div
      role='tabpanel'
      id={`favourite-tabpanel-${FAVOURITE_TYPE_MOVIE}`}
      aria-labelledby={`favourite-tab-${FAVOURITE_TYPE_MOVIE}`}
    >
      {isLoading ? (
        <MovieGrid.Skeleton
          className='max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-1600:gap-4 max-480:gap-y-4 max-640:gap-y-6 grid w-full grow grid-cols-6 gap-6'
          skeletonCount={12}
        />
      ) : movieList.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={
            <>
              Bạn chưa có phim yêu thích nào
              <br />
              Hãy tìm kiếm và thêm phim yêu thích nhé 😊
            </>
          }
        />
      ) : (
        <div className='max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-1600:gap-4 max-480:gap-y-4 max-640:gap-y-6 grid w-full grow grid-cols-6 gap-6'>
          {movieList.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onDelete={handleDeleteFavourite}
              dir='down'
            />
          ))}
        </div>
      )}
    </div>
  );
}
