import { NoData } from '@/components/no-data';
import ReviewItem, { ReviewItemSkeleton } from './review-item';
import { ReviewResType } from '@/types';
import { emptyDiscussion } from '@/assets';

export default function ReviewList({
  reviews,
  isLoading = false
}: {
  reviews: ReviewResType[];
  isLoading?: boolean;
}) {
  if (isLoading)
    return (
      <div className='mt-12 flex flex-col justify-between gap-8'>
        {Array.from({ length: 3 }).map((_, index) => (
          <ReviewItemSkeleton key={`review-skeleton-${index}`} />
        ))}
      </div>
    );

  if (!reviews.length)
    return (
      <NoData
        className='dark:bg-background/30 mt-4 min-h-30 rounded-lg px-8 py-12 opacity-50 dark:text-transparent'
        content='Chưa có đánh giá nào'
        size={50}
        src={emptyDiscussion.src}
      />
    );

  return (
    <div className='mt-12 flex flex-col justify-between gap-8'>
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
}
