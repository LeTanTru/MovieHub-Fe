import CommentForm from './comment-form';
import { CommentResType, ProfileResType } from '@/types';
import { AnimatePresence, m } from 'framer-motion';

type CommentReplyProps = {
  comment: CommentResType;
  rootId: string;
  author: ProfileResType;
  replyingComment: CommentResType | null;
  editingComment: CommentResType | null;
  onReplySubmit: () => Promise<void>;
  onCancel: () => void;
};

export default function CommentReply({
  comment,
  rootId,
  author,
  replyingComment,
  editingComment,
  onReplySubmit,
  onCancel
}: CommentReplyProps) {
  return (
    <AnimatePresence initial={false}>
      {(replyingComment?.id === comment.id ||
        editingComment?.id === comment.id) && (
        <m.div
          key='comment-form'
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.1, ease: 'linear' }}
        >
          <CommentForm
            parentId={rootId}
            movieId={comment.movieId}
            mode={editingComment?.id === comment.id ? 'edit' : 'reply'}
            defaultMention={`@${author.fullName}`}
            onSubmit={onReplySubmit}
            onCancel={onCancel}
          />
        </m.div>
      )}
    </AnimatePresence>
  );
}
