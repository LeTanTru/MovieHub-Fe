'use client';

import { Activity } from '@/components/activity';
import { MovieCard } from '@/components/app/movie-card';
import { MovieGridSkeleton } from '@/components/app/movie-grid';
import { PersonCard } from '@/components/app/person-card';
import { PersonGridSkeleton } from '@/components/app/person-grid';
import { Button } from '@/components/form';
import { NoData } from '@/components/no-data';
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
    isLoading: favouriteListLoading
  } = useFavouriteListQuery({
    params: {
      type: activeTab,
      page: page - 1,
      size: pageSize
    },
    enabled: true
  });

  const { mutateAsync: deleteFavouriteMutate } = useDeleteFavouriteMutation();

  const isLoading = favouriteListLoading;
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
              'min-w-25 cursor-pointer rounded-full px-4 py-2 text-center transition-all duration-200 ease-linear dark:hover:bg-white dark:hover:text-black',
              {
                'dark:bg-white dark:text-black': activeTab === tab.key,
                'dark:bg-white/5 dark:text-white': activeTab !== tab.key
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
            <div
              role='tabpanel'
              id={`favourite-tabpanel-${FAVOURITE_TYPE_MOVIE}`}
              aria-labelledby={`favourite-tab-${FAVOURITE_TYPE_MOVIE}`}
            >
              {isLoading ? (
                <MovieGridSkeleton
                  className='max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-1600:gap-4 max-480:gap-y-4 max-640:gap-y-6 grid w-full grow grid-cols-6 gap-6'
                  skeletonCount={12}
                />
              ) : movieList.length === 0 ? (
                <NoData
                  className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
                  imageClassName='max-640:size-40 max-480:size-30'
                  content='Bạn chưa có phim yêu thích nào'
                />
              ) : (
                <div className='max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-1600:gap-4 max-480:gap-y-4 max-640:gap-y-6 grid w-full grow grid-cols-6 gap-6'>
                  {movieList.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onDelete={handleDeleteFavourite}
                      dir='down'
                    />
                  ))}
                </div>
              )}
            </div>
          </Activity>
          <Activity visible={activeTab === FAVOURITE_TYPE_PERSON}>
            <div
              role='tabpanel'
              id={`favourite-tabpanel-${FAVOURITE_TYPE_PERSON}`}
              aria-labelledby={`favourite-tab-${FAVOURITE_TYPE_PERSON}`}
            >
              {isLoading ? (
                <PersonGridSkeleton
                  className='max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-1600:gap-4 max-480:gap-y-4 max-640:gap-y-6 grid w-full grow grid-cols-6 gap-6'
                  skeletonCount={12}
                />
              ) : personList.length === 0 ? (
                <NoData
                  className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
                  imageClassName='max-640:size-40 max-480:size-30'
                  content='Bạn chưa có diễn viên yêu thích nào'
                />
              ) : (
                <div className='max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-1600:gap-4 max-480:gap-y-4 max-640:gap-y-6 grid w-full grow grid-cols-6 gap-6'>
                  {personList.map((person) => (
                    <PersonCard
                      person={person}
                      key={person.id}
                      willNavigate
                      onDelete={handleDeleteFavourite}
                    />
                  ))}
                </div>
              )}
            </div>
          </Activity>
        </m.div>

        <Activity visible={!!totalPages}>
          <Pagination
            totalPages={totalPages}
            onPageChange={handlePageChange}
            page={page}
          />
        </Activity>
      </AnimatePresence>
    </div>
  );
}
