'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import './watch-continue.css';
import { MovieCardHistory } from '@/components/app/movie-card';
import { MovieGridSkeleton } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { useMovieHistoryListQuery } from '@/queries';
import { route } from '@/routes';
import Link from 'next/link';
import { Navigation } from 'swiper/modules';
import { FaChevronRight } from 'react-icons/fa6';

export default function WatchContinue() {
  const swiper = useSwiper();
  const { data: movieHistoriesData, isLoading } = useMovieHistoryListQuery({
    enabled: true
  });

  const movieHistories = movieHistoriesData?.data || [];

  if (!movieHistories.length) return null;

  return (
    <div className='fade-in slide-in-from-top-[-30px] animate-in mx-auto w-full max-w-475 px-12.5'>
      <div className='flex-start relative mb-5 flex min-h-11 items-center gap-4'>
        <h3 className='text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          Xem tiếp&nbsp;
        </h3>
        <Link
          href={route.user.watchHistory.path}
          className='hover:text-light-golden-yellow hover:border-light-golden-yellow rounded-full border p-1 text-lg transition-colors duration-200 ease-linear'
        >
          <FaChevronRight />
        </Link>
      </div>
      {isLoading ? (
        <MovieGridSkeleton className='grid-cols-7' skeletonCount={7} />
      ) : movieHistories.length === 0 ? (
        <NoData
          className='pt-25'
          content={
            <>
              Bạn chưa xem phim nào. Hãy khám phá và xem những bộ phim yêu thích
              của bạn ngay bây giờ 😉
            </>
          }
        />
      ) : (
        <div className='swiper-container'>
          <div className='swiper-navigation'>
            <div
              className='swiper-button-next'
              onClick={() => swiper?.slideNext()}
            ></div>
            <div
              className='swiper-button-prev'
              onClick={() => swiper?.slidePrev()}
            ></div>
          </div>
          <Swiper
            slidesPerView={7}
            spaceBetween={16}
            modules={[Navigation]}
            grabCursor={true}
            className='w-full'
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            }}
          >
            {movieHistories.map((movieHistory) => (
              <SwiperSlide key={movieHistory.id}>
                <MovieCardHistory movieHistory={movieHistory} dir='down' />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
