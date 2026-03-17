'use client';

import './topic-detail.css';
import { Activity } from '@/components/activity';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { getColorList } from '@/utils';
import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { MovieResType } from '@/types';
import { NoData } from '@/components/no-data';
import { Pagination } from '@/components/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollectionItemListQuery, useCollectionQuery } from '@/queries';
import { useQueryParams } from '@/hooks';
import NotFound from './not-found';

export default function MovieList({ collectionId }: { collectionId: string }) {
  const {
    searchParams: { page }
  } = useQueryParams<{ page: string }>();

  const { data: collectionData, isLoading: collectionLoading } =
    useCollectionQuery(collectionId);

  const collection = collectionData?.data;

  const { data: movieListData, isLoading: collectionItemListLoading } =
    useCollectionItemListQuery({
      params: {
        page: page ? Number(page) - 1 : 0,
        collectionId,
        size: DEFAULT_PAGE_SIZE
      }
    });

  const movieList = movieListData?.data?.content || [];
  const totalPages = movieListData?.data?.totalPages || 0;
  const colors = getColorList(collection?.color || '[]');

  const getGradientStyle = (dir: string = 'to bottom') =>
    `linear-gradient(${dir}, ${colors.join(', ')})`;

  if (!collection) {
    return <NotFound />;
  }

  return (
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      <div
        className='topic-detail-background'
        style={{ backgroundImage: getGradientStyle() }}
      ></div>
      <div className='max-1120:mb-5 max-990:mb-4 mb-6'>
        {collectionLoading ? (
          <Skeleton className='skeleton max-640:mb-4 max-480:mb-2 max-640:h-8 mb-6 h-10 w-50' />
        ) : (
          <h3
            className='max-990:text-2xl max-640:text-[22px] max-480:text-xl bg-clip-text text-[28px] leading-[1.4] font-semibold text-transparent text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'
            style={{
              backgroundImage: getGradientStyle('to right')
            }}
          >
            {collection?.name}
          </h3>
        )}
      </div>

      {collectionItemListLoading ? (
        <MovieGridSkeleton className='max-1600:gap-4 max-1360:grid-cols-6 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-640:gap-x-2 max-640:gap-y-4' />
      ) : movieList.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={
            <>
              Không có phim nào trong chủ đề&nbsp;
              <span className='font-semibold'>{collection?.name}</span>
            </>
          }
        />
      ) : (
        <MovieGrid
          className='max-1600:gap-4 max-1360:grid-cols-6 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-640:gap-x-2 max-640:gap-y-4'
          movieList={[...movieList] as unknown as MovieResType[]}
        />
      )}
      <Activity visible={!!totalPages}>
        <Pagination totalPages={totalPages} />
      </Activity>
    </div>
  );
}
