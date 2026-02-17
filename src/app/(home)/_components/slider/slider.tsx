'use client';

import './slider.css';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';
import { EffectFade, Thumbs, Autoplay } from 'swiper/modules';
import { useState } from 'react';
import { useSidebarListQuery } from '@/queries';
import { renderImageUrl } from '@/utils';
import SliderItem from './slider-item';

export default function Slider() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);
  const { data: sidebarListData, isLoading: sidebarListDataLoading } =
    useSidebarListQuery({ enabled: true });

  const sidebarList = sidebarListData?.data?.content || [];

  return (
    <div id='top-slide'>
      <div className='slide-wrapper top-slide-wrap'>
        <Swiper
          effect='fade'
          slidesPerView={1}
          loop={true}
          grabCursor={true}
          thumbs={{ swiper: thumbsSwiper }}
          autoplay={{
            delay: 2500,
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
              <img
                src={renderImageUrl(slider.webThumbnailUrl)}
                alt={slider.movie.title}
                draggable={false}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
