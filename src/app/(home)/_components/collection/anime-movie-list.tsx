'use client';

import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import './anime-movie-list.css';
import { CollectionResType } from '@/types';
import { route } from '@/routes';
import {
  generateSlug,
  invalidateQueries,
  notify,
  renderImageUrl
} from '@/utils';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import { Autoplay, EffectFade, Thumbs } from 'swiper/modules';
import { FAVOURITE_TYPE_MOVIE, queryKeys } from '@/constants';
import { useAuth } from '@/hooks';
import {
  useDeleteFavouriteMutation,
  useFavouriteListIdsQuery,
  useFavouriteMutation
} from '@/queries';
import { logger } from '@/logger';
import { AnimeItem } from '@/components/app/collection';
import Image from 'next/image';
import { CollectionListHeading } from '@/components/app/heading';

type AnimeMovieListProps = {
  collection: CollectionResType;
};

export default function AnimeMovieList({ collection }: AnimeMovieListProps) {
  const { isAuthenticated } = useAuth();

  const movieList = collection?.movies || [];

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

  const { mutateAsync: addFavourite, isPending: addFavouriteLoading } =
    useFavouriteMutation();

  const { mutateAsync: removeFavourite, isPending: removeFavouriteLoading } =
    useDeleteFavouriteMutation();

  const { data: favouriteListIdsData } = useFavouriteListIdsQuery({
    params: {
      type: FAVOURITE_TYPE_MOVIE
    },
    enabled: isAuthenticated
  });

  const favouriteListIds = favouriteListIdsData?.ids || [];

  const handleVote = async (targetId: string, isLiked: boolean) => {
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
          &nbsp;để {isLiked ? 'xóa phim khỏi' : 'thêm phim vào'} danh sách yêu
          thích
        </span>
      );
      return;
    }

    const mutate = isLiked ? removeFavourite : addFavourite;
    const loading = isLiked ? removeFavouriteLoading : addFavouriteLoading;

    if (loading) return;

    await mutate(
      { targetId, type: FAVOURITE_TYPE_MOVIE },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success(
              `${isLiked ? 'Xóa phim khỏi' : 'Thêm phim vào'} danh sách yêu thích thành công`
            );
            invalidateQueries([queryKeys.FAVOURITE_GET_LIST_IDS]);
          } else {
            notify.error(
              `${isLiked ? 'Xóa phim khỏi' : 'Thêm phim vào'} danh sách yêu thích thất bại`
            );
          }
        },
        onError: (error) => {
          logger.error(
            `[${isLiked ? 'REMOVE' : 'ADD'}_FAVOURITE_ERROR]`,
            error
          );
          notify.error(
            `${isLiked ? 'Xóa phim khỏi' : 'Thêm phim vào'} danh sách yêu thích thất bại`
          );
        }
      }
    );
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
                onVote={handleVote}
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
