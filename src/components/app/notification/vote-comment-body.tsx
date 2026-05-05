import { AvatarField, ImageField } from '@/components/form';
import { useQueryParams } from '@/hooks';
import { route } from '@/routes';
import { NotificationResType, VoteCommentNotificationType } from '@/types';
import {
  convertUTCToLocal,
  generatePath,
  parseJSON,
  renderImageUrl,
  renderListPageUrl,
  timeAgo
} from '@/utils';
import Link from 'next/link';
import { useMemo } from 'react';

export default function VoteCommentBody({
  notification
}: {
  notification: NotificationResType;
}) {
  const body = useMemo(
    () => parseJSON<VoteCommentNotificationType>(notification.body),
    [notification.body]
  );
  const { serializeParams } = useQueryParams();

  const handleClick = () => {};

  return (
    <Link
      onClick={handleClick}
      className='flex flex-1 items-center justify-between gap-2 pl-2'
      href={renderListPageUrl(
        generatePath(route.movie.path, {
          id: body?.movieId || ''
        }),
        serializeParams({
          movieTitle: body?.movieTitle
        })
      )}
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
            {notification.title}:&nbsp;
            <span className='font-semibold'>&quot;{body?.content}&quot;</span>
            &nbsp; trong phim {body.movieTitle}
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
