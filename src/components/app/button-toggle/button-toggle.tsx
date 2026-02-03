'use client';

import { cn } from '@/lib';

export default function ButtonToggle({
  toggle,
  handleToggle,
  text
}: {
  toggle: boolean;
  handleToggle: () => void;
  text: string;
}) {
  return (
    <div className='flex items-center gap-x-2'>
      <div
        className={cn(
          'relative h-5 w-7.5 shrink-0 cursor-pointer rounded-full border border-solid border-white opacity-30 transition-all duration-150 ease-linear',
          {
            'border-light-golden-yellow opacity-100': toggle
          }
        )}
        onClick={handleToggle}
      >
        <div
          className={cn(
            'absolute top-1.25 h-2 w-2 rounded-full transition-all duration-150 ease-linear',
            {
              'bg-light-golden-yellow left-3.75': toggle,
              'left-1.25 bg-white': !toggle
            }
          )}
        ></div>
      </div>
      <div className='whitespace-nowrap text-white'>{text}</div>
    </div>
  );
}
