'use client';

import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';
import './slider.css';
import { EffectFade, Thumbs, Autoplay } from 'swiper/modules';
import { useState } from 'react';
import { renderImageUrl } from '@/utils';
import { SliderItem } from './slider-item';
import { useToggleFavourite } from '@/hooks';
import { VerticalBarLoading } from '@/components/loading';
import Image from 'next/image';
import { SidebarResType } from '@/types';

type SliderProps = {
  sidebarList: SidebarResType[];
};

export function Slider({ sidebarList }: SliderProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

  const { favouriteListIds, handleVote } = useToggleFavourite();

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
