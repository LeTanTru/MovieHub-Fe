'use client';

import { Chat } from './chat';
import { generateMqttTopic, getIdFromSlug, publishMqttMessage } from '@/utils';
import { getMqttClient } from '@/lib/mqtt';
import {
  ErrorCode,
  mqttCMDs,
  mqttTopics,
  ROOM_STATE_RUNNING
} from '@/constants';
import { logger } from '@/logger';
import { NotFound } from './not-found';
import { useEffect } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks';
import { useParams } from 'next/navigation';
import { useRoomQuery } from '@/queries';
import { useRoomStore } from '@/store';
import { Watch } from './watch';

export function Room() {
  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);
  const { data: roomData, isLoading } = useRoomQuery({ id, enabled: !!id });
  const setRoom = useRoomStore((state) => state.setRoom);
  const client = getMqttClient();

  const room = roomData?.data;
  const errorCode = roomData?.code;

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

  useEffect(() => {
    if (!room || room.state !== ROOM_STATE_RUNNING) return;

    const sendPing = async () => {
      try {
        await publishMqttMessage(
          client,
          generateMqttTopic(mqttTopics.ROOM, { roomId: room.id }),
          {
            cmd: mqttCMDs.CLIENT_PING,
            data: { accountId: room.host.id }
          }
        );
        logger.info('[MQTT] Ping room sent');
      } catch (err) {
        logger.error('[MQTT] Ping room failed', err);
      }
    };

    sendPing();
    const interval = setInterval(sendPing, 10_000);

    return () => clearInterval(interval);
  }, [client, room]);

  if (isLoading) return <Room.Skeleton />;

  if (errorCode === ErrorCode.ROOM_ERROR_NOT_FOUND || !room) {
    return <NotFound />;
  }

  return (
    <div className='relative flex w-full items-start justify-between overflow-auto bg-black'>
      <Watch />
      <Chat />
    </div>
  );
}

Room.Skeleton = function RoomSkeleton() {
  return (
    <div className='relative flex w-full items-start justify-between overflow-auto bg-black'>
      <Watch.Skeleton />
      <Chat.Skeleton />
    </div>
  );
};
