import { Button } from '@/components/form';
import { cn } from '@/lib';
import { domMax, LazyMotion, m } from 'framer-motion';

export default function ButtonAction({
  action,
  label,
  activeKey,
  className,
  setActiveKey
}: {
  action: string;
  label: string;
  activeKey: string;
  className?: string;
  setActiveKey: (key: string) => void;
}) {
  const isActive = action === activeKey;

  return (
    <div className='relative flex-1'>
      <LazyMotion features={domMax}>
        {isActive && (
          <m.div
            layoutId='tab-bg'
            className='absolute inset-0 rounded bg-white'
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        )}
      </LazyMotion>

      <Button
        variant='ghost'
        className={cn(
          'relative flex h-6.5 cursor-pointer items-center rounded-none! px-2 transition-all duration-200 ease-linear dark:hover:bg-transparent',
          {
            'dark:text-gray-200 dark:hover:opacity-80': !isActive,
            'dark:text-black dark:hover:text-black': isActive
          },
          className
        )}
        onClick={() => setActiveKey(action)}
      >
        <span className='relative z-10'>{label}</span>
      </Button>
    </div>
  );
}
