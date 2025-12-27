'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function MovieGridSkeleton() {
  const [cols, setCols] = useState(6);

  useEffect(() => {
    function updateCols() {
      const w = window.innerWidth;
      if (w <= 480) setCols(2);
      else if (w <= 640) setCols(3);
      else if (w <= 800) setCols(4);
      else if (w <= 1120) setCols(5);
      else if (w <= 1360) setCols(4);
      else if (w <= 1600) setCols(5);
      else setCols(6);
    }
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  return (
    <div className='max-1120:grid-cols-5 max-1360:grid-cols-4 max-1600:grid-cols-5 max-1600:gap-4 max-480:grid-cols-2 max-800:grid-cols-4 grid grid-cols-6 gap-6 max-sm:grid-cols-3'>
      <AnimatePresence mode='popLayout' initial={false}>
        {Array.from({ length: cols * 3 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function MovieCardSkeleton() {
  return (
    <div className='relative'>
      <motion.div
        layout
        initial='initial'
        animate='animate'
        exit='exit'
        className='relative flex animate-pulse flex-col gap-3'
      >
        <div className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-xl pb-[150%]'>
          <div className='absolute inset-0 h-full w-full object-cover transition-all duration-200 ease-linear hover:scale-105' />
        </div>

        <div className='min-h-10.5 text-center'>
          <h4 className='hover:text-light-golden-yellow mb-0 line-clamp-1 text-sm leading-6 font-normal text-white transition-all duration-200 ease-linear'></h4>
          <h4 className='text-light-gray mt-[5px] line-clamp-1 text-xs leading-6'></h4>
        </div>
      </motion.div>
    </div>
  );
}
