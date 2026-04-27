'use client';

import MovieList from './movie-list';
import PersonList from './person-list';
import { Activity } from '@/components/activity';
import { Button } from '@/components/form';
import { Pagination } from '@/components/pagination';
import {
  FAVOURITE_TYPE_MOVIE,
  FAVOURITE_TYPE_PERSON,
  favouriteTabs
} from '@/constants';
import { cn } from '@/lib';
import { useDeleteFavouriteMutation, useFavouriteListQuery } from '@/queries';
import { notify } from '@/utils';
import { AnimatePresence, m } from 'framer-motion';
import { useState } from 'react';

export default function FavouriteList() {
  const [activeTab, setActiveTab] = useState(FAVOURITE_TYPE_MOVIE);
  const [page, setPage] = useState(1);

  const pageSize = 12;

  const {
    data: favouriteListData,
    refetch: getFavouriteList,
    isLoading
  } = useFavouriteListQuery({
    params: {
      type: activeTab,
      page: page - 1,
      size: pageSize
    },
    enabled: true
  });

  const { mutateAsync: deleteFavouriteMutate } = useDeleteFavouriteMutation();

  const favouriteList = favouriteListData?.data?.content || [];

  const movieList = favouriteList
    .map((favourite) => favourite.movie)
    .filter(Boolean);

  const personList = favouriteList
    .map((favourite) => favourite.person)
    .filter(Boolean);

  const totalPages = favouriteListData?.data?.totalPages || 0;

  const handleTabChange = (type: number) => {
    setActiveTab(type);
    setPage(1);
  };

  const handleDeleteFavourite = async (targetId: string) => {
    await deleteFavouriteMutate(
      { targetId, type: activeTab },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success(
              `Xóa ${activeTab === FAVOURITE_TYPE_MOVIE ? 'phim' : 'diễn viên'} khỏi danh sách yêu thích thành công`
            );
            getFavouriteList();
          } else {
            notify.error(
              `Xóa ${activeTab === FAVOURITE_TYPE_MOVIE ? 'phim' : 'diễn viên'} khỏi danh sách yêu thích thất bại`
            );
          }
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
        {favouriteTabs.map((tab) => (
          <Button
            key={tab.key}
            className={cn(
              'min-w-25 cursor-pointer rounded-full px-4 py-2 text-center transition-all duration-200 ease-linear hover:bg-white hover:text-black',
              {
                'bg-white text-black': activeTab === tab.key,
                'bg-white/5 text-white': activeTab !== tab.key
              }
            )}
            role='tab'
            id={`favourite-tab-${tab.key}`}
            aria-controls={`favourite-tabpanel-${tab.key}`}
            aria-selected={activeTab === tab.key}
            tabIndex={activeTab === tab.key ? 0 : -1}
            onClick={() => handleTabChange(tab.key)}
            variant='ghost'
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <AnimatePresence mode='popLayout'>
        <m.div
          key={activeTab}
          initial={{
            opacity: 0.5
          }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0.5
          }}
          transition={{ duration: 0.1, ease: 'linear' }}
          className='block w-full'
        >
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
        </m.div>

        <Activity visible={!!totalPages}>
          <Pagination
            totalPages={totalPages}
            onChange={handlePageChange}
            page={page}
          />
        </Activity>
      </AnimatePresence>
    </div>
  );
}
