'use client';

import { useIndicator } from '@/components/video-player/video-player';
import { cn } from '@/lib';
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
          className={cn(
            'pointer-events-none absolute inset-0 top-25 z-50 flex h-full items-center justify-center',
            {
              'top-100 max-[1537px]:top-75 max-[1200px]:top-55':
                currentAction === 'volume'
            }
          )}
        >
          <div className='rounded-lg bg-black/60 px-8 py-4 text-2xl font-semibold text-white shadow-[0px_0px_10px_2px] shadow-zinc-800 backdrop-blur-sm'>
            {Math.round(volume * 100)}
            <span className='text-sm'>%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
