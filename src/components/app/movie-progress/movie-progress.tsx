import { CircleLoading } from '@/components/loading';
import { cn } from '@/lib';
import { FaCheckCircle } from 'react-icons/fa';

export default function MovieProgress({
  isComplete,
  currentTotalEpisode,
  totalEpisode
}: {
  isComplete: boolean;
  currentTotalEpisode: number;
  totalEpisode: number;
}) {
  return (
    <div className='mb-3'>
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-4xl px-3.5 py-2 text-xs',
          {
            'bg-malachite/30 text-malachite': isComplete,
            'bg-vivid-orange/30 text-vivid-orange': !isComplete
          }
        )}
      >
        {isComplete ? (
          <FaCheckCircle className='fill-malachite dark:stroke-malachite/30 size-4' />
        ) : (
          <CircleLoading className='dark:stroke-vivid-orange size-4 animate-spin stroke-3' />
        )}
        <span>
          {isComplete ? 'Đã hoàn thành' : 'Đã chiếu'}: {currentTotalEpisode}
          &nbsp;/&nbsp;
          {totalEpisode || '?'} Tập
        </span>
      </div>
    </div>
  );
}
