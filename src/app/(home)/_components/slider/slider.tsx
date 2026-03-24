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
  useFavouriteMutation,
  useSidebarListQuery
} from '@/queries';
import { notify, renderImageUrl } from '@/utils';
import SliderItem from './slider-item';
import { useAuth } from '@/hooks';
import { FAVOURITE_TYPE_MOVIE, queryKeys } from '@/constants';
import { route } from '@/routes';
import Link from 'next/link';
import { logger } from '@/logger';
import { getQueryClient } from '@/components/providers/query-provider';
import { VerticalBarLoading } from '@/components/loading';
import Image from 'next/image';

export default function Slider() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);
  const queryClient = getQueryClient();

  const { data: sidebarListData, isLoading } = useSidebarListQuery({
    enabled: true
  });

  const sidebarList = sidebarListData?.data?.content || [];

  const { isAuthenticated } = useAuth();

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

  const favouriteListIds = favouriteListIdsData?.data?.ids || [];

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

  if (isLoading)
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
                handleLike={handleLike}
                handleRemoveLike={handleRemoveLike}
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
