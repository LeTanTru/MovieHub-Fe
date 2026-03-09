'use client';

import { Button, Col, Row } from '@/components/form';
import { formatSecondsToHMS } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';

export default function WatchAskContinueModal({
  opened,
  lastWatchedSeconds,
  onClose,
  onContinueWatching,
  onStartOver
}: {
  lastWatchedSeconds: number;
  opened: boolean;
  onClose: () => void;
  onContinueWatching: () => void;
  onStartOver: () => void;
}) {
  return (
    <AnimatePresence>
      {opened && (
        <>
          {/* Backdrop */}
          <motion.div
            className='absolute inset-0 z-10 bg-black/70 backdrop-blur-xs'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'linear' }}
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            className='bg-charade absolute top-1/2 left-1/2 z-20 min-w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-[0px_0px_10px_2px] shadow-black/40'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: 'linear' }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className='flex items-center justify-between border-b border-none border-gray-200 py-2 pr-2 pl-4'>
              <div className='max-640:text-[13px] font-semibold text-gray-800 text-white'>
                Tiếp tục xem
              </div>
            </div>
            {/* Body */}
            <div className='max-640:text-[13px] px-4 pb-4 text-gray-300'>
              <p>
                Bạn đã xem phim này trước đó đến&nbsp;
                {formatSecondsToHMS(lastWatchedSeconds)}.
              </p>
              <p>Bạn muốn tiếp tục xem hay bắt đầu lại?</p>
              <Row className='max-640:mt-2 mt-4 mb-0 justify-center'>
                <Col className='mb-0 w-2/5'>
                  <Button
                    variant='primary'
                    className='max-640:text-[13px]'
                    onClick={onStartOver}
                  >
                    Bắt đầu lại
                  </Button>
                </Col>
                <Col className='mb-0 w-2/5'>
                  <Button
                    variant='primary'
                    className='dark:bg-golden-glow dark:hover:bg-golden-glow/80 max-640:text-[13px] dark:text-black'
                    onClick={onContinueWatching}
                  >
                    Tiếp tục xem
                  </Button>
                </Col>
              </Row>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
