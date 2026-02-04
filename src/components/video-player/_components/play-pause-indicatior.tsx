'use client';

import { useMediaState } from '@vidstack/react';
import { PauseIcon, PlayIcon } from '@vidstack/react/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PlayPauseIndicator() {
  const isPaused = useMediaState('paused');
  const [showIndicator, setShowIndicator] = useState(false);
  const [lastAction, setLastAction] = useState<'play' | 'pause'>('pause');

  useEffect(() => {
    setLastAction(isPaused ? 'pause' : 'play');
    setShowIndicator(true);

    const timeout = setTimeout(() => {
      setShowIndicator(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [isPaused]);

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.4 }}
          transition={{
            opacity: { duration: 0.2 },
            scale: { duration: 0.2, ease: 'easeOut' }
          }}
          className='pointer-events-none absolute inset-0 z-50 flex items-center justify-center'
        >
          <div className='rounded-full bg-black/60 p-6 backdrop-blur-sm'>
            {lastAction === 'play' ? (
              <PlayIcon className='h-16 w-16 fill-white' />
            ) : (
              <PauseIcon className='h-16 w-16 fill-white' />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
