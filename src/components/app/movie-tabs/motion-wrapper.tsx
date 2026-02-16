'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function MotionWrapper({
  children,
  uniqueKey,
  direction
}: {
  children: ReactNode;
  uniqueKey?: string;
  direction: number;
}) {
  return (
    <motion.div
      key={uniqueKey}
      initial={{ opacity: 0, x: direction * 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -20 }}
      transition={{ duration: 0.2, ease: 'linear' }}
      className='py-10'
    >
      {children}
    </motion.div>
  );
}
