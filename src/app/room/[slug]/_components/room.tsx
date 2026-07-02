'use client';

import { Chat } from './chat';
import { cn } from '@/lib';
import { Container } from '@/components/layout';
import { ErrorCode } from '@/constants';
import { getIdFromSlug } from '@/utils';
import { NotFound } from './not-found';
import { RoomMqtt } from './room-mqtt';
import { useAuth, useIsomorphicLayoutEffect } from '@/hooks';
import { useParams } from 'next/navigation';
import { useRoomQuery } from '@/queries';
import { useRoomStore, useChatStore } from '@/store';
import { Watch } from './watch';

export function Room() {
  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);

  const { isAuthenticated } = useAuth();
  const toggleHeader = useChatStore((state) => state.toggleHeader);

  const { data: roomData, isLoading } = useRoomQuery({
    id,
    enabled: !!id && isAuthenticated
  });

  // const { data: chatListData, isLoading: chatListLoading} =

  const room = roomData?.data;
  const errorCode = roomData?.code;

  const setRoom = useRoomStore((state) => state.setRoom);

  useIsomorphicLayoutEffect(() => {
    if (room) {
      setRoom(room);
    }
  }, [room, setRoom]);

  useIsomorphicLayoutEffect(() => {
    if (room) {
      document.title = `Xem chung phim ${room.movieItem.movie.title} | MovieHub`;
    }

    return () => {
      document.title = 'Xem chung phim | MovieHub';
    };
  }, [room]);

  if (errorCode === ErrorCode.ROOM_ERROR_NOT_FOUND) {
    return <NotFound />;
  }

  if (isLoading || !room) return <Room.Skeleton />;

  return (
    <Container
      className={cn('transition-all duration-100 ease-linear', {
        'min-h-screen pt-0': toggleHeader,
        'min-h-page-height pt-header max-1680:min-h-screen max-1680:pt-0':
          !toggleHeader
      })}
    >
      <div
        className={cn(
          'scrollbar-none max-800:flex-col max-800:h-dvh max-800:justify-between relative flex w-full items-start justify-between overflow-auto bg-black transition-all duration-100 ease-linear',
          {
            'h-screen': toggleHeader,
            'h-page-height max-1680:h-screen': !toggleHeader
          }
        )}
      >
        <Watch />
        <Chat />
        <RoomMqtt room={room} />
      </div>
    </Container>
  );
}

Room.Skeleton = function RoomSkeleton() {
  const toggleHeader = useChatStore((state) => state.toggleHeader);

  return (
    <Container
      className={cn('transition-all duration-100 ease-linear', {
        'min-h-screen pt-0': toggleHeader,
        'min-h-page-height pt-header max-1680:min-h-screen max-1680:pt-0':
          !toggleHeader
      })}
    >
      <div
        className={cn(
          'scrollbar-none max-800:flex-col max-800:h-dvh max-800:justify-between relative flex w-full items-start justify-between overflow-auto bg-black transition-all duration-100 ease-linear',
          {
            'h-screen': toggleHeader,
            'h-page-height max-1680:h-screen': !toggleHeader
          }
        )}
      >
        <Watch.Skeleton />
        <Chat.Skeleton />
      </div>
    </Container>
  );
};
