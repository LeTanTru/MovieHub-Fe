'use client';

import { Button } from '@/components/form';
import { ConfirmModal } from '@/components/modal';
import { ErrorCode, mqttCMDs, mqttTopics, queryKeys } from '@/constants';
import { useAuth } from '@/hooks';
import { logger } from '@/logger';
import { useJoinRoomMutation, useStartRoomMutation } from '@/queries';
import { useRoomStore } from '@/store';
import {
  generateMqttTopic,
  getIdFromSlug,
  invalidateQueries,
  notify,
  publishMqttMessage
} from '@/utils';
import { useParams } from 'next/navigation';
import { FaPlay } from 'react-icons/fa6';

export function ButtonStart() {
  const { profile } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);

  const setIsJoined = useRoomStore((state) => state.setIsJoined);
  const { mutate: startRoom, isPending } = useStartRoomMutation();
  const { mutate: joinRoom } = useJoinRoomMutation();

  const handleStartRoom = () => {
    startRoom(id, {
      onSuccess: (res) => {
        if (res.result) {
          setIsJoined(true);
          invalidateQueries(
            [queryKeys.ROOM, id],
            [queryKeys.ROOM_LIST],
            [queryKeys.MY_ROOM_LIST]
          );
          joinRoom(id, {
            onSuccess: async (res) => {
              if (res.result) {
                notify.success('Tham gia phòng thành công');
                await publishMqttMessage(
                  generateMqttTopic(mqttTopics.ROOM, { roomId: id }),
                  {
                    cmd: mqttCMDs.PARTICIPANT_JOIN,
                    data: { id: profile?.id || '' }
                  }
                );
                setIsJoined(true);
              }
            },
            onError: (error) => {
              logger.error('[JOIN_ROOM_ERROR]', error);
              notify.error('Tham gia phòng thất bại');
            }
          });
          notify.success('Bắt đầu phòng thành công');
        } else {
          const errorCode = res.code;
          if (errorCode === ErrorCode.ROOM_ERROR_INVALID_ROOM) {
            notify.error(
              'Bạn đã có một phòng đang diễn ra, vui lòng kết thúc phòng trước khi bắt đầu phòng mới'
            );
          } else if (errorCode === ErrorCode.ROOM_ERROR_INVALID_TIME) {
            notify.error(
              'Phòng này chưa đến thời gian bắt đầu, vui lòng thử lại sau'
            );
          } else {
            notify.error('Bắt đầu phòng thất bại');
          }
        }
      },
      onError: (error) => {
        logger.error('[START_ROOM_ERROR]', error);
        notify.error('Bắt đầu phòng thất bại');
      }
    });
  };

  return (
    <ConfirmModal
      message='Bạn có chắn chắn muốn bắt đầu phòng này không ?'
      onConfirm={handleStartRoom}
      triggerClassName='w-fit'
      trigger={
        <Button
          className='rounded-full'
          loading={isPending}
          disabled={isPending}
          size='sm'
        >
          <FaPlay />
          <span className='max-800:hidden'>Bắt đầu</span>
        </Button>
      }
    />
  );
}
