'use client';

import './collection.css';
import { VerticalBarLoading } from '@/components/loading';
import { useScrollLoadMore } from '@/hooks';
import {
  queryKeys,
  STYLE_LATEST_MOVIE_LIST,
  STYLE_MOVIE_CINEMA_LIST,
  STYLE_TOP_RANKING_LIST
} from '@/constants';
import { collectionApiRequest } from '@/api-requests';
import { CollectionResType, CollectionSearchType } from '@/types';
import LastestMovieList from './latest-movie-list';
import TopMovieList from './top-movie-list';
import MovieList from './movie-list';
import CinemaMovieList from './cinema-movie-list';

export default function Collection() {
  const loadMoreSize = 3;

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
      {collectionList.map((collection) => {
        const styleType = collection.styleType;

        switch (styleType) {
          case STYLE_TOP_RANKING_LIST: {
            return <TopMovieList collection={collection} key={collection.id} />;
          }
          case STYLE_LATEST_MOVIE_LIST: {
            return (
              <LastestMovieList collection={collection} key={collection.id} />
            );
          }
          case STYLE_MOVIE_CINEMA_LIST: {
            return (
              <CinemaMovieList collection={collection} key={collection.id} />
            );
          }
          default: {
            return <MovieList key={collection.id} collection={collection} />;
          }
        }
      })}
      <div
        ref={loadMoreRef}
        className='vertical-loading flex items-center justify-center pt-20'
      >
        {isLoading && <VerticalBarLoading />}
      </div>
    </>
  );
}
