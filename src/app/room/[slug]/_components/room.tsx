'use client';

import { useParams } from 'next/navigation';
import { Chat } from './chat';
import { Watch } from './watch';
import { getIdFromSlug } from '@/utils';
import { useRoomQuery } from '@/queries';
import { useRoomStore } from '@/store';
import { useIsomorphicLayoutEffect } from '@/hooks';

export function Room() {
  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);
  const { data: room } = useRoomQuery({ id, enabled: !!id });
  const setRoom = useRoomStore((state) => state.setRoom);

  useIsomorphicLayoutEffect(() => {
    if (room) {
      setRoom(room);
    }

    return () => {
      setRoom(null);
    };
  }, [room, setRoom]);

  useIsomorphicLayoutEffect(() => {
    if (room) {
      document.title = `Xem chung phim ${room.movieItem.movie.title} | MovieHub`;
    }

    return () => {
      document.title = 'Xem chung phim | MovieHub';
    };
  }, [room]);

  return (
    <div className='relative flex w-full items-start justify-between overflow-auto bg-black'>
      <Watch />
      <Chat />
    </div>
  );
}
