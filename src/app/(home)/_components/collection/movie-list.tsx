'use client';

import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import './movie-list.css';
import { CollectionResType } from '@/types';
import { route } from '@/routes';
import { FaChevronRight } from 'react-icons/fa6';
import { MovieGridSkeleton } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { Navigation } from 'swiper/modules';
import { MovieCollectionCard } from '@/components/app/movie-card';
import { useRef } from 'react';
import { generateSlug } from '@/utils';

export default function MovieList({
  collection,
  isLoading
}: {
  collection: CollectionResType;
  isLoading: boolean;
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
          <Link
            href={`${route.topic.path}/${generateSlug(collection.name)}.${collection.id}`}
            className='group hover:text-golden-glow hover:border-golden-glow flex items-center gap-0.5 rounded-full border p-1 text-lg transition-all duration-200 ease-linear hover:w-auto hover:px-2.5'
          >
            <span className='hidden text-sm group-hover:block'>Xem thêm</span>
            <FaChevronRight className='text-sm' />
          </Link>
        </div>
        {isLoading ? (
          <MovieGridSkeleton className='grid-cols-7' skeletonCount={7} />
        ) : movieList.length === 0 ? (
          <NoData
            className='pt-25'
            content={
              <>
                Bạn chưa xem phim nào. Hãy khám phá và xem những bộ phim yêu
                thích của bạn ngay bây giờ 😉
              </>
            }
          />
        ) : (
          <div className='swiper-container'>
            <div className='swiper-navigation'>
              <div ref={nextRef} className='swiper-button-next' />
              <div ref={prevRef} className='swiper-button-prev' />
            </div>
            <Swiper
              slidesPerView={6}
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
              key='collection-list-slider'
            >
              {movieList.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <MovieCollectionCard movie={movie} dir='down' />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </>
    </div>
  );
}
