'use client';

import { PortalDropdown } from '@/components/dropdown/portal-dropdown';
import { ROOM_KIND_PRIVATE, ROOM_STATE_ENDED } from '@/constants';
import { route } from '@/routes';
import { useRoomStore } from '@/store';
import { copyTextToClipboard, generateSlug, notify } from '@/utils';
import { FaCopy, FaLink } from 'react-icons/fa6';

export function ButtonShare() {
  const room = useRoomStore((state) => state.room);
  const isEnded = room?.state === ROOM_STATE_ENDED;
  const isPrivate = room?.kind === ROOM_KIND_PRIVATE;

  const handleCopyLink = async () => {
    if (!room) return;

    const text = `${window.location.origin}${route.room.path}/${generateSlug(room.name)}.${room.id}`;

    const ok = await copyTextToClipboard(text);
    if (ok) notify.success('Đã sao chép liên kết phòng');
    else notify.error('Không thể sao chép liên kết phòng');
  };

  const handleCopyRoomId = async () => {
    if (!room) return;

    const ok = await copyTextToClipboard(room.code);
    if (ok) notify.success('Đã sao chép mã phòng');
    else notify.error('Không thể sao chép mã phòng');
  };

  if (isEnded || isPrivate) return null;

  return (
    <PortalDropdown
      align='left'
      offsetX={-50}
      className='bg-eerie-black border-black-alpha-8 flex min-w-48 flex-col overflow-hidden rounded-xl border border-solid py-2 text-sm shadow-[0_20px_20px_10px_var(--color-transparent-black-3)]'
      trigger={
        <button className='hover:text-golden-glow inline-flex cursor-pointer items-center gap-2 transition-colors duration-200 ease-linear'>
          <FaLink />
          <span className='max-800:hidden'>Chia sẻ</span>
        </button>
      }
    >
      {(close) => (
        <>
          <button
            onClick={async () => {
              await handleCopyLink();
              close();
            }}
            className='hover:bg-transparent-black-8 flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-white transition-colors duration-200 ease-linear'
          >
            <FaLink className='text-gray-400' />
            <span>Sao chép liên kết</span>
          </button>
          <button
            onClick={async () => {
              await handleCopyRoomId();
              close();
            }}
            className='hover:bg-transparent-black-8 flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-white transition-colors duration-200 ease-linear'
          >
            <FaCopy className='text-gray-400' />
            <span>Sao chép mã phòng</span>
          </button>
        </>
      )}
    </PortalDropdown>
  );
}
