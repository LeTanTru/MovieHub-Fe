'use client';

import {
  MOVIE_TYPE_SINGLE,
  ROOM_STATE_PENDING,
  ROOM_STATE_RUNNING
} from '@/constants';
import { Button } from '@/components/form';
import { ButtonEnd } from './button-end';
import { ButtonLeave } from './button-leave';
import { ButtonStart } from './button-start';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useNavigate } from '@/hooks';
import { useRoomStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function PlayerHeader() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const { room, isJoined } = useRoomStore(
    useShallow((state) => ({ room: state.room, isJoined: state.isJoined }))
  );

  if (!room || !profile) return <PlayerHeader.Skeleton />;

  const isRunning = room.state === ROOM_STATE_RUNNING;
  const isPending = room.state === ROOM_STATE_PENDING;
  const isHost = room.host.id === profile.id;

  const movieItem = room.movieItem;

  const renderMovieTitle = () => {
    const movie = movieItem?.movie;

    if (!movie) return null;

    const isSingle = movie.type === MOVIE_TYPE_SINGLE;

    if (isSingle) {
      return `Phần ${movieItem?.label} - Tập full`;
    }

    return `Phần ${movieItem?.label} - Tập ${movieItem?.season?.label}`;
  };

  return (
    <div className='bg-transparent-black-b0 sticky top-0 z-4 flex h-17.5 shrink-0 items-center justify-start gap-2 px-6'>
      <Button
        variant='ghost'
        className='size-7.5! rounded-full border border-solid border-white px-0! hover:bg-transparent hover:opacity-80'
        onClick={() => navigate.back()}
      >
        <ChevronLeft className='size-5' />
      </Button>
      <div className='flex grow flex-col gap-0.5'>
        <div className='font-semibold text-white'>{room?.name}</div>
        <div className='text-dark-gray flex items-center gap-2 text-xs'>
          <div className=''>{renderMovieTitle()}</div>
          <div className='bg-dark-gray size-1 rounded-full'></div>
          <div className=''>{movieItem?.title}</div>
        </div>
      </div>
      {isPending && isHost && <ButtonStart />}
      {isRunning && isHost && <ButtonEnd />}
      {isRunning && isJoined && <ButtonLeave />}
    </div>
  );
}

PlayerHeader.Skeleton = function PlayerHeaderSkeleton() {
  return (
    <div className='bg-transparent-black-b0 sticky top-0 z-4 flex h-17.5 shrink-0 items-center justify-start gap-2 px-6'>
      <Skeleton className='bg-transparent-black-8 skeleton size-7.5! rounded-full! border border-solid border-white/30' />
      <div className='flex grow flex-col gap-2'>
        <Skeleton className='bg-transparent-black-8 skeleton h-4 w-48 rounded!' />
        <Skeleton className='bg-transparent-black-8 skeleton h-3 w-64 rounded!' />
      </div>
      <Skeleton className='bg-transparent-black-8 skeleton h-8 w-28 rounded-full!' />
    </div>
  );
};
