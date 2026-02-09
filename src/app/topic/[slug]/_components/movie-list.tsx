'use client';

import './topic-detail.css';
import { Activity } from '@/components/activity';
import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useQueryParams } from '@/hooks';
import { useCollectionQuery } from '@/queries';
import { useCollectionItemListQuery } from '@/queries/collection-item.query';
import { CollectionItemResType, MovieResType } from '@/types';
import { Pagination } from '@/components/pagination';

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

  const movieList: CollectionItemResType[] = movieListData?.data?.content || [];
  const totalPages = movieListData?.data?.totalPages || 0;
  const colors = JSON.parse(collection?.color || '[]');

  const gradientStyle = {
    background: `linear-gradient(to bottom, ${colors.join(', ')})`
  };

  return (
    <div className='max-989:mb-2.5 mb-5'>
      <div className='topic-detail-background' style={gradientStyle}></div>
      {collectionLoading ? (
        <Skeleton className='skeleton m-0 mb-6 h-10 w-50' />
      ) : (
        <h3 className='max-1600:text-2xl m-0 mb-6 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          Phim {collection?.name}
        </h3>
      )}
      {collectionItemListLoading ? (
        <MovieGridSkeleton />
      ) : movieList.length === 0 ? (
        <NoData />
      ) : (
        <MovieGrid movieList={[...movieList] as unknown as MovieResType[]} />
      )}
      <Activity visible={!!totalPages}>
        <Pagination totalPages={totalPages} />
      </Activity>
    </div>
  );
}
