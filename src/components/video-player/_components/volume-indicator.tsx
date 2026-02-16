'use client';

import { useIndicator } from '@/components/video-player/video-player';
import { useMediaState } from '@vidstack/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function VolumeIndicator() {
  const volume = useMediaState('volume');
  const [showIndicator, setShowIndicator] = useState(false);
  const { currentAction } = useIndicator();

  useEffect(() => {
    if (currentAction === 'initial' || currentAction === 'volume') {
      setShowIndicator(true);

      const timeout = setTimeout(() => {
        setShowIndicator(false);
      }, 800);

      return () => clearTimeout(timeout);
    } else {
      setShowIndicator(false);
    }
  }, [volume, currentAction]);

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
          className={
            'pointer-events-none absolute inset-0 z-50 flex h-full items-center justify-center'
          }
        >
          <div className='flex aspect-video items-center justify-center gap-1 rounded-lg bg-black/60 px-8 py-4 text-xl font-semibold text-white backdrop-blur-sm'>
            {Math.round(volume * 100)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
