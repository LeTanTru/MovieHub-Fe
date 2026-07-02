'use client';

import { mqttCMDs, mqttTopics } from '@/constants';
import { useAuth } from '@/hooks';
import { useRoomStore } from '@/store';
import { generateMqttTopic, publishMqttMessage } from '@/utils';
import { FaSyncAlt } from 'react-icons/fa';

export function ButtonSync() {
  const { profile } = useAuth();
  const room = useRoomStore((state) => state.room);

  const handleSyncTime = async () => {
    if (!profile?.id || !room?.id) return;

    await publishMqttMessage(
      generateMqttTopic(mqttTopics.ROOM, { roomId: room.id }),
      {
        cmd: mqttCMDs.ROOM_SYNC,
        data: { id: profile.id }
      }
    );
  };

  return (
    <button
      onClick={handleSyncTime}
      className='hover:text-golden-glow inline-flex cursor-pointer items-center gap-2 transition-colors duration-200 ease-linear'
    >
      <FaSyncAlt />
      <span className='max-800:hidden'>Đồng bộ</span>
    </button>
  );
}
