import { mqttCMDs } from '@/constants';
import { NotificationResType } from '@/types';
import MovieBody from './movie-body';
import MovieItemBody from './movie-item-body';
import ReplyCommentBody from './reply-comment-body';
import VoteCommentBody from './vote-comment-body';

export default function NotificationBody({
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

    case mqttCMDs.VOTE_COMMENT: {
      return <VoteCommentBody notification={notification} />;
    }

    default:
      return null;
  }
}
