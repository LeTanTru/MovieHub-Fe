'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import './watch-continue.css';
import { MovieHistoryCard } from '@/components/app/movie-card';
import { useMovieHistoryListQuery } from '@/queries';
import { route } from '@/routes';
import { Navigation } from 'swiper/modules';
import { useAuth, useWatchHistoryDelete } from '@/hooks';
import { useRef } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { VerticalBarLoading } from '@/components/loading';
import { CollectionListHeading } from '@/components/app/heading';

export function WatchContinue() {
  const { isAuthenticated } = useAuth();

  const nextRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);

  const { data: movieHistories = [], isLoading } = useMovieHistoryListQuery({
    enabled: isAuthenticated
  });

  const { handleDeleteWatchHistory } = useWatchHistoryDelete();

  if (!isAuthenticated) return null;

  if (isLoading) return <VerticalBarLoading className='py-20' />;

  if (movieHistories.length === 0) return null;

  return (
    <div className='watch-continue fade-in slide-in-from-top-[-30px] animate-in max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5 duration-200'>
      <CollectionListHeading
        title='Xem tiếp của bạn'
        link={route.user.watchHistory.path}
      />

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
          key='watch-continue-slider'
        >
          {movieHistories.map((movieHistory) => (
            <SwiperSlide key={movieHistory.id}>
              <MovieHistoryCard
                movieHistory={movieHistory}
                onDelete={handleDeleteWatchHistory}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
