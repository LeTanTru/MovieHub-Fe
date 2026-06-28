'use client';

import { MovieList } from './movie-list';
import { PersonList } from './person-list';
import { Activity } from '@/components/activity';
import { Pagination } from '@/components/pagination';
import {
  FAVOURITE_TYPE_MOVIE,
  FAVOURITE_TYPE_PERSON,
  favouriteTabs,
  queryKeys
} from '@/constants';
import { useDeleteFavouriteMutation, useFavouriteListQuery } from '@/queries';
import { invalidateQueries, notify } from '@/utils';
import { useState } from 'react';
import { useAuth } from '@/hooks';
import { logger } from '@/logger';
import { ButtonAction } from '@/components/app/button-action';

export function FavouriteList() {
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState(FAVOURITE_TYPE_MOVIE);
  const [page, setPage] = useState(1);

  const pageSize = 12;

  const { data: favouriteListData, isLoading } = useFavouriteListQuery({
    params: {
      type: activeTab,
      page: page - 1,
      size: pageSize
    },
    enabled: isAuthenticated
  });

  const { mutate: deleteFavourite } = useDeleteFavouriteMutation();

  const favouriteList = favouriteListData?.content || [];

  const movieList = favouriteList.flatMap((favourite) =>
    favourite.movie ? [favourite.movie] : []
  );

  const personList = favouriteList.flatMap((favourite) =>
    favourite.person ? [favourite.person] : []
  );

  const totalPages = favouriteListData?.totalPages || 0;

  const handleTabChange = (type: string) => {
    setActiveTab(Number(type));
    setPage(1);
  };

  const handleDeleteFavourite = (targetId: string) => {
    if (!isAuthenticated) return;

    deleteFavourite(
      { targetId, type: activeTab },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success(
              `Xóa ${activeTab === FAVOURITE_TYPE_MOVIE ? 'phim' : 'diễn viên'} khỏi danh sách yêu thích thành công`
            );
            invalidateQueries(
              [queryKeys.FAVOURITE_LIST],
              [queryKeys.FAVOURITE_GET_LIST_IDS],
              [queryKeys.FAVOURITE, { targetId, type: activeTab }]
            );
          } else {
            notify.error(
              `Xóa ${activeTab === FAVOURITE_TYPE_MOVIE ? 'phim' : 'diễn viên'} khỏi danh sách yêu thích thất bại`
            );
          }
        },
        onError: (error) => {
          logger.error('[DELETE_FAVOURITE_ERROR]', error);
          notify.error(
            `Xóa ${activeTab === FAVOURITE_TYPE_MOVIE ? 'phim' : 'diễn viên'} khỏi danh sách yêu thích thất bại`
          );
        }
      }
    );
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <div className='mb-8 flex flex-col items-start justify-between gap-4'>
      <h3 className='max-640:text-base text-xl leading-normal font-semibold text-white'>
        Yêu thích
      </h3>
      <div className='flex flex-wrap gap-2' role='tablist'>
        <div className='relative flex shrink-0 items-stretch'>
          {favouriteTabs.map((action) => (
            <ButtonAction
              key={action.value}
              label={action.label}
              action={String(action.value)}
              activeTab={String(activeTab)}
              setActiveTab={handleTabChange}
              className='max-640:text-[13px] max-480:text-xs max-640:py-1 max-640:px-1.5'
            />
          ))}
        </div>
      </div>
      <div className='block w-full' key={activeTab}>
        <Activity visible={activeTab === FAVOURITE_TYPE_MOVIE}>
          <MovieList
            isLoading={isLoading}
            movieList={movieList}
            handleDeleteFavourite={handleDeleteFavourite}
          />
        </Activity>
        <Activity visible={activeTab === FAVOURITE_TYPE_PERSON}>
          <PersonList
            isLoading={isLoading}
            personList={personList}
            handleDeleteFavourite={handleDeleteFavourite}
          />
        </Activity>
      </div>

      {!!totalPages && (
        <Pagination
          totalPages={totalPages}
          onChange={handlePageChange}
          page={page}
        />
      )}
    </div>
  );
}
