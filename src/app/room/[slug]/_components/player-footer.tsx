'use client';

import { AvatarField } from '@/components/form';
import { ButtonAddParticipantModal } from './button-add-participant-modal';
import { ButtonShare } from './button-share';
import { ButtonSync } from './button-sync';
import { ButtonViewParticipants } from './button-view-participants';
import { ButtonWatchAlone } from './button-watch-alone';
import { cn } from '@/lib';
import { convertUTCToLocal, renderImageUrl, timeAgo } from '@/utils';
import { ROOM_STATE_RUNNING } from '@/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks';
import { useRoomStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function PlayerFooter() {
  const { profile } = useAuth();
  const { room } = useRoomStore(
    useShallow((state) => ({
      room: state.room
    }))
  );

  if (!room) return <PlayerFooter.Skeleton />;

  const isRunning = room.state === ROOM_STATE_RUNNING;
  const isParticipant = room.host.id !== profile?.id;
  const isHost = room.host.id === profile?.id;

  return (
    <div className='bg-transparent-black-b0 max-640:px-4 relative flex h-20 shrink-0 items-center justify-between gap-2 px-6'>
      <div className='flex w-full items-center justify-between gap-8'>
        <div className='inline-flex grow items-center gap-2 text-white'>
          <div
            className={cn('relative shrink-0 overflow-hidden rounded-full', {
              'live-avatar bg-charade border-2 border-solid border-red-500':
                isRunning
            })}
          >
            <AvatarField
              src={renderImageUrl(room.host.avatarPath)}
              size={40}
              className={cn({ 'scale-80': isRunning })}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <span>{room.host.username || room.host.fullName}</span>
            <span
              className='text-dark-gray text-xs'
              title={convertUTCToLocal(room.createdDate)}
            >
              {timeAgo(room.createdDate)}
            </span>
          </div>
        </div>
        <ButtonViewParticipants />
        <ButtonShare />
        <ButtonWatchAlone />
        {isParticipant && isRunning && <ButtonSync />}
        {isHost && isRunning && <ButtonAddParticipantModal />}
      </div>
    </div>
  );
}

PlayerFooter.Skeleton = function PlayerFooterSkeleton() {
  return (
    <div className='bg-transparent-black-b0 relative flex h-20 shrink-0 items-center justify-between gap-2 px-6'>
      <div className='flex w-full items-center justify-between gap-8'>
        <div className='inline-flex grow items-center gap-2'>
          <Skeleton className='bg-transparent-black-8 skeleton size-10 rounded-full!' />
          <div className='flex flex-col gap-1'>
            <Skeleton className='bg-transparent-black-8 skeleton h-3.5 w-24 rounded!' />
            <Skeleton className='bg-transparent-black-8 skeleton h-3 w-16 rounded!' />
          </div>
        </div>
        <Skeleton className='bg-transparent-black-8 skeleton h-4 w-10 rounded!' />
        <Skeleton className='bg-transparent-black-8 skeleton h-4 w-16 rounded!' />
        <Skeleton className='bg-transparent-black-8 skeleton h-4 w-20 rounded!' />
      </div>
    </div>
  );
};
