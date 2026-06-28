'use client';

import { DATE_TIME_FORMAT, DATE_FORMAT } from '@/constants';
import { FaRegCalendarCheck } from 'react-icons/fa6';
import { formatDate } from '@/utils';
import { ScheduleMovieList } from './schedule-movie-list';
import { ScheduleWeekDays } from './schedule-week-days';
import { useEffect, useState } from 'react';
import { useScheduleMovieListQuery } from '@/queries';

export function ScheduleList() {
  const [date, setDate] = useState<string>(() =>
    formatDate(
      new Date().toLocaleDateString('vi-VN'),
      DATE_TIME_FORMAT,
      DATE_FORMAT
    )
  );

  const {
    data: scheduleList = [],
    isLoading,
    isFetching,
    refetch: getScheduleList
  } = useScheduleMovieListQuery({
    params: { date },
    enabled: !false
  });

  useEffect(() => {
    getScheduleList();
  }, [date, getScheduleList]);

  return (
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      <div className='max-1120:mb-5 max-990:mb-4 mb-6'>
        <h1 className='max-990:text-2xl max-640:text-[22px] max-480:text-xl max-990:gap-2 flex items-center gap-4 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          <FaRegCalendarCheck className='max-990:text-[28px] max-640:text-[22px] text-[32px]' />
          Lịch chiếu
        </h1>
        <div className='grow'></div>
      </div>
      <div className='flex flex-col gap-8'>
        <ScheduleWeekDays date={date} onDateChange={setDate} />
        <ScheduleMovieList
          date={date}
          isLoading={isLoading || isFetching}
          scheduleList={scheduleList}
        />
      </div>
    </div>
  );
}
