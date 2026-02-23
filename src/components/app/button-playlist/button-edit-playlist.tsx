'use client';

import PlaylistModal from './playlist-modal';
import { Button, ToolTip } from '@/components/form';
import { useDisclosure } from '@/hooks';
import { PlaylistResType } from '@/types';
import { FaPen } from 'react-icons/fa6';

export default function ButtonEditPlaylist({
  playlist
}: {
  playlist: PlaylistResType;
}) {
  const { opened, open, close } = useDisclosure();

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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
        <Button
          className='hover:text-golden-glow hover:border-golden-glow h-fit! rounded-full p-0!'
          onClick={handleOpen}
          variant='ghost'
        >
          <FaPen className='size-3.5' />
        </Button>
      </ToolTip>
      <PlaylistModal
        opened={opened}
        onClose={handleClose}
        playlist={playlist}
      />
    </>
  );
}
