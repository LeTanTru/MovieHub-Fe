'use client';

import './topic-detail.css';
import { Activity } from '@/components/activity';
import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useQueryParams } from '@/hooks';
import { useCollectionItemListQuery, useCollectionQuery } from '@/queries';
import { Pagination } from '@/components/pagination';
import { MovieResType } from '@/types';
import { getColorList } from '@/utils';

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

  const gradientStyle = {
    background: `linear-gradient(to bottom, ${colors.join(', ')})`
  };

  return (
    <div className='mx-auto w-full max-w-475 px-12.5'>
      <div className='topic-detail-background' style={gradientStyle}></div>
      {collectionLoading ? (
        <Skeleton className='skeleton mb-6 h-10 w-50' />
      ) : (
        <h3 className='mb-6 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          {collection?.name}
        </h3>
      )}
      {collectionItemListLoading ? (
        <MovieGridSkeleton />
      ) : movieList.length === 0 ? (
        <NoData
          className='pt-25 pb-40'
          content={
            <>
              Không có phim nào trong chủ đề&nbsp;
              <span className='font-medium'>{collection?.name}</span>
            </>
          }
        />
      ) : (
        <MovieGrid movieList={[...movieList] as unknown as MovieResType[]} />
      )}
      <Activity visible={!!totalPages}>
        <Pagination totalPages={totalPages} />
      </Activity>
    </div>
  );
}
