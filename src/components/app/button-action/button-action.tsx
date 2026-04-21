import { Button } from '@/components/form';
import { cn } from '@/lib';
import { domMax, LazyMotion, m } from 'framer-motion';

type ButtonActionProps = {
  action: string;
  label: string;
  activeKey: string;
  className?: string;
  setActiveKey: (key: string) => void;
};

export default function ButtonAction({
  action,
  label,
  activeKey,
  className,
  setActiveKey
}: ButtonActionProps) {
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
          'relative flex h-6.5 cursor-pointer items-center rounded-none! px-2 transition-all duration-200 ease-linear hover:bg-transparent',
          {
            'text-gray-200 hover:opacity-80': !isActive,
            'text-black hover:text-black': isActive
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
