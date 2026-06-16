import { NoData } from '@/components/no-data';
import { DATE_SHORT } from '@/constants';
import type { MovieScheduleResType } from '@/types';
import { formatDate } from '@/utils';
import { ScheduleItem } from './schedule-item';

type ScheduleMovieListProps = {
  date: string;
  isLoading: boolean;
  scheduleList: MovieScheduleResType[];
};

const SCHEDULE_SKELETON_COUNT = 8;

export function ScheduleMovieList({
  date,
  isLoading,
  scheduleList
}: ScheduleMovieListProps) {
  return (
    <div className='relative flex min-h-15 items-start justify-between'>
      {isLoading ? (
        <div className='max-1120:grid-cols-3 max-800:grid-cols-2 max-640:grid-cols-1 relative z-2 grid grow grid-cols-4 gap-4'>
          {Array.from({ length: SCHEDULE_SKELETON_COUNT }).map((_, index) => (
            <ScheduleItem.Skeleton key={`schedule-skeleton-${index}`} />
          ))}
        </div>
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
            <ScheduleItem key={item.id} schedule={item} />
          ))}
        </div>
      )}
    </div>
  );
}
