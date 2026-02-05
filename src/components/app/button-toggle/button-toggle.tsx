'use client';

import { cn } from '@/lib';

export default function ButtonToggle({
  toggle,
  handleToggle,
  text,
  disabled
}: {
  toggle: boolean;
  handleToggle: () => void;
  text: string;
  disabled?: boolean;
}) {
  return (
    <div
      role='switch'
      aria-checked={toggle}
      className={cn('flex items-center gap-x-2', {
        'pointer-events-none relative cursor-not-allowed opacity-50 select-none':
          disabled
      })}
      aria-disabled={disabled}
    >
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
