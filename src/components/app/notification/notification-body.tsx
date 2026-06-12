import { MovieBody } from './movie-body';
import { MovieItemBody } from './movie-item-body';
import { mqttCMDs } from '@/constants';
import { NotificationResType } from '@/types';
import { ReplyCommentBody } from './reply-comment-body';
import { ToxicCommentLockedBody } from './toxic-comment-locked-body';
import { VoteCommentBody } from './vote-comment-body';
import { VoteReviewBody } from './vote-review-body';

export function NotificationBody({
  notification
}: {
  notification: NotificationResType;
}) {
  switch (notification.cmd) {
    case mqttCMDs.NEW_MOVIE: {
      return <MovieBody notification={notification} />;
    }

    case mqttCMDs.NEW_MOVIE_ITEM: {
      return <MovieItemBody notification={notification} />;
    }

    case mqttCMDs.REPLY_COMMENT: {
      return <ReplyCommentBody notification={notification} />;
    }

    case mqttCMDs.TOXIC_COMMENT_LOCKED: {
      return <ToxicCommentLockedBody notification={notification} />;
    }

    case mqttCMDs.VOTE_COMMENT: {
      return <VoteCommentBody notification={notification} />;
    }

    case mqttCMDs.VOTE_REVIEW: {
      return <VoteReviewBody notification={notification} />;
    }

    default:
      return null;
  }
}
