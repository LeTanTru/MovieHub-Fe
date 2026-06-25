'use client';

import { AvatarField } from '@/components/form';
import {
  MOVIE_TYPE_SINGLE,
  ROOM_STATE_ENDING,
  ROOM_STATE_PENDING,
  ROOM_STATE_RUNNING
} from '@/constants';
import { cn } from '@/lib';
import { route } from '@/routes';
import { RoomResType } from '@/types';
import { convertUTCToLocal, renderImageUrl, timeAgo } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { EyeIcon, VideoOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type RoomCardProps = {
  room: RoomResType;
};

export function RoomCard({ room }: RoomCardProps) {
  const isPending = room.state === ROOM_STATE_PENDING;
  const isLive = room.state === ROOM_STATE_RUNNING;
  const isEnd = room.state === ROOM_STATE_ENDING;

  const renderMovieTitle = () => {
    const isSingle = room.movieItem.movie.type === MOVIE_TYPE_SINGLE;
    if (isSingle) {
      return `P.${room.movieItem.label} - T.${room.movieItem.label} - ${room.movieItem.movie.title}`;
    }

    return `P.${room.movieItem.season.label} - T.${room.movieItem.label} - ${room.movieItem.movie.title}`;
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='relative block h-0 w-full overflow-hidden rounded-md bg-transparent pb-[56.25%] select-none'>
        <div className='before:absolute before:inset-0 before:z-2 before:bg-[/dotted.webp] before:opacity-30 before:content-[""]'></div>
        {isPending && (
          <>
            <div className='absolute top-2 left-2 z-3 flex h-6 items-center gap-1 rounded bg-amber-600 px-1.5 text-xs leading-5 font-semibold text-white uppercase shadow-[0_0_5px_5px_var(--color-transparent-black-1)]'>
              <div className='live-flash block size-1.5 rounded-full bg-white before:content-[""]'></div>
              Đang chờ
            </div>
          </>
        )}
        {isLive && (
          <>
            <div className='bg-thunderbird absolute top-2 left-2 z-3 flex h-6 items-center gap-1 rounded px-1.5 text-xs leading-5 font-semibold text-white uppercase shadow-[0_0_5px_5px_var(--color-transparent-black-1)]'>
              <div className='live-flash block size-1.5 rounded-full bg-white before:content-[""]'></div>
              LIVE
            </div>
            <div className='bg-transparent-black-9 absolute bottom-2 left-2 z-3 flex items-center gap-1 rounded-sm border border-solid border-white px-2 py-1.5 text-xs font-semibold text-white shadow-[0_0_5px_5px_var(--color-transparent-black-1)] backdrop-blur-[10px]'>
              <EyeIcon className='size-4' />
              {room.participantCount} đang xem
            </div>
          </>
        )}
        {isEnd && (
          <div className='border-french-rose bg-transparent-black-9 text-french-rose absolute bottom-2 left-2 z-3 flex items-center gap-1 rounded-sm border border-solid px-2 py-1.5 text-xs font-semibold shadow-[0_0_5px_5px_var(--color-transparent-black-1)] backdrop-blur-[10px]'>
            <VideoOff className='fill-french-rose size-4' />
            Đã kết thúc
          </div>
        )}
        <Link
          href={`${route.room.path}/${room.id}`}
          className='absolute inset-0 z-3'
        ></Link>
        <Image
          src={renderImageUrl(room.movieItem.thumbnailUrl)}
          alt={room.movieItem.title}
          fill
          className='absolute inset-0 size-full origin-[center_center] scale-120 object-cover opacity-60 blur-[20px]'
        />
        <div
          className='room-mask absolute top-0 left-1/2 z-2 h-full w-[39%] -translate-x-1/2 bg-cover bg-top shadow-[0_10px_10px_0_var(--color-transparent-black-2)]'
          style={{
            backgroundImage: `url("${renderImageUrl(room.movieItem.movie.posterUrl)}")`
          }}
        ></div>
      </div>
      <div className='relative z-4 flex items-start gap-3'>
        <div
          className={cn('relative shrink-0 overflow-hidden rounded-full', {
            'live-avatar bg-charade border-2 border-solid border-red-500':
              isLive
          })}
        >
          <AvatarField
            src={renderImageUrl(room.host.avatarPath)}
            size={40}
            className={cn({
              'scale-80': isLive
            })}
          />
        </div>
        <div className='flex grow flex-col gap-1'>
          <h4 className='line-clamp-2 leading-normal font-medium'>
            {room.name}
          </h4>
          <h5 className='text-dark-gray line-clamp-1 text-xs'>
            {renderMovieTitle()}
          </h5>
          <div className='flex items-center gap-2'>
            <div className='text-dark-gray text-xs whitespace-nowrap'>
              <span>{room.host.fullName}</span>
            </div>
            <div className='size-1 rounded-full bg-white/19'></div>
            <div className='text-dark-gray text-xs whitespace-nowrap'>
              <span title={convertUTCToLocal(room.createdDate)}>
                {timeAgo(room.createdDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

RoomCard.Skeleton = function () {
  return (
    <div className='flex flex-col gap-3'>
      {/* Thumbnail */}
      <Skeleton className='bg-gunmetal-blue skeleton relative block h-0 w-full overflow-hidden rounded-md pb-[56.25%]' />

      {/* Info row */}
      <div className='flex items-start gap-3'>
        {/* Avatar */}
        <Skeleton className='bg-gunmetal-blue skeleton size-10 shrink-0 rounded-full' />

        {/* Text lines */}
        <div className='flex grow flex-col gap-2'>
          <Skeleton className='bg-gunmetal-blue skeleton h-4 w-3/4 rounded' />
          <Skeleton className='bg-gunmetal-blue skeleton h-3 w-1/2 rounded' />
          <div className='flex items-center gap-2'>
            <Skeleton className='bg-gunmetal-blue skeleton h-3 w-16 rounded' />
            <Skeleton className='bg-gunmetal-blue skeleton h-3 w-12 rounded' />
          </div>
        </div>
      </div>
    </div>
  );
};
