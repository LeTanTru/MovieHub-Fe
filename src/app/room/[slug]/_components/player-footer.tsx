'use client';

import { AvatarField } from '@/components/form';
import { Skeleton } from '@/components/ui/skeleton';
import { ROOM_STATE_RUNNING } from '@/constants';
import { cn } from '@/lib';
import { route } from '@/routes';
import { useRoomStore } from '@/store';
import {
  copyTextToClipboard,
  generateSlug,
  notify,
  renderImageUrl,
  timeAgo
} from '@/utils';
import Link from 'next/link';
import { FaPlayCircle } from 'react-icons/fa';
import { FaEye, FaLink } from 'react-icons/fa6';

export function PlayerFooter() {
  const room = useRoomStore((state) => state.room);

  if (!room) return <PlayerFooter.Skeleton />;

  const movieItem = room.movieItem;

  const isLive = room.state === ROOM_STATE_RUNNING;

  const handleCopyText = async () => {
    const text = `${window.location.origin}${route.room.path}/${generateSlug(room.name)}.${room.id}`;

    const ok = await copyTextToClipboard(text);
    if (ok) notify.success('Đã sao chép link phòng');
    else notify.error('Không thể sao chép link phòng');
  };

  return (
    <div className='bg-transparent-black-b0 relative flex h-20 shrink-0 items-center justify-between gap-2 px-6'>
      <div className='flex w-full items-center justify-between gap-8'>
        <div className='inline-flex grow items-center gap-2 text-white'>
          <div
            className={cn('relative shrink-0 overflow-hidden rounded-full', {
              'live-avatar bg-charade border-2 border-solid border-red-500':
                isLive
            })}
          >
            <AvatarField
              src={renderImageUrl(room.host.avatarPath)}
              size={40}
              className={cn({ 'scale-80': isLive })}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <span>{room.host.username || room.host.fullName}</span>
            <span className='text-dark-gray text-xs'>
              {timeAgo(room.createdDate)}
            </span>
          </div>
        </div>
        <div className='inline-flex items-center gap-2'>
          <FaEye />
          <span>{room.participantCount}</span>
        </div>
        <div
          onClick={handleCopyText}
          className='hover:text-golden-glow inline-flex cursor-pointer items-center gap-2 transition-colors duration-200 ease-linear'
        >
          <FaLink />
          <span>Chia sẻ</span>
        </div>
        <Link
          href={`${route.movie.path}/${movieItem.movie.slug}.${movieItem.movie.id}`}
          className='hover:text-golden-glow inline-flex cursor-pointer items-center gap-2 transition-colors duration-200 ease-linear'
        >
          <FaPlayCircle />
          <span>Xem riêng</span>
        </Link>
      </div>
    </div>
  );
}

PlayerFooter.Skeleton = function PlayerFooterSkeleton() {
  return (
    <div className='bg-transparent-black-b0 relative flex h-20 shrink-0 items-center justify-between gap-2 px-6'>
      <div className='flex w-full items-center justify-between gap-8'>
        <div className='inline-flex grow items-center gap-2'>
          <Skeleton className='bg-transparent-black-8 skeleton size-10 rounded-full!' />
          <div className='flex flex-col gap-1'>
            <Skeleton className='bg-transparent-black-8 skeleton h-3.5 w-24 rounded!' />
            <Skeleton className='bg-transparent-black-8 skeleton h-3 w-16 rounded!' />
          </div>
        </div>
        <Skeleton className='bg-transparent-black-8 skeleton h-4 w-10 rounded!' />
        <Skeleton className='bg-transparent-black-8 skeleton h-4 w-16 rounded!' />
        <Skeleton className='bg-transparent-black-8 skeleton h-4 w-20 rounded!' />
      </div>
    </div>
  );
};
