'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import './schedule-list.css';
import { DATE_TIME_FORMAT, DEFAULT_DATE_FORMAT } from '@/constants';
import { useScheludeMovieListQuery } from '@/queries';
import { formatDate } from '@/utils';
import { useRef, useState } from 'react';
import { FaRegCalendarCheck } from 'react-icons/fa6';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { addDays, format, subDays } from 'date-fns';
import { cn } from '@/lib';

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

  const { data: scheduleListData, isLoading: scheduleListLoading } =
    useScheludeMovieListQuery({
      params: { date },
      enabled: !!date
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

  return (
    <div className='mx-auto w-full max-w-475 px-12.5'>
      {/* Header */}
      <div className='relative mb-5 flex min-h-11 items-center justify-start gap-4'>
        <div className='text-[32px]'>
          <FaRegCalendarCheck />
        </div>
        <div className='text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,.3)]'>
          Lịch chiếu
        </div>
        <div className='grow'></div>
      </div>
      {/* Body */}
      <div className='schedule flex flex-col gap-8 py-4'>
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
              slidesPerView={7}
              spaceBetween={6}
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
          <div className='relative flex min-h-15 items-start justify-between'></div>
        </div>
      </div>
    </div>
  );
}
