import CommentItem from './comment-item';
import { CommentResType } from '@/types';

export default function CommentList({
  comments
}: {
  comments: CommentResType[];
}) {
  return (
    <div className='mt-12 flex flex-col justify-between gap-8'>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
