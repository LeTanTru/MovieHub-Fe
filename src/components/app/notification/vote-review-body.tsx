import { AvatarField, ImageField } from '@/components/form';
import { DISCUSSION_TAB_REVIEW } from '@/constants';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { NotificationResType, VoteReviewNotificationType } from '@/types';
import {
  convertUTCToLocal,
  generateSlug,
  parseJSON,
  renderImageUrl,
  timeAgo
} from '@/utils';
import Link from 'next/link';
import { useMemo } from 'react';

export default function VoteReviewBody({
  notification
}: {
  notification: NotificationResType;
}) {
  const body = useMemo(
    () => parseJSON<VoteReviewNotificationType>(notification.body),
    [notification.body]
  );

  const setDiscussionTab = useMovieStore((s) => s.setDiscussionTab);

  const handleClick = () => {
    setDiscussionTab(DISCUSSION_TAB_REVIEW);
  };

  return (
    <Link
      onClick={handleClick}
      className='flex flex-1 items-center justify-between gap-2 pl-1'
      href={`${route.movie.path}/${generateSlug(body.movieTitle)}.${body.movieId}`}
    >
      <div className='flex flex-1 items-center gap-2'>
        <div className='flex w-10 shrink-0 justify-center'>
          <AvatarField
            size={40}
            src={renderImageUrl(body?.author?.avatarPath)}
            alt={body?.author?.fullName || body?.author?.username}
            disablePreview
          />
        </div>
        <div className='flex flex-1 flex-col justify-between gap-2'>
          <h3 className='line-clamp-2' title={notification.title}>
            {notification.title}&nbsp;trong phim&nbsp;
            <span className='text-golden-glow font-semibold'>
              {body?.movieTitle}
            </span>
          </h3>
          <div
            className='text-muted-foreground shrink-0 text-xs'
            title={convertUTCToLocal(notification.createdDate)}
          >
            {timeAgo(notification.createdDate)}
          </div>
        </div>
      </div>
      <div className='relative w-20 shrink-0'>
        <ImageField
          src={renderImageUrl(body?.movieThumbnail)}
          alt={body?.movieTitle}
          aspect={16 / 9}
          disablePreview
        />
      </div>
    </Link>
  );
}
