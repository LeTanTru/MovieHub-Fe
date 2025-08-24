import Link from 'next/link';
import './person-card.css';
import { Button } from '@/components/form';
import { FaHeart, FaPlay } from 'react-icons/fa6';
import { FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function MoviePersonModal({
  pos
}: {
  pos: { x: number; y: number } | null;
}) {
  return (
    <AnimatePresence>
      {pos && (
        <motion.div
          style={{
            top: `${pos.y}px`,
            left: `${pos.x}px`,
            position: 'absolute',
            zIndex: 50,
            transformOrigin: '50% 50%'
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className='bg-gunmetal-blue w-full max-w-105 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border-none leading-[1.5] text-white shadow-[0_5px_10px_0_rgba(0,_0,_0,_.2)]'
        >
          <div className='text-sm font-light text-white'>
            <div className='image-modal-mask relative bg-[url(https://static.nutscdn.com/vimg/500-0/2eef2b782d7a8b30997f1ad427521baa.jpg)] bg-cover bg-[50%]'>
              <div className='absolute top-0 right-0 bottom-0 left-0 z-3 flex flex-col items-start justify-end bg-[linear-gradient(20deg,rgba(47,51,70,.6),rgba(47,51,70,0))] p-4' />
              <div className='ratio-16x9 relative w-full before:block before:pt-[var(--bs-aspect-ratio)]' />
            </div>
            <div className='w-full bg-[linear-gradient(0deg,rgba(47,51,70,1),rgba(47,51,70,.7))] px-6 pt-0 pb-6'>
              <div className='mb-4'>
                <h3 className='font-semibold text-shadow-[0_0_3px_#00000030]'>
                  Avicii – Tôi là Tim
                </h3>
                <h3 className='text-light-golden-yellow mb-0 text-sm text-xs leading-[1.5] font-normal'>
                  Avicii: I&apos;m Tim
                </h3>
              </div>
              <div className='mb-5 flex items-stretch justify-between gap-2.5'>
                <Link href={'/'} className='block flex-grow-1'>
                  <Button className='bg-light-golden-yellow color text-background border-light-golden-yellow w-full border'>
                    <FaPlay />
                    Xem ngay
                  </Button>
                </Link>
                <Link href={'/'} className='block flex-grow-1'>
                  <Button className='w-full border border-white/50 bg-transparent! text-white'>
                    <FaHeart />
                    Thích
                  </Button>
                </Link>
                <Link href={'/'} className='block flex-grow-1'>
                  <Button className='w-full border border-white/50 bg-transparent! text-white'>
                    <FaInfoCircle />
                    Chi tiết
                  </Button>
                </Link>
              </div>
              <div className='mb-3 flex flex-wrap items-center justify-start gap-[5px]'>
                <div className='flex flex-shrink-0 items-center overflow-hidden rounded bg-white px-2 text-xs leading-[26px] font-medium text-black'>
                  <span className='leading-[20px]'>
                    <strong>T18</strong>
                  </span>
                </div>
                <div className='bg-transparent-white inline-flex h-[22px] items-center rounded border-none px-1.5 text-xs text-white'>
                  2024
                </div>
              </div>
              <div className='mt-2 mb-3 flex flex-wrap items-center justify-start gap-[5px]'>
                <div className='inline-flex h-auto items-center rounded bg-transparent p-0 text-xs text-white'>
                  Tài Liệu
                </div>
                <div className='inline-flex h-auto items-center rounded bg-transparent p-0 text-xs text-white'>
                  Nhạc Kịch
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
