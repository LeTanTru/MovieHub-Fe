import ImageField from '@/components/form/image-field';
import { route } from '@/routes';
import { MovieItemNotificationType, NotificationResType } from '@/types';
import { convertUTCToLocal, parseJSON, renderImageUrl, timeAgo } from '@/utils';
import Link from 'next/link';
import { useMemo } from 'react';

export default function MovieItemBody({
  notification
}: {
  notification: NotificationResType;
}) {
  const body = useMemo(
    () => parseJSON<MovieItemNotificationType>(notification.body),
    [notification.body]
  );

  const handleClick = () => {};

  return (
    <Link
      onClick={handleClick}
      className='flex flex-1 items-center justify-between gap-2 pl-2'
      href={`${route.watch.path}/${body.movie.slug}.${body.movie.id}`}
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
            {body.movie.title} - {body.movie.originalTitle}
          </span>

          <p className='mt-1'>
            Ngày chiếu: {convertUTCToLocal(body.releaseDate)}
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
