'use client';

import { VerticalBarLoading } from '@/components/loading';
import MovieList from './movie-list';
import { useScrollLoadMore } from '@/hooks';
import { DEFAULT_PAGE_SIZE, queryKeys } from '@/constants';
import { collectionApiRequest } from '@/api-requests';
import { CollectionResType, CollectionSearchType } from '@/types';

export default function Collection() {
  const loadMoreSize = DEFAULT_PAGE_SIZE;

  const {
    data: collectionList,
    isLoading,
    loadMoreRef
  } = useScrollLoadMore<
    HTMLDivElement,
    CollectionSearchType,
    CollectionResType
  >({
    queryKey: queryKeys.COLLECTION_LIST,
    params: { size: loadMoreSize },
    queryFn: collectionApiRequest.getList,
    enabled: true
  });

  return (
    <>
      {collectionList.map((collection) => (
        <MovieList
          key={collection.id}
          collection={collection}
          isLoading={isLoading}
        />
      ))}
      <div ref={loadMoreRef} className='flex items-center justify-center'>
        {isLoading && <VerticalBarLoading />}
      </div>
    </>
  );
}
