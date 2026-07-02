'use client';

import { route } from '@/routes';
import { useRoomStore } from '@/store';
import Link from 'next/link';
import { FaPlayCircle } from 'react-icons/fa';

export function ButtonWatchAlone() {
  const room = useRoomStore((state) => state.room);

  if (!room) return null;

  const movieItem = room.movieItem;

  return (
    <Link
      href={`${route.movie.path}/${movieItem.movie.slug}.${movieItem.movie.id}`}
      className='hover:text-golden-glow inline-flex cursor-pointer items-center gap-2 transition-colors duration-200 ease-linear'
    >
      <FaPlayCircle />
      <span>Xem riêng</span>
    </Link>
  );
}
