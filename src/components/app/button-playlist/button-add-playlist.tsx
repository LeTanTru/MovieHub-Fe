'use client';

import PlaylistModal from './playlist-modal';
import { Button, ToolTip } from '@/components/form';
import { useDisclosure } from '@/hooks';
import { cn } from '@/lib';
import { FaPlus } from 'react-icons/fa6';

export default function ButtonAddPlayList({
  className,
  text,
  showText
}: {
  className?: string;
  text?: string;
  showText?: boolean;
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
      {showText ? (
        <Button
          variant='outline'
          className={cn(
            'hover:text-golden-glow hover:border-golden-glow',
            className
          )}
          onClick={handleOpen}
        >
          <FaPlus />
          {text || 'Thêm danh sách phát'}
        </Button>
      ) : (
        <ToolTip
          className='bg-white text-center text-black [&>span>svg]:w-4 [&>span>svg]:fill-white'
          title={text || 'Thêm danh sách phát'}
        >
          <Button
            variant='outline'
            className={cn(
              'hover:text-golden-glow! hover:border-golden-glow! h-7 w-7 rounded-full p-0!',
              className
            )}
            onClick={handleOpen}
          >
            <FaPlus />
          </Button>
        </ToolTip>
      )}
      <PlaylistModal opened={opened} onClose={handleClose} />
    </>
  );
}
