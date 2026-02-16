'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib';

export default function MotionWrapper({
  children,
  uniqueKey,
  direction,
  className
}: {
  children: ReactNode;
  uniqueKey?: string;
  direction: number;
  className?: string;
}) {
  return (
    <motion.div
      key={uniqueKey}
      initial={{ opacity: 0, x: direction * 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -20 }}
      transition={{ duration: 0.2, ease: 'linear' }}
      className={cn('py-10', className)}
    >
      {children}
    </motion.div>
  );
}
