'use client';

import { ROOM_STATE_ENDING, ROOM_STATE_PENDING } from '@/constants';
import { route } from '@/routes';
import { useRoomStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { RoomResType } from '@/types';
import { renderImageUrl } from '@/utils';
import Link from 'next/link';
import { FaHourglassHalf, FaPlay, FaPodcast } from 'react-icons/fa6';

export function PlayerMain() {
  const room = useRoomStore((state) => state.room);

  if (!room) return <PlayerMain.Skeleton />;

  const isPending = room.state === ROOM_STATE_PENDING;
  const isEnded = room.state === ROOM_STATE_ENDING;

  return (
    <div className='relative flex grow items-center bg-transparent'>
      {isPending && <PopupPending room={room} />}
      {isEnded && <PopupEnded room={room} />}
      <div className='relative size-full grow'>
        <div
          className='absolute inset-0 size-full bg-cover object-contain opacity-50'
          style={{
            backgroundImage: `url(${renderImageUrl(room.movieItem.thumbnailUrl)})`
          }}
        ></div>
      </div>
    </div>
  );
}

PlayerMain.Skeleton = function PlayerMainSkeleton() {
  return (
    <div className='relative flex grow items-center bg-transparent'>
      <div className='relative size-full grow'>
        <Skeleton className='skeleton bg-gunmetal-blue absolute inset-0 size-full opacity-50' />
      </div>
    </div>
  );
};

function PopupPending({ room }: { room: RoomResType }) {
  return (
    <div className='bg-transparent-black-2 border-black-alpha-8 absolute top-1/2 left-1/2 z-3 flex w-full max-w-110 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-2xl border border-solid p-8 text-center shadow-[0_20px_20px_10px_var(--color-transparent-black-3)] backdrop-blur-[20px]'>
      <div className='text-base'>Buổi xem chung</div>
      <div className='text-xl'>
        <span className='text-golden-glow font-semibold'>
          {room.movieItem.movie.title}
        </span>
      </div>
      <div className='inline-flex items-center gap-4'>
        <div className='flex items-center gap-2 rounded-md bg-white px-4 py-2 text-black'>
          <FaHourglassHalf className='live-pending' />
          <span>Đang chờ</span>
        </div>
      </div>
    </div>
  );
}

function PopupEnded({ room }: { room: RoomResType }) {
  return (
    <div className='bg-transparent-black-2 border-black-alpha-8 absolute top-1/2 left-1/2 z-3 flex w-full max-w-110 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-2xl border border-solid p-8 text-center shadow-[0_20px_20px_10px_var(--color-transparent-black-3)] backdrop-blur-[20px]'>
      <div className='text-base'>Đã chết thúc</div>
      <div className='text-xl'>
        <span className='text-golden-glow font-semibold'>
          {room.movieItem.movie.title}
        </span>
      </div>
      <div className='inline-flex items-center gap-4'>
        <Link
          href={`${route.movie.path}/${room.movieItem.movie.slug}.${room.movieItem.movie.id}`}
          className='flex items-center gap-2 rounded-md bg-white px-4 py-2 text-black'
        >
          <FaPlay />
          <span>Xem riêng</span>
        </Link>
        <Link
          href={route.room.path}
          className='flex items-center gap-2 rounded-md border border-solid border-white bg-transparent px-4 py-2 text-white'
        >
          <FaPodcast />
          <span>Phòng khác</span>
        </Link>
      </div>
    </div>
  );
}
