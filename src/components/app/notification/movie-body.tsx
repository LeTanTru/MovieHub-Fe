import { ImageField } from '@/components/form';
import { route } from '@/routes';
import type { NotificationResType, MovieNotificationType } from '@/types';
import { convertUTCToLocal, parseJSON, renderImageUrl, timeAgo } from '@/utils';
import Link from 'next/link';
import { useMemo } from 'react';

export function MovieBody({
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
      <div className='relative aspect-video w-20 shrink-0'>
        <ImageField
          src={renderImageUrl(body?.thumbnailUrl)}
          alt={body?.title}
          aspect={16 / 9}
          disablePreview
          className='h-full'
        />
      </div>
      <div className='flex flex-1 flex-col justify-between gap-2'>
        <h3
          className='max-640:text-[13px] line-clamp-2'
          title={notification.title}
        >
          <span>{notification.title}: Phim </span>

          <span className='font-medium'>
            {body?.title} - {body.originalTitle}
          </span>

          <p className='max-640:text-[13px] mt-1'>
            Ngày chiếu: {convertUTCToLocal(body?.releaseDate)}
          </p>
        </h3>
        <div
          className='text-muted-foreground max-640:text-xs shrink-0'
          title={convertUTCToLocal(notification.createdDate)}
        >
          {timeAgo(notification.createdDate)}
        </div>
      </div>
    </Link>
  );
}
