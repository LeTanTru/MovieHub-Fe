'use client';

import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { useCollectionQuery } from '@/queries';
import { useCollectionItemListQuery } from '@/queries/collection-item.query';
import { CollectionItemResType } from '@/types';

export default function MovieList({ collectionId }: { collectionId: string }) {
  const { data: collectionData, isLoading: collectionLoading } =
    useCollectionQuery({ id: collectionId });
  const collection = collectionData?.data;
  const { data: movieListData, isLoading: collectionItemListLoading } =
    useCollectionItemListQuery({
      params: {
        collectionId
      }
    });

  const movieList: CollectionItemResType[] = movieListData?.data?.content || [];

  return (
    <div className='max-989:mb-2.5 mb-5'>
      <h3 className='max-1600:text-2xl m-0 mb-6 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
        {collection?.name}
      </h3>
      {collectionItemListLoading ? (
        <MovieGridSkeleton />
      ) : movieList.length === 0 ? (
        <NoData />
      ) : (
        <MovieGrid movieList={movieList} dir={'up'} />
      )}
    </div>
  );
}
