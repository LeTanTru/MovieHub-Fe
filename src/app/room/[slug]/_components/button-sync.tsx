'use client';

import { mqttCMDs, mqttTopics } from '@/constants';
import { cn } from '@/lib';
import { useAuth } from '@/hooks';
import { useRoomStore } from '@/store';
import { generateMqttTopic, publishMqttMessage } from '@/utils';
import { useEffect, useRef, useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';

const SYNC_COOLDOWN_SECONDS = 5;

export function ButtonSync() {
  const { profile } = useAuth();
  const room = useRoomStore((state) => state.room);

  const [cooldown, setCooldown] = useState(0);
  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  const startCooldown = () => {
    setCooldown(SYNC_COOLDOWN_SECONDS);
    if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
    cooldownIntervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSyncTime = async () => {
    if (cooldown > 0) return;
    if (!profile?.id || !room?.id) return;

    await publishMqttMessage(
      generateMqttTopic(mqttTopics.ROOM, { roomId: room.id }),
      {
        cmd: mqttCMDs.ROOM_SYNC,
        data: { id: profile.id }
      }
    );

    startCooldown();
  };

  return (
    <button
      onClick={handleSyncTime}
      disabled={cooldown > 0}
      className={cn(
        'hover:text-golden-glow inline-flex items-center gap-2 transition-colors duration-200 ease-linear',
        {
          'cursor-not-allowed opacity-60 hover:text-current': cooldown > 0,
          'cursor-pointer': cooldown === 0
        }
      )}
    >
      <FaSyncAlt />
      <span className='max-800:hidden'>
        {cooldown > 0 ? `Đồng bộ (${cooldown})` : 'Đồng bộ'}
      </span>
    </button>
  );
}
