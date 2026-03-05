'use client';

import './latest-country-movie-list.css';
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
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

export default function LastestCountryMovieList({
  collection
}: {
  collection: CollectionResType;
}) {
  const nextRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);

  const movieList = collection?.movies || [];
  const colors = getColorList(collection.color || '[]');

  return (
    <div className='collection-movie-list latest-country-movie-list fade-in slide-in-from-top-[-30px] animate-in max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5 duration-200'>
      <div className='max-1360:flex-col max-1360:p-0 max-1360:gap-4 flex items-center justify-between gap-4'>
        <div className='max-1360:flex-row max-1360:w-full max-1360:p-0 max-1360:items-center max-1360:justify-between relative z-3 flex grow flex-col gap-6 pr-4 pl-2 text-center'>
          <h3
            className='max-1360:text-2xl max-640:text-xl max-1360:flex-1 max-1360:text-left bg-clip-text text-[28px] leading-[1.3] font-semibold text-transparent text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'
            style={
              {
                backgroundImage: `linear-gradient(90deg, ${colors
                  .map((color) => `${color}`)
                  .join(', ')})`
              } as React.CSSProperties
            }
          >
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
        <div className='max-1600:w-[calc(100%-200px)] max-1360:w-full relative z-3 w-[calc(100%-230px)]'>
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
                640: {
                  slidesPerView: 3.2
                },
                1024: {
                  slidesPerView: 4.2
                },
                1600: {
                  slidesPerView: 5
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
