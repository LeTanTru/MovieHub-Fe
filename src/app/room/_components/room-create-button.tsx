'use client';

import { Button } from '@/components/form';
import { Modal } from '@/components/modal';
import { useDisclosure } from '@/hooks';
import { cn } from '@/lib';
import { PlusCircle, Podcast } from 'lucide-react';

type RoomCreateButtonProps = {
  className?: string;
};

export function RoomCreateButton({ className }: RoomCreateButtonProps) {
  const { opened, toggle } = useDisclosure();

  const handleToggle = () => {
    toggle();
  };

  return (
    <>
      <Button
        className={cn(
          'group flex items-center justify-center gap-2 rounded-4xl border border-white font-medium text-white backdrop-blur-[10px] hover:border-white/80 hover:text-white/80',
          className
        )}
        variant='outline'
        onClick={handleToggle}
      >
        <PlusCircle className='max-640:size-4 size-4.5 fill-white text-black group-hover:opacity-80' />
        Tạo mới
      </Button>
      <Modal
        open={opened}
        onClose={handleToggle}
        className='top-1/2 left-1/2 m-0 max-w-137.5'
        variants={{
          initial: { opacity: 0, x: '-50%', y: '-100%' },
          animate: { opacity: 1, x: '-50%', y: '-50%' },
          exit: { opacity: 0, x: '-50%', y: '-100%' }
        }}
      >
        <Modal.Header className='border-b'>
          <h3 className='text-base font-medium'>Tạo phòng xem chung</h3>
        </Modal.Header>
        <Modal.Body className='bg-charade p-4'>
          <h3 className='mb-4 text-center font-medium'>
            Hướng dẫn cách tạo phòng xem chung
          </h3>
          <div className='border-transparent-white-1 flex w-full flex-col border-t border-solid'>
            <div className='border-transparent-white-1 relative flex items-center gap-2 border-b border-solid px-4'>
              <div className='text-golden-glow w-7.5 shrink-0 text-3xl leading-none'>
                1
              </div>
              <div className='grow py-5 leading-[1.7] text-white'>
                Tìm phim bạn muốn xem chung.
              </div>
            </div>
            <div className='border-transparent-white-1 relative flex items-center gap-2 border-b border-solid px-4'>
              <div className='text-golden-glow w-7.5 shrink-0 text-3xl leading-none'>
                2
              </div>
              <div className='grow py-5 leading-[1.7] text-white'>
                Chuyển tới trang xem của tập phim đó, chọn biểu tượng&nbsp;
                <span className='inline-flex items-center gap-2 rounded-md border border-solid border-white px-2 py-1 align-middle'>
                  <Podcast className='size-5' />
                  Xem chung
                </span>
                <span className='align-middle'>
                  &nbsp;trên thanh công cụ phía dưới player.
                </span>
              </div>
            </div>
            <div className='border-transparent-white-1 relative flex items-center gap-2 border-b border-solid px-4'>
              <div className='text-golden-glow w-7.5 shrink-0 text-3xl leading-none'>
                3
              </div>
              <div className='grow py-5 leading-[1.7] text-white'>
                Điền thông tin và cài đặt thời gian chiếu.
              </div>
            </div>
            <div className='border-transparent-white-1 relative flex items-center gap-2 border-b border-solid px-4'>
              <div className='text-golden-glow w-7.5 shrink-0 text-3xl leading-none'>
                4
              </div>
              <div className='grow py-5 leading-[1.7] text-white'>
                Hoàn thành và chia sẻ cho bạn bè.
              </div>
            </div>
          </div>
          <Button onClick={handleToggle} className='mt-4 w-full'>
            Đã hiểu
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
