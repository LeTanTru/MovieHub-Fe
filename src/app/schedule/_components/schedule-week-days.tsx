'use client';

import { DATE_SHORT, DATE_TIME_FORMAT, DEFAULT_DATE_FORMAT } from '@/constants';
import { cn } from '@/lib';
import { formatDate } from '@/utils';
import { eachDayOfInterval, endOfWeek, startOfWeek } from 'date-fns';
import { m } from 'framer-motion';

type ScheduleWeekDaysProps = {
  date: string;
  onDateChange: (date: string) => void;
};

const DAY_LABELS = [
  'Thứ hai',
  'Thứ ba',
  'Thứ tư',
  'Thứ năm',
  'Thứ sáu',
  'Thứ bảy',
  'Chủ nhật'
];

export function ScheduleWeekDays({
  date,
  onDateChange
}: ScheduleWeekDaysProps) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
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
            onClick={() => onDateChange(formattedDateForState)}
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
  );
}
