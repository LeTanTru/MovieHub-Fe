import { NoData } from '@/components/no-data';
import CommentItem from './comment-item';
import { CommentResType } from '@/types';
import { emptyDiscussion } from '@/assets';

export default function CommentList({
  comments
}: {
  comments: CommentResType[];
}) {
  if (!comments.length)
    return (
      <NoData
        className='dark:bg-background/30 mt-4 min-h-30 rounded-lg px-8 py-12 opacity-50'
        content='Chưa có đánh giá nào'
        size={50}
        src={emptyDiscussion.src}
      />
    );

  return (
    <div className='mt-12 flex flex-col justify-between gap-8'>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
