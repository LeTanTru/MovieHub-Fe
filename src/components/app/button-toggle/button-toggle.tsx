'use client';

import { cn } from '@/lib';

type ButtonToggleProps = {
  align?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  text: string;
  toggle: boolean;
  onToggle: () => void;
};

export function ButtonToggle({
  align = 'right',
  className,
  disabled,
  text,
  toggle,
  onToggle
}: ButtonToggleProps) {
  return (
    <div
      role='switch'
      aria-checked={toggle}
      className={cn(
        'flex items-center gap-x-2',
        {
          'pointer-events-none relative cursor-not-allowed opacity-50 select-none':
            disabled,
          'flex-row-reverse': align === 'left'
        },
        className
      )}
      aria-disabled={disabled}
    >
      <button
        type='button'
        className={cn(
          'relative h-5 w-7.5 shrink-0 cursor-pointer rounded-full border border-solid border-white opacity-30 transition-all duration-150 ease-linear',
          {
            'border-golden-glow opacity-100': toggle
          }
        )}
        disabled={disabled}
        onClick={onToggle}
      >
        <div
          className={cn(
            'absolute top-1.25 h-2 w-2 rounded-full transition-all duration-150 ease-linear',
            {
              'bg-golden-glow left-3.75': toggle,
              'left-1.25 bg-white': !toggle
            }
          )}
        ></div>
      </button>
      <div className='whitespace-nowrap text-white'>{text}</div>
    </div>
  );
}
