'use client';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CollectionResType } from '@/types';
import { route } from '@/routes';
import { Navigation } from 'swiper/modules';
import { useRef } from 'react';
import { generateSlug } from '@/utils';
import { CinemaMovieCard } from '@/components/app/collection';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { CollectionListHeading } from '@/components/app/heading';

export default function CinemaMovieList({
  collection
}: {
  collection: CollectionResType;
}) {
  const movieList = collection?.movies || [];

  const nextRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);

  return (
    <div className='collection-movie-list fade-in slide-in-from-top-[-30px] animate-in max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5 duration-200'>
      <CollectionListHeading
        title={collection.name}
        link={`${route.topic.path}/${generateSlug(collection.name)}.${collection.id}`}
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
          slidesPerView={1.2}
          spaceBetween={16}
          modules={[Navigation]}
          grabCursor={true}
          className='w-full'
          breakpoints={{
            480: {
              slidesPerView: 1.8
            },
            640: {
              slidesPerView: 2.2
            },
            800: {
              slidesPerView: 2.8
            },
            990: {
              slidesPerView: 3.2
            },
            1280: {
              slidesPerView: 4.2
            },
            1536: {
              slidesPerView: 5.2
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
              <CinemaMovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
