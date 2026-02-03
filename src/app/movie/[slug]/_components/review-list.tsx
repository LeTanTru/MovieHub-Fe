import ReviewItem from './review-item';
import { ReviewResType } from '@/types';

export default function ReviewList({ reviews }: { reviews: ReviewResType[] }) {
  return (
    <div className='mt-12 flex flex-col justify-between gap-8'>
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
}
