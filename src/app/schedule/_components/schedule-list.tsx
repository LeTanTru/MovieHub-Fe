'use client';

import { DATE_SHORT, DATE_TIME_FORMAT, DEFAULT_DATE_FORMAT } from '@/constants';
import { useScheduleMovieListQuery } from '@/queries';
import { formatDate, renderImageUrl } from '@/utils';
import { useEffect, useState } from 'react';
import { FaRegCalendarCheck } from 'react-icons/fa6';
import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { cn } from '@/lib';
import { NoData } from '@/components/no-data';
import Link from 'next/link';
import { route } from '@/routes';
import { VerticalBarLoading } from '@/components/loading';
import Image from 'next/image';
import { m } from 'framer-motion';

const MotionLink = m(Link);

export default function ScheduleList() {
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
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const DAY_LABELS = [
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy',
    'Chủ nhật'
  ];

  useEffect(() => {
    getScheduleList();
  }, [date, getScheduleList]);

  return (
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      {/* Header */}
      <div className='max-1120:mb-5 max-990:mb-4 mb-6'>
        <div className='max-990:text-2xl max-640:text-[22px] max-480:text-xl max-990:gap-2 flex items-center gap-4 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          <FaRegCalendarCheck className='max-990:text-[28px] max-640:text-[22px] text-[32px]' />
          Lịch chiếu
        </div>
        <div className='grow'></div>
      </div>
      {/* Body */}
      <div className='flex flex-col gap-8'>
        <div className='max-990:flex scrollbar-none max-990:overflow-auto grid grid-cols-7 gap-2'>
          {weekDays.map((currentDate) => {
            const formattedDateForState = formatDate(
              currentDate.toLocaleDateString('vi-VN'),
              DATE_TIME_FORMAT,
              DEFAULT_DATE_FORMAT
            );

            const isSelected = date === formattedDateForState;
            const dayIndex = (currentDate.getDay() + 6) % 7;

            return (
              <m.div
                role='button'
                key={formattedDateForState}
                whileHover={{
                  y: -10
                }}
                whileTap={{
                  scale: 0.95,
                  y: 0
                }}
                className={cn(
                  'hover:border-golden-glow group max-990:gap-2 max-990:py-3 max-990:w-35 max-640:w-40 max-990:shrink-0 flex cursor-pointer flex-col gap-3 rounded-md border-2 border-solid border-transparent bg-white/6 px-4 py-5 text-center transition-all duration-200 ease-linear',
                  {
                    'border-golden-glow': isSelected
                  }
                )}
                onClick={() => setDate(formattedDateForState)}
              >
                <span
                  className={cn(
                    'group-hover:text-golden-glow font-medium transition-all duration-200 ease-linear',
                    {
                      'text-golden-glow': isSelected
                    }
                  )}
                >
                  {formatDate(formattedDateForState, DATE_SHORT)}
                </span>
                <span
                  className={cn(
                    'group-hover:text-golden-glow max-990:text-base text-lg font-medium whitespace-nowrap transition-all duration-200 ease-linear',
                    {
                      'text-golden-glow': isSelected
                    }
                  )}
                >
                  {DAY_LABELS[dayIndex]}
                </span>
              </m.div>
            );
          })}
        </div>
        {/* Movie List */}
        <div className='relative flex min-h-15 items-start justify-between'>
          {isLoading || isFetching ? (
            <VerticalBarLoading className='mx-auto py-20' />
          ) : scheduleList.length === 0 ? (
            <NoData
              className='max-640:pb-20 max-640:pt-10 pt-25 pb-30'
              imageClassName='max-640:size-40 max-480:size-30'
              content={
                <>
                  Không có lịch chiếu nào cho ngày&nbsp;
                  <b>{formatDate(date, DATE_SHORT)}</b>
                  .
                  <br />
                  Bạn thử xem ngày khác nhé 😊
                </>
              }
            />
          ) : (
            <div className='max-1120:grid-cols-3 max-800:grid-cols-2 max-640:grid-cols-1 relative z-2 grid grow grid-cols-4 gap-4'>
              {scheduleList.map((item) => (
                <MotionLink
                  href={`${route.movie.path}/${item.movie.slug}.${item.movie.id}`}
                  key={item.id}
                  className='hover:border-golden-glow relative flex items-center justify-between gap-4 rounded-[12px] border border-solid border-[#ffffff20] bg-[#363840] p-2.5 transition-all duration-200 ease-linear'
                  whileHover={{
                    y: -10
                  }}
                  whileTap={{
                    scale: 0.95
                  }}
                >
                  <div className='w-12.5 shrink-0'>
                    <div className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-sm pb-[150%]'>
                      <Image
                        src={renderImageUrl(item.movie.posterUrl)}
                        alt={`${item.movie.title} - ${item.movie.originalTitle}`}
                        className='absolute inset-0 size-full object-cover'
                        width={50}
                        height={75}
                        loading='lazy'
                        decoding='async'
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className='grow'>
                    <h4 className='mb-1 text-white'>{item.movie.title}</h4>
                    <span
                      className='text-dark-gray line-clamp-2 text-xs'
                      title={`Tập ${item.label} - ${item.title}`}
                    >
                      Tập {item.label}: {item.title}
                    </span>
                  </div>
                </MotionLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
