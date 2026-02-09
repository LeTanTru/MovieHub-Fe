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
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

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
  const favouriteList = useMemo(
    () => favouriteListData?.data?.content || [],
    [favouriteListData]
  );

  const movieList = useMemo(
    () => favouriteList.map((favourite) => favourite.movie).filter(Boolean),
    [favouriteList]
  );

  const personList = useMemo(
    () => favouriteList.map((favourite) => favourite.person).filter(Boolean),
    [favouriteList]
  );

  const totalPages = favouriteListData?.data?.totalPages || 0;

  const handleTabChange = (type: number) => {
    setActiveTab(type);
  };

  const handleDeleteFavourite = async (id: string) => {
    const favouriteId = favouriteList.find(
      (favourite) => favourite.movie?.id === id || favourite.person?.id === id
    )?.id;

    if (!favouriteId) {
      notify.error('Không tìm thấy mục yêu thích để xóa');
      return;
    }

    await deleteFavouriteMutate(favouriteId, {
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
    });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  return (
    <div className='grow p-10'>
      <div className='mb-8 flex flex-col items-start justify-between gap-4'>
        <h3 className='text-xl leading-normal font-semibold text-white'>
          Yêu thích
        </h3>
        <div className='flex flex-wrap gap-2' role='tablist'>
          {favouriteTabs.map((tab) => (
            <Button
              key={tab.key}
              className={cn(
                'min-w-25 cursor-pointer rounded-full px-4 py-2 text-center transition-all duration-200 ease-linear',
                {
                  'bg-white text-black hover:bg-white hover:text-black':
                    activeTab === tab.key,
                  'bg-gunmetal-blue text-white': activeTab !== tab.key
                }
              )}
              role='tab'
              onClick={() => handleTabChange(tab.key)}
              variant='ghost'
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <AnimatePresence mode='popLayout'>
          <motion.div
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
              {isLoading ? (
                <MovieGridSkeleton className='grid-cols-6' skeletonCount={12} />
              ) : movieList.length === 0 ? (
                <NoData
                  className='pt-20'
                  content='Bạn chưa có phim yêu thích nào'
                />
              ) : (
                <div className='grid w-full grow grid-cols-6 gap-6'>
                  {movieList.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onDelete={handleDeleteFavourite}
                    />
                  ))}
                </div>
              )}
            </Activity>
            <Activity visible={activeTab === FAVOURITE_TYPE_PERSON}>
              {isLoading ? (
                <PersonGridSkeleton
                  className='grid-cols-6'
                  skeletonCount={12}
                />
              ) : personList.length === 0 ? (
                <NoData
                  className='pt-20'
                  content='Bạn chưa có diễn viên yêu thích nào'
                />
              ) : (
                <div className='grid w-full grow grid-cols-6 gap-6'>
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
            </Activity>
          </motion.div>

          <Activity visible={!!totalPages}>
            <Pagination
              totalPages={totalPages}
              onPageChange={handlePageChange}
              page={page}
            />
          </Activity>
        </AnimatePresence>
      </div>
    </div>
  );
}
