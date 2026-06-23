import { MovieBody } from './movie-body';
import { MovieItemBody } from './movie-item-body';
import { mqttCMDs } from '@/constants';
import { NotificationResType } from '@/types';
import { ReplyCommentBody } from './reply-comment-body';
import { ToxicCommentLockedBody } from './toxic-comment-locked-body';
import { ToxicReviewLockedBody } from './toxic-review-locked-body';
import { VoteCommentBody } from './vote-comment-body';
import { VoteReviewBody } from './vote-review-body';

export function NotificationBody({
  notification
}: {
  notification: NotificationResType;
}) {
  switch (notification.cmd) {
    case mqttCMDs.COMMENT_UNLOCKED:
    case mqttCMDs.TOXIC_COMMENT_LOCKED: {
      return <ToxicCommentLockedBody notification={notification} />;
    }

    case mqttCMDs.NEW_MOVIE_ITEM: {
      return <MovieItemBody notification={notification} />;
    }

    case mqttCMDs.NEW_MOVIE: {
      return <MovieBody notification={notification} />;
    }

    case mqttCMDs.REPLY_COMMENT: {
      return <ReplyCommentBody notification={notification} />;
    }

    case mqttCMDs.REVIEW_UNLOCKED:
    case mqttCMDs.TOXIC_REVIEW_LOCKED: {
      return <ToxicReviewLockedBody notification={notification} />;
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
