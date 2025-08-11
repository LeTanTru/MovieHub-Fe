'use client';

import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

import {
  EffectFade,
  Navigation,
  Pagination,
  FreeMode,
  Thumbs
} from 'swiper/modules';

import './style.css';

import Image from 'next/image';
import { useState } from 'react';

export default function Slider() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const sliders = [
    {
      src: 'https://static.nutscdn.com/vimg/1920-0/f240f8af00e2bca18281331bc5f30bd9.jpg'
    },
    {
      src: 'https://static.nutscdn.com/vimg/1920-0/f9f19a5f7eaa5795b11e3d369c48cbca.webp'
    },
    {
      src: 'https://static.nutscdn.com/vimg/1920-0/862b61e1bc770c7e25e84e6ec745009e.webp'
    },
    {
      src: 'https://static.nutscdn.com/vimg/1920-0/77a1a72c536f7dd9b9fc6b9aaf55c89a.webp'
    },
    {
      src: 'https://static.nutscdn.com/vimg/1920-0/72f87b8c3294dbdb51ca1afa4b9ee760.webp'
    },
    {
      src: 'https://static.nutscdn.com/vimg/1920-0/ecd581a3c6ebadbad901ae1301e5e1d5.jpg'
    }
  ];
  return (
    <div id='top-slide'>
      <div className='slide-wrapper top-slide-wrap'>
        <Swiper
          effect='fade'
          slidesPerView={1}
          loop={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[EffectFade, Navigation, Pagination, FreeMode, Thumbs]}
          className='top-slide-main'
        >
          {sliders.map((slider, index) => (
            <SwiperSlide key={slider.src + index}>
              <div className='slide-elements'>
                <a
                  className='slide-url'
                  href='/phim/the-gioi-khung-long-tai-sinh.QigIhNas'
                ></a>
                <div
                  className='background-fade'
                  style={{ background: `url(${slider.src})` }}
                ></div>
                <div className='cover-fade'>
                  <div className='cover-image'>
                    <img
                      className='fade-in visible h-[860px]'
                      title='Thế Giới Khủng Long: Tái Sinh'
                      loading='lazy'
                      src={slider.src}
                      alt={`Slider + ${index}`}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          allowTouchMove={false}
          watchSlidesProgress
          modules={[Navigation, Thumbs]}
          // className='thumbnails absolute! right-[50px] bottom-[212px] w-[450px]'
        >
          {sliders.map((slider, index) => (
            <SwiperSlide key={slider.src + index} className='mr-[5px]! w-1/7!'>
              <Image
                width={1100}
                height={200}
                src={slider.src}
                alt={`Slider ${index}`}
                draggable={false}
              />
            </SwiperSlide>
          ))}
        </Swiper> */}
      </div>
    </div>
  );
}
