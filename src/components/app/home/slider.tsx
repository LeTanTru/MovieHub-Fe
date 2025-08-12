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

import './slider.css';

import { useState } from 'react';
import { HeartIcon, InfoIcon, Play } from 'lucide-react';

export default function Slider() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

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
                      className='fade-in visible'
                      title='Thế Giới Khủng Long: Tái Sinh'
                      loading='lazy'
                      src={slider.src}
                      alt={`Slider + ${index}`}
                    />
                  </div>
                </div>
                <div
                  className='safe-area'
                  style={{ cursor: isGrabbing ? 'grabbing' : 'grab' }}
                  onPointerDown={() => setIsGrabbing(true)}
                  onPointerUp={() => setIsGrabbing(false)}
                >
                  <div className='slide-content'>
                    <div className='media-item'>
                      <div className='media-title-image'>
                        <a title='Thứ Tư' href='/phim/thu-tu.fc2lVFZu'>
                          <img
                            alt='Thứ Tư'
                            src='https://static.nutscdn.com/vimg/0-260/961f955325f77aceef42872258356426.png'
                          />
                        </a>
                      </div>
                      <h3 className='media-title' style={{ display: 'none' }}>
                        <a title='Thứ Tư' href='/phim/thu-tu.fc2lVFZu'>
                          Thứ Tư
                        </a>
                      </h3>
                      <h3 className='media-alias-title'>
                        <a title='Wednesday' href='/phim/thu-tu.fc2lVFZu'>
                          Wednesday
                        </a>
                      </h3>
                      <div className='hl-tags'>
                        <div className='tag-imdb'>
                          <span>8.0</span>
                        </div>
                        <div className='tag-model'>
                          <span className='last'>
                            <strong>T16</strong>
                          </span>
                        </div>
                        <div className='tag-classic'>
                          <span>2022</span>
                        </div>
                        <div className='tag-classic'>
                          <span>Phần 2</span>
                        </div>
                        <div className='tag-classic'>
                          <span>Tập 4</span>
                        </div>
                      </div>
                      <div className='hl-tags mb-4'>
                        <a
                          className='tag-topic'
                          href='/the-loai/chinh-kich.1gOywM'
                        >
                          Chính Kịch
                        </a>
                        <a className='tag-topic' href='/the-loai/bi-an.T6q81e'>
                          Bí Ẩn
                        </a>
                        <a className='tag-topic' href='/the-loai/hai.W8Dn2a'>
                          Hài
                        </a>
                        <a className='tag-topic' href='/the-loai/ky-ao.gVRG25'>
                          Kỳ Ảo
                        </a>
                        <a
                          className='tag-topic'
                          href='/the-loai/chuyen-the.wSzjQd'
                        >
                          Chuyển Thể
                        </a>
                        <a
                          className='tag-topic'
                          href='/the-loai/phieu-luu.wca3Bp'
                        >
                          Phiêu Lưu
                        </a>
                      </div>
                      <div className='description lim-3'>
                        Thông minh, hay châm chọc và &quot;chết trong lòng&quot;
                        một chút, Wednesday Addams điều tra một vụ giết người
                        liên hoàn trong khi có thêm bạn và cả kẻ thù mới học Học
                        viện Nevermore.
                      </div>
                      <div className='touch'>
                        <a
                          className='button-play'
                          href='/xem-phim/thu-tu.fc2lVFZu'
                        >
                          <Play />
                        </a>
                        <div className='touch-group transition-all duration-200 ease-linear hover:border-white!'>
                          <a className='item group'>
                            <div className='inc-icon icon-20'>
                              <HeartIcon className='size-5! fill-white group-hover:fill-[#FFD875] group-hover:stroke-0' />
                            </div>
                          </a>
                          <a
                            className='item group'
                            href='/phim/thu-tu.fc2lVFZu'
                          >
                            <div className='inc-icon icon-20'>
                              <InfoIcon className='size-5 fill-white stroke-black group-hover:fill-[#FFD875]' />
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={5}
          slidesPerView={6}
          allowTouchMove={false}
          watchSlidesProgress
          modules={[Navigation, Thumbs]}
          className='top-slide-small'
        >
          {sliders.map((slider, index) => (
            <SwiperSlide key={slider.src + index}>
              <img src={slider.src} alt={`Slider ${index}`} draggable={false} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
