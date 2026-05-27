'use client';

import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';
import './slider.css';
import { EffectFade, Thumbs, Autoplay } from 'swiper/modules';
import { useState } from 'react';
import {
  useDeleteFavouriteMutation,
  useFavouriteListIdsQuery,
  useFavouriteMutation
} from '@/queries';
import {
  buildLoginRedirectPath,
  invalidateQueries,
  notify,
  renderImageUrl
} from '@/utils';
import { SliderItem } from './slider-item';
import { useAuth } from '@/hooks';
import { FAVOURITE_TYPE_MOVIE, queryKeys } from '@/constants';
import Link from 'next/link';
import { logger } from '@/logger';
import { VerticalBarLoading } from '@/components/loading';
import Image from 'next/image';
import { SidebarResType } from '@/types';

type SliderProps = {
  sidebarList: SidebarResType[];
};

export function Slider({ sidebarList }: SliderProps) {
  const { isAuthenticated } = useAuth();

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
            href={buildLoginRedirectPath()}
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
            invalidateQueries(
              [queryKeys.FAVOURITE_GET_LIST_IDS],
              [queryKeys.FAVOURITE_LIST],
              [queryKeys.FAVOURITE, { targetId, type: FAVOURITE_TYPE_MOVIE }]
            );
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

  if (sidebarList.length === 0)
    return (
      <VerticalBarLoading className='max-1900:h-190 max-1280:h-150 max-800:h-125 max-640:h-100 flex h-215 items-center justify-center' />
    );

  return (
    <div id='top-slider'>
      <div className='slide-wrapper top-slide-wrap'>
        <Swiper
          effect='fade'
          slidesPerView={1}
          loop={sidebarList.length > 1}
          grabCursor={true}
          thumbs={{ swiper: thumbsSwiper }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false
          }}
          modules={[EffectFade, Thumbs, Autoplay]}
          className='top-slide-main'
        >
          {sidebarList.map((slider) => (
            <SwiperSlide key={slider.id}>
              <SliderItem
                slider={slider}
                isGrabbing={isGrabbing}
                onPointerDown={() => setIsGrabbing(true)}
                onPointerUp={() => setIsGrabbing(false)}
                onVote={handleVote}
                isLiked={favouriteListIds.includes(slider.movie.id)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={5}
          slidesPerView={6}
          allowTouchMove={false}
          watchSlidesProgress
          modules={[Thumbs]}
          className='top-slide-small'
        >
          {sidebarList.map((slider) => (
            <SwiperSlide key={slider.id}>
              <Image
                src={renderImageUrl(slider.webThumbnailUrl)}
                alt={slider.movie.title}
                draggable={false}
                loading='eager'
                width={1920}
                height={1080}
                decoding='async'
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
