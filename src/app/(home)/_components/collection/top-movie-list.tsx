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
    <div className='collection-movie-list fade-in slide-in-from-top-[-30px] animate-in mx-auto w-full max-w-475 px-12.5 duration-200'>
      <>
        <div className='flex-start relative mb-5 flex min-h-11 items-center gap-4'>
          <h3 className='text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
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
            slidesPerView={7}
            spaceBetween={16}
            modules={[Navigation]}
            grabCursor={true}
            className='w-full'
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
