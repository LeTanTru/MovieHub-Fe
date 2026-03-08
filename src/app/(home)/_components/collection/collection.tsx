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
import { CollectionResType, CollectionSearchType } from '@/types';
import TopMovieList from './top-movie-list';
import MovieList from './movie-list';
import CinemaMovieList from './cinema-movie-list';
import LastestCountryMovieList from './latest-country-movie-list';
import AnimeMovieList from './anime-movie-list';
import ComingSoonList from './coming-soon-list';
import { cn } from '@/lib';

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

  return (
    <>
      {collectionList.map((collection) => {
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
          case STYLE_LATEST_BY_COUNTRY: {
            return (
              <LastestCountryMovieList
                collection={collection}
                key={collection.id}
              />
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
