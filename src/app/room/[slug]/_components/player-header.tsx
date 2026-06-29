'use client';

import { Button } from '@/components/form';
import { MOVIE_TYPE_SINGLE, ROOM_STATE_PENDING } from '@/constants';
import { useNavigate } from '@/hooks';
import { useRoomStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';
import { FaPlay } from 'react-icons/fa6';

export function PlayerHeader() {
  const navigate = useNavigate();
  const room = useRoomStore((state) => state.room);

  if (!room) return <PlayerHeader.Skeleton />;

  const isPending = room.state === ROOM_STATE_PENDING;

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
      {isPending && (
        <Button className='rounded-full' size='sm'>
          <FaPlay />
          Bắt đầu
        </Button>
      )}
    </div>
  );
}

PlayerHeader.Skeleton = function () {
  return (
    <div className='bg-transparent-black-b0 sticky top-0 z-4 flex h-17.5 shrink-0 items-center justify-start gap-2 px-6'>
      <Skeleton className='bg-transparent-black-8 skeleton size-7.5! rounded-full border border-solid border-white/30' />
      <div className='flex grow flex-col gap-2'>
        <Skeleton className='bg-transparent-black-8 skeleton h-4 w-48 rounded' />
        <Skeleton className='bg-transparent-black-8 skeleton h-3 w-64 rounded' />
      </div>
      <Skeleton className='bg-transparent-black-8 skeleton h-8 w-28 rounded-full' />
    </div>
  );
};
