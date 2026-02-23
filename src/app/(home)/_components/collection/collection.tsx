'use client';

import CollectionList from './collection-list';
import { useCollectionListQuery } from '@/queries';
import { useInView } from 'react-intersection-observer';

export default function Collection() {
  const { ref, inView } = useInView({
    rootMargin: '0px 0px 100px 0px'
  });
  const { data: collectionListData, isLoading } = useCollectionListQuery({
    enabled: inView
  });
  const collectionList = collectionListData?.data?.content || [];

  return (
    <div className='collection-wrapper' ref={ref}>
      {collectionList.map((collection) => (
        <CollectionList
          key={collection.id}
          collection={collection}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
