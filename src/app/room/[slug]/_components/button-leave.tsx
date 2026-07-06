'use client';

import { Button } from '@/components/form';
import { ConfirmModal } from '@/components/modal';
import { mqttCMDs, mqttTopics, queryKeys } from '@/constants';
import { useAuth, useNavigate } from '@/hooks';
import { logger } from '@/logger';
import { useRoomStore } from '@/store';
import {
  generateMqttTopic,
  getIdFromSlug,
  invalidateQueries,
  notify,
  publishMqttMessage
} from '@/utils';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { useShallow } from 'zustand/shallow';

export function ButtonLeave() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { profile } = useAuth();

  const { room, isJoined, setIsJoined } = useRoomStore(
    useShallow((state) => ({
      room: state.room,
      isJoined: state.isJoined,
      setIsJoined: state.setIsJoined
    }))
  );

  const isHost = profile?.id === room?.host?.id;

  const handleLeaveRoom = async () => {
    setIsLoading(true);
    try {
      await publishMqttMessage(
        generateMqttTopic(mqttTopics.ROOM, { roomId: id }),
        {
          cmd: mqttCMDs.PARTICIPANT_LEFT,
          data: {
            accountId: profile?.id
          }
        }
      );
      notify.success('Rời phòng thành công');
      setIsJoined(false);

      invalidateQueries([queryKeys.ROOM_LIST], [queryKeys.MY_ROOM_LIST]);

      if (isHost) {
        navigate.back();
      }
    } catch (error) {
      logger.error('[END_ROOM_ERROR]', error);
      notify.error('Rời phòng thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isJoined || isHost || !profile?.id) return;

    const handleBeforeUnload = () => {
      publishMqttMessage(generateMqttTopic(mqttTopics.ROOM, { roomId: id }), {
        cmd: mqttCMDs.PARTICIPANT_LEFT,
        data: {
          accountId: profile.id
        }
      });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [id, isHost, isJoined, profile?.id]);

  return (
    <ConfirmModal
      message='Bạn có chắn chắn muốn rời phòng này không ?'
      onConfirm={handleLeaveRoom}
      triggerClassName='w-fit'
      trigger={
        <Button
          className='rounded-full'
          size='sm'
          disabled={isLoading}
          loading={isLoading}
        >
          <FaArrowRightFromBracket className='rotate-180' />
          <span className='max-800:hidden'>Rời phòng</span>
        </Button>
      }
    />
  );
}
