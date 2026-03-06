'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import './schedule-list.css';
import { DATE_TIME_FORMAT, DEFAULT_DATE_FORMAT } from '@/constants';
import { useScheduleMovieListQuery } from '@/queries';
import { formatDate, renderImageUrl } from '@/utils';
import { useEffect, useRef, useState } from 'react';
import { FaRegCalendarCheck } from 'react-icons/fa6';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { addDays, format, subDays } from 'date-fns';
import { cn } from '@/lib';
import { NoData } from '@/components/no-data';
import Link from 'next/link';
import { route } from '@/routes';
import { VerticalBarLoading } from '@/components/loading';

export default function ScheduleList() {
  const nextRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState<string>(() =>
    formatDate(
      new Date().toLocaleDateString('vi-VN'),
      DATE_TIME_FORMAT,
      DEFAULT_DATE_FORMAT
    )
  );

  const {
    data: scheduleListData,
    isLoading,
    isFetching,
    refetch: getScheduleList
  } = useScheduleMovieListQuery({
    params: { date },
    enabled: !false
  });

  const scheduleList = scheduleListData?.data || [];
  const startDate = subDays(new Date(), 2); // Two days ago
  const endDate = addDays(new Date(), 9); // Next 9 days (including today)

  const DAY_LABELS = [
    'Chủ nhật',
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy'
  ];

  // Calculate the number of days between startDate and endDate
  const dayCounts =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  useEffect(() => {
    getScheduleList();
  }, [date, getScheduleList]);

  return (
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      {/* Header */}
      <div className='max-1120:mb-5 max-990:mb-4 max-640:mb-3 max-480:mb-2 mb-6'>
        <div className='max-990:text-2xl max-640:text-[22px] max-480:text-xl flex items-center gap-2 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          <FaRegCalendarCheck className='max-990:[28px] max-640:text-2xl text-[32px]' />
          Lịch chiếu
        </div>
        <div className='grow'></div>
      </div>
      {/* Body */}
      <div className='schedule flex flex-col gap-8'>
        <div className='schedule-date-list'>
          <div className='relative'>
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
              spaceBetween={6}
              modules={[Navigation]}
              grabCursor={true}
              className='w-full'
              breakpoints={{
                480: {
                  slidesPerView: 4.2
                },
                640: {
                  slidesPerView: 5.2
                },
                990: {
                  slidesPerView: 6.2
                },
                1200: {
                  slidesPerView: 7.2
                },
                1400: {
                  slidesPerView: 8.2
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
              {Array.from({ length: dayCounts }).map((_, index) => {
                // Get the current date by adding the index to the start date
                const currentDate = addDays(startDate, index);
                // Format the current date for comparison with the selected date

                const formattedDateForState = formatDate(
                  currentDate.toLocaleDateString('vi-VN'),
                  DATE_TIME_FORMAT,
                  DEFAULT_DATE_FORMAT
                );

                // Check if the current date is the selected date
                const isSelected = date === formattedDateForState;

                return (
                  <SwiperSlide key={currentDate.toString()}>
                    <div
                      className={cn(`schedule-item`, {
                        active: isSelected
                      })}
                      onClick={() => setDate(formattedDateForState)}
                    >
                      <span className='time'>
                        {format(currentDate, 'dd/MM')}
                      </span>
                      <span className='day'>
                        {DAY_LABELS[currentDate.getDay()]}
                      </span>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
        <div className='schedule-movie-list'>
          <div className='relative flex min-h-15 items-start justify-between'>
            {isLoading || isFetching ? (
              <VerticalBarLoading className='mx-auto py-20' />
            ) : scheduleList.length === 0 ? (
              <NoData
                className='max-990:py-15 py-20'
                imageClassName='max-990:size-40'
                content='Không có phim nào được chiếu vào ngày này'
              />
            ) : (
              <div className='max-1120:grid-cols-3 max-800:grid-cols-2 max-640:grid-cols-1 relative z-2 grid grow grid-cols-4 gap-4'>
                {scheduleList.map((item) => (
                  <Link
                    href={`${route.movie.path}/${item.movie.slug}.${item.movie.id}`}
                    key={item.id}
                    className='hover:border-golden-glow relative flex items-center justify-between gap-4 rounded-[12px] border border-solid border-[#ffffff20] bg-[#363840] p-2.5 transition-all duration-200 ease-linear'
                  >
                    <div className='w-12.5 shrink-0'>
                      <div className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-sm pb-[150%]'>
                        <img
                          src={renderImageUrl(item.movie.posterUrl)}
                          alt={`${item.movie.title} - ${item.movie.originalTitle}`}
                          className='absolute inset-0 size-full object-cover'
                          width={50}
                          height={75}
                          loading='lazy'
                          decoding='async'
                        />
                      </div>
                    </div>
                    <div className='grow'>
                      <h4 className='mb-1 text-white'>{item.movie.title}</h4>
                      <div className='block'>
                        <span className='text-dark-gray inline text-xs whitespace-nowrap'>
                          Tập {item.label} - {item.title}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
