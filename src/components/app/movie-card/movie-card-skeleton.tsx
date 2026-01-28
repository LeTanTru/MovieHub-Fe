'use client';

import { motion } from 'framer-motion';

export default function MovieCardSkeleton() {
  return (
    <div className='relative'>
      <motion.div
        layout
        initial='initial'
        animate='animate'
        exit='exit'
        className='relative flex flex-col gap-3'
      >
        <div className='bg-gunmetal-blue relative block h-0 w-full animate-pulse overflow-hidden rounded-xl pb-[150%]'>
          <div className='absolute inset-0 h-full w-full object-cover transition-all duration-200 ease-linear hover:scale-105' />
        </div>

        <div className='min-h-10.5 text-center'>
          <div className='bg-gunmetal-blue mx-auto mb-2 h-5 w-20 animate-pulse rounded'></div>
          <h4 className='bg-gunmetal-blue mx-auto h-5 w-20 animate-pulse rounded'></h4>
        </div>
      </motion.div>
    </div>
  );
}
