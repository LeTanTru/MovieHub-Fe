import { AvatarField, ImageField } from '@/components/form';
import { route } from '@/routes';
import type { NotificationResType, NotificationRoomInviteType } from '@/types';
import {
  convertUTCToLocal,
  generateSlug,
  parseJSON,
  renderImageUrl,
  timeAgo
} from '@/utils';
import Link from 'next/link';
import { useMemo } from 'react';

export function RoomInviteBody({
  notification
}: {
  notification: NotificationResType;
}) {
  const body = useMemo(
    () => parseJSON<NotificationRoomInviteType>(notification.body),
    [notification.body]
  );

  return (
    <Link
      className='flex flex-1 items-center justify-between gap-2 pl-1'
      href={`${route.room.path}/${generateSlug(body.name)}.${body.id}`}
    >
      <div className='flex flex-1 items-center gap-2'>
        <div className='flex w-10 shrink-0 justify-center'>
          <AvatarField
            size={40}
            src={renderImageUrl(body?.host?.avatarPath)}
            alt={body?.host?.fullName || body?.host?.username}
            disablePreview
          />
        </div>
        <div className='flex flex-1 flex-col justify-between gap-2'>
          <h3
            className='max-640:text-[13px] line-clamp-2'
            title={notification.title}
          >
            {notification.title}:&nbsp;
            <span className='text-golden-glow font-semibold'>{body?.name}</span>
            &nbsp;-&nbsp;
            <span className='font-medium'>{body?.movieTitle}</span>
          </h3>
          <div
            className='text-muted-foreground max-640:text-xs shrink-0'
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
