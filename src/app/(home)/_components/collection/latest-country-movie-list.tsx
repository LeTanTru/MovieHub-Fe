'use client';

import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CollectionResType } from '@/types';
import { route } from '@/routes';
import { FaChevronRight } from 'react-icons/fa6';
import { Navigation } from 'swiper/modules';
import { useRef } from 'react';
import { generateSlug, getColorList } from '@/utils';
import { LatestCountryMovieCard } from '@/components/app/collection';

export default function LastestCountryMovieList({
  collection
}: {
  collection: CollectionResType;
}) {
  const nextRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);

  const movieList = collection?.movies || [];
  const colors = getColorList(collection.color || '[]');

  const gradientStyle = {
    background: `linear-gradient(to bottom, ${colors.slice(0, 2).join(', ')})`
  };

  return (
    <div className='collection-movie-list fade-in slide-in-from-top-[-30px] animate-in mx-auto w-full max-w-475 px-12.5 duration-200'>
      <div
        className='flex items-center justify-between gap-4 rounded-lg p-8'
        style={{ ...gradientStyle }}
      >
        <div className='relative z-3 flex w-0.5 grow flex-col gap-4 pr-4 pl-2 text-center'>
          <h3 className='bg-linear-to-r from-red-500 to-blue-500 bg-clip-text text-[28px] leading-[1.3] font-semibold text-transparent text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
            {collection.name}&nbsp;
          </h3>
          <Link
            href={`${route.topic.path}/${generateSlug(collection.name)}.${collection.id}`}
            className='hover:text-golden-glow flex items-center justify-center gap-0.5 transition-all duration-200 ease-linear'
          >
            <span>Xem toàn bộ</span>
            <FaChevronRight className='text-sm' />
          </Link>
        </div>
        <div className='relative z-3 w-[calc(100%-230px)]'>
          <div className='swiper-container'>
            <div className='swiper-navigation'>
              <div ref={nextRef} className='swiper-button-next' />
              <div ref={prevRef} className='swiper-button-prev' />
            </div>
            <Swiper
              slidesPerView={5}
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
              {movieList.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <LatestCountryMovieCard movie={movie} dir='down' />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
