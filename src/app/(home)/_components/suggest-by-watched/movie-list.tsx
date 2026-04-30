'use client';

import { CollectionListHeading } from '@/components/app/heading';
import { MovieCard } from '@/components/app/movie-card';
import { MovieResType } from '@/types';
import { useRef } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function MovieList({
  title,
  loading,
  movieList
}: {
  title: string;
  loading: boolean;
  movieList: MovieResType[];
}) {
  const nextRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);

  return (
    <div className='collection-movie-list fade-in slide-in-from-top-[-30px] animate-in max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5 duration-200'>
      <CollectionListHeading title={title} loading={loading} />
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
              slidesPerView: 8
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
        >
          {movieList.map((movie) => (
            <SwiperSlide key={movie.id}>
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
