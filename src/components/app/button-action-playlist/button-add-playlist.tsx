'use client';

import PlaylistModal from './playlist-modal';
import { Button } from '@/components/form';
import { useDisclosure } from '@/hooks';
import { FaPlus } from 'react-icons/fa6';

export default function ButtonAddPlayList() {
  const { opened, open, close } = useDisclosure();

  const handleOpen = () => {
    open();
  };

  const handleClose = () => {
    close();
  };

  return (
    <>
      <Button
        variant='outline'
        className='hover:text-light-golden-yellow! hover:border-light-golden-yellow! rounded-full'
        onClick={handleOpen}
      >
        Thêm danh sách phát
        <FaPlus />
      </Button>
      <PlaylistModal opened={opened} onClose={handleClose} />
    </>
  );
}
