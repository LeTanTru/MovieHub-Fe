'use client';

import PlaylistModal from './playlist-modal';
import { ToolTip } from '@/components/form';
import { useDisclosure } from '@/hooks';
import { PlaylistResType } from '@/types';
import { FaRegEdit } from 'react-icons/fa';

export default function ButtonEditPlaylist({
  playlist
}: {
  playlist: PlaylistResType;
}) {
  const { opened, open, close } = useDisclosure();

  const handleOpen = () => {
    open();
  };

  const handleClose = () => {
    close();
  };

  return (
    <>
      <ToolTip
        title='Cập nhật danh sách phát'
        className='bg-white text-center text-black [&>span>svg]:w-4 [&>span>svg]:fill-white'
      >
        <button
          className='hover:text-light-golden-yellow hover:border-light-golden-yellow rounded-full'
          onClick={handleOpen}
        >
          <FaRegEdit />
        </button>
      </ToolTip>
      <PlaylistModal
        opened={opened}
        onClose={handleClose}
        playlist={playlist}
      />
    </>
  );
}
