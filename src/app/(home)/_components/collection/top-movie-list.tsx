'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CollectionResType } from '@/types';
import { Navigation } from 'swiper/modules';
import { useRef } from 'react';
import { TopMovieCard } from '@/components/app/collection';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

export default function TopMovieList({
  collection
}: {
  collection: CollectionResType;
}) {
  const movieList = collection?.movies || [];

  const nextRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);

  return (
    <div className='collection-movie-list fade-in slide-in-from-top-[-30px] animate-in max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5 duration-200'>
      <>
        <div className='max-1600:mb-4 max-640:mb-3 max-480:mb-2 max-480:justify-between relative mb-6 flex items-center justify-start gap-4'>
          <h3 className='max-1600:text-2xl max-640:text-[22px] max-520:text-xl text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
            {collection.name}&nbsp;
          </h3>
        </div>
        <div className='swiper-container'>
          <div className='swiper-navigation'>
            <div ref={nextRef} className='swiper-button swiper-next-button'>
              <LuChevronRight />
            </div>
            <div ref={prevRef} className='swiper-button swiper-prev-button'>
              <LuChevronLeft />
            </div>
          </div>
          <Swiper
            slidesPerView={2.2}
            spaceBetween={16}
            modules={[Navigation]}
            grabCursor={true}
            className='w-full'
            breakpoints={{
              480: {
                slidesPerView: 3.2
              },
              768: {
                slidesPerView: 4.2
              },
              1024: {
                slidesPerView: 5.2
              },
              1280: {
                slidesPerView: 6.2
              },
              1400: {
                slidesPerView: 7.2
              },
              1600: {
                slidesPerView: 7
              }
            }}
            onSwiper={(swiper) => {
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation !== 'boolean'
              ) {
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }
            }}
            key={collection.id}
          >
            {movieList.map((movie, index) => (
              <SwiperSlide key={movie.id}>
                <TopMovieCard movie={movie} dir='down' index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </>
    </div>
  );
}
