'use client';

import { AvatarField } from '@/components/form';
import { ConfirmModal, Modal } from '@/components/modal';
import {
  mqttCMDs,
  mqttTopics,
  PARTICIPANT_ROLE_HOST,
  PARTICIPANT_STATE_JOINED,
  ROOM_STATE_ENDED,
  ROOM_STATE_RUNNING
} from '@/constants';
import { useAuth, useDisclosure } from '@/hooks';
import { logger } from '@/logger';
import { useRoomStore } from '@/store';
import type { ParticipantResType } from '@/types';
import {
  generateMqttTopic,
  notify,
  publishMqttMessage,
  renderImageUrl
} from '@/utils';
import { UserX } from 'lucide-react';
import { FaEye } from 'react-icons/fa6';
import { useShallow } from 'zustand/shallow';

export function ButtonViewParticipants() {
  const { room, participantCount, participants } = useRoomStore(
    useShallow((state) => ({
      room: state.room,
      participantCount: state.participantCount,
      participants: state.participants
    }))
  );

  const { profile } = useAuth();

  const { opened, open, close } = useDisclosure();

  const isHost = !!room && profile?.id === room.host.id;
  const isRunning = room?.state === ROOM_STATE_RUNNING;
  const isEnded = room?.state === ROOM_STATE_ENDED;

  // Live current viewers while running, total participants otherwise
  const viewerCount = isRunning
    ? participantCount
    : (room?.participantCount ?? 0);

  const displayedParticipants = isEnded
    ? participants
    : participants.filter(
        (participant) => participant.state === PARTICIPANT_STATE_JOINED
      );

  const handleKickParticipant = async (participant: ParticipantResType) => {
    if (!room) return;

    try {
      await publishMqttMessage(
        generateMqttTopic(mqttTopics.ROOM_USER, {
          roomId: room.id,
          userId: participant.user.id
        }),
        {
          cmd: mqttCMDs.KICK_PARTICIPANT,
          data: {
            roomId: room.id,
            targetUserId: participant.user.id
          }
        }
      );
      notify.success('Đã mời người dùng ra khỏi phòng');
    } catch (error) {
      logger.error('[KICK_PARTICIPANT_ERROR]', error);
      notify.error('Mời người dùng ra khỏi phòng thất bại');
    }
  };

  return (
    <>
      <button
        type='button'
        onClick={open}
        className='hover:text-golden-glow inline-flex cursor-pointer items-center gap-2 transition-colors duration-200 ease-linear'
      >
        <FaEye />
        <span>{viewerCount}</span>
      </button>

      <Modal
        open={opened}
        onClose={close}
        className='max-720:w-[90%] top-1/2 h-[50dvh] -translate-y-1/2'
      >
        <Modal.Header className='border-b'>
          {isEnded
            ? `Người tham gia (${displayedParticipants.length})`
            : `Người xem (${displayedParticipants.length})`}
        </Modal.Header>
        <Modal.Body scrollable className='max-h-[min(32.5rem,75vh)]'>
          <div className='flex flex-col gap-4 p-4'>
            {displayedParticipants.length === 0 && (
              <p className='text-dark-gray text-center'>Chưa có ai tham gia</p>
            )}
            {displayedParticipants.map((participant) => (
              <div
                key={participant.id}
                className='flex items-center justify-between gap-3'
              >
                <div className='flex items-center gap-3'>
                  <AvatarField
                    src={renderImageUrl(participant.user.avatarPath)}
                    size={36}
                  />
                  <div className='flex flex-col'>
                    <div className='flex items-center gap-1'>
                      <span>
                        {participant.user.username || participant.user.fullName}
                        &nbsp;
                        {participant.role === PARTICIPANT_ROLE_HOST && (
                          <span className='text-golden-glow text-xs'>
                            Chủ phòng
                          </span>
                        )}
                      </span>
                      <span className='text-xs'>
                        {participant.user.id === profile?.id && '(Bạn)'}
                      </span>
                    </div>
                    <span className='text-xs'>{participant.user.email}</span>
                  </div>
                </div>
                {isHost &&
                  isRunning &&
                  participant.role !== PARTICIPANT_ROLE_HOST && (
                    <ConfirmModal
                      message={`Bạn có chắc chắn muốn mời ${participant.user.username || participant.user.fullName} ra khỏi phòng không?`}
                      onConfirm={() => handleKickParticipant(participant)}
                      trigger={
                        <button
                          type='button'
                          className='shrink-0 cursor-pointer p-1 text-gray-400 transition-colors duration-200 ease-linear hover:text-rose-500'
                          title='Mời ra khỏi phòng'
                        >
                          <UserX className='size-4' />
                        </button>
                      }
                      triggerClassName='w-fit'
                    />
                  )}
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
