'use client';

import './collection.css';
import { VerticalBarLoading } from '@/components/loading';
import { useLoadMore } from '@/hooks';
import {
  queryKeys,
  STYLE_ANIME,
  STYLE_CINEMA,
  STYLE_COMING_SOON,
  STYLE_LATEST_BY_COUNTRY,
  STYLE_TOP_RANKING
} from '@/constants';
import { collectionApiRequest } from '@/api-requests';
import {
  CollectionCountryGroupType,
  CollectionResType,
  CollectionSearchType
} from '@/types';
import TopMovieList from './top-movie-list';
import MovieList from './movie-list';
import CinemaMovieList from './cinema-movie-list';
import LastestCountryMovieList from './latest-country-movie-list';
import AnimeMovieList from './anime-movie-list';
import ComingSoonList from './coming-soon-list';
import { cn } from '@/lib';

type ProcessedItem = CollectionResType | CollectionCountryGroupType;

function isCountryGroup(
  item: ProcessedItem
): item is CollectionCountryGroupType {
  return 'groupKey' in item;
}

/**
 * Groups consecutive STYLE_LATEST_BY_COUNTRY collections into groups of 3
 */
function groupCollections(collections: CollectionResType[]): ProcessedItem[] {
  const result: ProcessedItem[] = [];
  let i = 0;

  while (i < collections.length) {
    const current = collections[i];

    // If current is STYLE_LATEST_BY_COUNTRY, try to group with next 2
    if (current.styleType === STYLE_LATEST_BY_COUNTRY) {
      const group: CollectionResType[] = [current];
      let j = i + 1;

      // Collect up to 3 consecutive STYLE_LATEST_BY_COUNTRY items
      while (
        j < collections.length &&
        collections[j].styleType === STYLE_LATEST_BY_COUNTRY &&
        group.length < 3
      ) {
        group.push(collections[j]);
        j++;
      }

      // If we have more than 1 item, create a group
      if (group.length > 1) {
        result.push({
          groupKey: `country-group-${group.map((c) => c.id).join('-')}`,
          collections: group
        });
        i = j; // Move index past the grouped items
      } else {
        // Single item, add as is
        result.push(current);
        i++;
      }
    } else {
      // Not a STYLE_LATEST_BY_COUNTRY, add as is
      result.push(current);
      i++;
    }
  }

  return result;
}

export default function Collection() {
  const loadMoreSize = 3;

  const {
    data: collectionList,
    isLoading,
    loadMoreRef,
    isFetchingNextPage
  } = useLoadMore<HTMLDivElement, CollectionSearchType, CollectionResType>({
    queryKey: queryKeys.COLLECTION_LIST,
    params: { size: loadMoreSize },
    queryFn: collectionApiRequest.getList,
    enabled: true
  });

  const processedItems = groupCollections(collectionList);

  return (
    <>
      {processedItems.map((item) => {
        if (isCountryGroup(item)) {
          return (
            <LastestCountryMovieList
              collectionList={item.collections}
              key={item.groupKey}
            />
          );
        }

        const collection = item;
        const styleType = collection.styleType;

        if (!collection.movies || collection?.movies?.length === 0) return null;

        switch (styleType) {
          case STYLE_TOP_RANKING: {
            return <TopMovieList collection={collection} key={collection.id} />;
          }
          case STYLE_CINEMA: {
            return (
              <CinemaMovieList collection={collection} key={collection.id} />
            );
          }
          case STYLE_COMING_SOON: {
            return (
              <ComingSoonList key={collection.id} collection={collection} />
            );
          }
          case STYLE_ANIME: {
            return (
              <AnimeMovieList collection={collection} key={collection.id} />
            );
          }
          default: {
            return <MovieList key={collection.id} collection={collection} />;
          }
        }
      })}
      <div
        ref={loadMoreRef}
        className={cn('vertical-loading flex items-center justify-center', {
          'pt-20': isLoading || isFetchingNextPage
        })}
      >
        {(isLoading || isFetchingNextPage) && <VerticalBarLoading />}
      </div>
    </>
  );
}
