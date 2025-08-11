- **params**: là promise, khai báo params: Promise<{key: value}>

- **generateStaticParams**: dùng để tạo SSG với dynamic route

- **enable**: enable trong TanStack Query cho phép fetch trước hay không

- **middleware**: dùng NextRequest, NextResponse

- **Tự động nhận diện type**: const define = <T>: (route: T) => route

'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

import './style.css';

import {
EffectFade,
Navigation,
Pagination,
FreeMode,
Thumbs
} from 'swiper/modules';

export default function Slider() {
const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

return (
<div className='swiper_box'>
<div className='swiper_head'>header</div>

      <div className='relative'>
        {/* Swiper chính */}
        <Swiper
          spaceBetween={30}
          effect={'fade'}
          loop={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[EffectFade, Navigation, Pagination, FreeMode, Thumbs]}
          className='mySwiper'
        >
          <SwiperSlide>
            <img src='https://swiperjs.com/demos/images/nature-1.jpg' />
          </SwiperSlide>
          <SwiperSlide>
            <img src='https://swiperjs.com/demos/images/nature-2.jpg' />
          </SwiperSlide>
          <SwiperSlide>
            <img src='https://swiperjs.com/demos/images/nature-3.jpg' />
          </SwiperSlide>
          <SwiperSlide>
            <img src='https://swiperjs.com/demos/images/nature-4.jpg' />
          </SwiperSlide>
        </Swiper>

        {/* Swiper thumbnails */}
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode
          watchSlidesProgress
          modules={[FreeMode, Navigation, Thumbs]}
          className='mySwiper absolute! bottom-0 bg-gradient-to-b from-black/50 to-black/80 shadow-black'
        >
          <SwiperSlide>
            <img src='https://swiperjs.com/demos/images/nature-1.jpg' />
          </SwiperSlide>
          <SwiperSlide>
            <img src='https://swiperjs.com/demos/images/nature-2.jpg' />
          </SwiperSlide>
          <SwiperSlide>
            <img src='https://swiperjs.com/demos/images/nature-3.jpg' />
          </SwiperSlide>
          <SwiperSlide>
            <img src='https://swiperjs.com/demos/images/nature-4.jpg' />
          </SwiperSlide>
        </Swiper>
      </div>

      <div className='swiper_foot'>footer</div>
    </div>

);
}
