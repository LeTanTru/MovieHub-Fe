import { ImageField } from '@/components/form';
import { route } from '@/routes';
import { NotificationResType, MovieNotificationType } from '@/types';
import { convertUTCToLocal, parseJSON, renderImageUrl, timeAgo } from '@/utils';
import Link from 'next/link';
import { useMemo } from 'react';

export default function MovieBody({
  notification
}: {
  notification: NotificationResType;
}) {
  const body = useMemo(
    () => parseJSON<MovieNotificationType>(notification.body),
    [notification.body]
  );

  const handleClick = () => {};

  return (
    <Link
      onClick={handleClick}
      className='flex flex-1 items-center justify-between gap-2 pl-1'
      href={`${route.movie.path}/${body.slug}.${body.id}`}
    >
      <div className='relative w-20 shrink-0'>
        <ImageField
          src={renderImageUrl(body?.thumbnailUrl)}
          alt={body?.title}
          aspect={16 / 9}
          disablePreview
        />
      </div>
      <div className='flex flex-1 flex-col justify-between gap-2'>
        <h3 className='line-clamp-2' title={notification.title}>
          <span>{notification.title}: Phim </span>

          <span className='font-medium'>
            {body?.title} - {body.originalTitle}
          </span>

          <p className='mt-1'>
            Ngày chiếu: {convertUTCToLocal(body?.releaseDate)}
          </p>
        </h3>
        <div
          className='text-muted-foreground shrink-0 text-xs'
          title={convertUTCToLocal(notification.createdDate)}
        >
          {timeAgo(notification.createdDate)}
        </div>
      </div>
    </Link>
  );
}
