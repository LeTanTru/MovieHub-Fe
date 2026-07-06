import { AvatarField, ImageField } from '@/components/form';
import { DISCUSSION_TAB_REVIEW } from '@/constants';
import { route } from '@/routes';
import { useDiscussionTab } from '@/hooks';
import { useReviewStore } from '@/store';
import type { NotificationResType, VoteReviewNotificationType } from '@/types';
import {
  convertUTCToLocal,
  generateSlug,
  parseJSON,
  renderImageUrl,
  timeAgo
} from '@/utils';
import Link from 'next/link';
import { useMemo } from 'react';

export function VoteReviewBody({
  notification
}: {
  notification: NotificationResType;
}) {
  const body = useMemo(
    () => parseJSON<VoteReviewNotificationType>(notification.body),
    [notification.body]
  );

  const { setDiscussionTab } = useDiscussionTab();
  const setScrollTarget = useReviewStore((s) => s.setScrollTarget);

  const handleClick = () => {
    setDiscussionTab(DISCUSSION_TAB_REVIEW);
    if (body?.id) {
      setScrollTarget({ reviewId: body.id });
    }
  };

  return (
    <Link
      onClick={handleClick}
      className='max-480:flex-col max-480:gap-1 flex flex-1 items-center justify-between gap-2 pl-1'
      href={`${route.movie.path}/${generateSlug(body.movieTitle)}.${body.movieId}`}
    >
      <div className='flex flex-1 items-center gap-2'>
        <div className='max-640:w-8 max-520:w-7 flex w-10 shrink-0 justify-center'>
          <AvatarField
            size={40}
            src={renderImageUrl(body?.author?.avatarPath)}
            alt={body?.author?.fullName || body?.author?.username}
            disablePreview
          />
        </div>
        <div className='flex flex-1 flex-col justify-between gap-2'>
          <h3
            className='max-640:text-[13px] max-520:text-xs line-clamp-2'
            title={notification.title}
          >
            {notification.title}&nbsp;trong phim&nbsp;
            <span className='text-golden-glow font-semibold'>
              {body?.movieTitle}
            </span>
          </h3>
          <div
            className='text-muted-foreground max-640:text-[11px] shrink-0 text-xs'
            title={convertUTCToLocal(notification.createdDate)}
          >
            {timeAgo(notification.createdDate)}
          </div>
        </div>
      </div>
      <div className='max-480:hidden relative aspect-video w-20 shrink-0'>
        <ImageField
          src={renderImageUrl(body?.movieThumbnail)}
          alt={body?.movieTitle}
          aspect={16 / 9}
          disablePreview
          className='h-full'
        />
      </div>
    </Link>
  );
}
