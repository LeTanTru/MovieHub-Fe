'use client';

import { m } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib';

type MotionWrapperProps = {
  children: ReactNode;
  uniqueKey?: string;
  direction: number;
  className?: string;
};

export function MotionWrapper({
  children,
  uniqueKey,
  direction,
  className
}: MotionWrapperProps) {
  return (
    <m.div
      key={uniqueKey}
      initial={{ opacity: 0, x: direction * 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -20 }}
      transition={{ duration: 0.2, ease: 'linear' }}
      className={cn(className)}
    >
      {children}
    </m.div>
  );
}
