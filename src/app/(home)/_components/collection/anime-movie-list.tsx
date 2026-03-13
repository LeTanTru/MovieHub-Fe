'use client';

import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import './anime-movie-list.css';
import { CollectionResType } from '@/types';
import { route } from '@/routes';
import { generateSlug, notify, renderImageUrl } from '@/utils';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import { Autoplay, EffectFade, Thumbs } from 'swiper/modules';
import { FAVOURITE_TYPE_MOVIE, queryKeys } from '@/constants';
import { getQueryClient } from '@/components/providers';
import { useAuth } from '@/hooks';
import {
  useDeleteFavouriteMutation,
  useFavouriteGetListIdsQuery,
  useFavouriteMutation
} from '@/queries';
import { logger } from '@/logger';
import { AnimeItem } from '@/components/app/collection';
import Image from 'next/image';
import { CollectionListHeading } from '@/components/app/heading';

export default function AnimeMovieList({
  collection
}: {
  collection: CollectionResType;
}) {
  const movieList = collection?.movies || [];
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

  const queryClient = getQueryClient();

  const { isAuthenticated } = useAuth();

  const { mutateAsync: addFavourite, isPending: addFavouriteLoading } =
    useFavouriteMutation();

  const { mutateAsync: removeFavourite, isPending: removeFavouriteLoading } =
    useDeleteFavouriteMutation();

  const { data: favouriteListIdsData } = useFavouriteGetListIdsQuery({
    params: {
      type: FAVOURITE_TYPE_MOVIE
    },
    enabled: isAuthenticated
  });

  const favouriteListIds = favouriteListIdsData?.data || [];

  const handleLike = async (targetId: string) => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-golden-glow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để thêm phim vào danh sách yêu thích
        </span>
      );
      return;
    }

    if (addFavouriteLoading) return;

    await addFavourite(
      { targetId, type: FAVOURITE_TYPE_MOVIE },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success('Thêm phim vào danh sách yêu thích thành công');
            queryClient.invalidateQueries({
              queryKey: [queryKeys.FAVOURITE_GET_LIST_IDS]
            });
          } else {
            notify.error('Thêm phim vào danh sách yêu thích thất bại');
          }
        },
        onError: (error) => {
          logger.error('Error while adding favourite', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      }
    );
  };

  const handleRemoveLike = async (targetId: string) => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-golden-glow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để xóa phim khỏi danh sách yêu thích
        </span>
      );
      return;
    }

    if (removeFavouriteLoading) return;

    if (targetId) {
      await removeFavourite(
        { targetId, type: FAVOURITE_TYPE_MOVIE },
        {
          onSuccess: (res) => {
            if (res.result) {
              notify.success('Xóa phim khỏi danh sách yêu thích thành công');
              queryClient.invalidateQueries({
                queryKey: [queryKeys.FAVOURITE_GET_LIST_IDS]
              });
            } else {
              notify.error('Xóa phim khỏi danh sách yêu thích thất bại');
            }
          },
          onError: (error) => {
            logger.error('Error while removing favourite', error);
            notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
          }
        }
      );
    }
  };

  return (
    <div className='collection-movie-list anime-movie-list fade-in slide-in-from-top-[-30px] animate-in max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5 duration-200'>
      <CollectionListHeading
        title={collection.name}
        link={`${route.topic.path}/${generateSlug(collection.name)}.${collection.id}`}
      />
      <div className='swiper-container'>
        <Swiper
          onSwiper={setThumbsSwiper}
          effect='fade'
          slidesPerView={1}
          loop={true}
          grabCursor={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[EffectFade, Thumbs, Autoplay]}
          className='top-slide-main'
        >
          {movieList.map((movie) => (
            <SwiperSlide key={movie.id}>
              <AnimeItem
                movie={movie}
                isGrabbing={isGrabbing}
                onPointerDown={() => setIsGrabbing(true)}
                onPointerUp={() => setIsGrabbing(false)}
                handleLike={handleLike}
                handleRemoveLike={handleRemoveLike}
                isLiked={favouriteListIds.includes(movie.id)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={5}
          slidesPerView={15}
          allowTouchMove={false}
          watchSlidesProgress
          modules={[Thumbs]}
          className='top-slide-small'
        >
          {movieList.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div className='poster'>
                <Image
                  src={renderImageUrl(movie.posterUrl)}
                  alt={`${movie.title} - ${movie.originalTitle}`}
                  fill
                  loading='lazy'
                  sizes='(max-width: 768px) 100vw, 50vw'
                  decoding='async'
                  unoptimized
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
