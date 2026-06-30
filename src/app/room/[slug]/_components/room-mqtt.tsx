'use client';

import {
  generateMqttTopic,
  invalidateQueries,
  notify,
  publishMqttMessage
} from '@/utils';
import { getMqttClient } from '@/lib/mqtt';
import { logger } from '@/logger';
import {
  mqttCMDs,
  mqttTopics,
  queryKeys,
  ROOM_STATE_RUNNING
} from '@/constants';
import {
  RoomEndType,
  RoomResType,
  RoomUpdateParticipantCountType
} from '@/types';
import { useEffect } from 'react';
import { useMqtt, useMqttSubscribe } from '@/hooks';
import { useRoomStore } from '@/store';
import { useShallow } from 'zustand/shallow';

const PING_INTERVAL = 10_000; // 10 seconds

type RoomMqttProps = {
  room: RoomResType;
};

export function RoomMqtt({ room }: RoomMqttProps) {
  const client = getMqttClient();
  const isRunning = room.state === ROOM_STATE_RUNNING;
  const { setParticipantCount } = useRoomStore(
    useShallow((state) => ({
      setParticipantCount: state.setParticipantCount
    }))
  );

  // Send ping to the room every 10 seconds to keep the connection alive
  useEffect(() => {
    if (!isRunning) return;

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

    const interval = setInterval(sendPing, PING_INTERVAL);
    return () => clearInterval(interval);
  }, [client, isRunning, room.host.id, room.id]);
  // Send ping to the room every 10 seconds to keep the connection alive

  // Subscribe to room topic when the room is running
  useMqttSubscribe(
    generateMqttTopic(mqttTopics.ROOM, { roomId: room.id }),
    isRunning
  );
  // Subscribe to room topic when the room is running

  // Subscribe to room-user topic for the host when the room is running
  useMqttSubscribe(
    generateMqttTopic(mqttTopics.ROOM_USER, {
      roomId: room.id,
      userId: room.host.id
    }),
    isRunning
  );
  // Subscribe to room-user topic for the host when the room is running

  // Handle room end event
  useMqtt<RoomEndType>({
    topic: generateMqttTopic(mqttTopics.ROOM, { roomId: room?.id || '' }),
    cmd: mqttCMDs.END_ROOM,
    callback: (payload) => {
      notify.info('Chủ phòng đã kết thúc buổi xem chung');
      invalidateQueries([queryKeys.ROOM, payload.roomId]);
    }
  });
  // Handle room end event

  // Handle room update participant count event
  useEffect(() => {
    setParticipantCount(room.participantCount);
  }, [room.participantCount, setParticipantCount]);

  useMqtt<RoomUpdateParticipantCountType>({
    topic: generateMqttTopic(mqttTopics.ROOM, { roomId: room?.id || '' }),
    cmd: mqttCMDs.UPDATE_PARTICIPANT_COUNT,
    callback: (payload) => {
      setParticipantCount(payload.currentViewers);
      invalidateQueries([queryKeys.ROOM, payload.roomId]);
    }
  });
  // Handle room update participant count event

  return null;
}
