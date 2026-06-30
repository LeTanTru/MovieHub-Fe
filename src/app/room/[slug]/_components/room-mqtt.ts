'use client';

import { generateMqttTopic, publishMqttMessage } from '@/utils';
import { getMqttClient } from '@/lib/mqtt';
import { logger } from '@/logger';
import { mqttCMDs, mqttTopics, ROOM_STATE_RUNNING } from '@/constants';
import { RoomResType } from '@/types';
import { useEffect } from 'react';
import { useMqttSubscribe } from '@/hooks';

const PING_INTERVAL = 10_000; // 10 seconds

type RoomMqttProps = {
  room: RoomResType;
};

export function RoomMqtt({ room }: RoomMqttProps) {
  const client = getMqttClient();
  const isRunning = room.state === ROOM_STATE_RUNNING;

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

  // Subscribe to room topic when the room is running
  useMqttSubscribe(
    generateMqttTopic(mqttTopics.ROOM, { roomId: room.id }),
    isRunning
  );

  // Subscribe to room-user topic for the host when the room is running
  useMqttSubscribe(
    generateMqttTopic(mqttTopics.ROOM_USER, {
      roomId: room.id,
      userId: room.host.id
    }),
    isRunning
  );

  return null;
}
