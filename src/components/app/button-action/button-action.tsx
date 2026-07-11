import { Button } from '@/components/form';
import { cn } from '@/lib';
import { domMax, LazyMotion, m } from 'framer-motion';

type ButtonActionProps = {
  action: string;
  label: string;
  activeTab: string;
  className?: string;
  setActiveTab: (key: string) => void;
};

export function ButtonAction({
  action,
  label,
  activeTab,
  className,
  setActiveTab
}: ButtonActionProps) {
  const isActive = action === activeTab;

  return (
    <div className='relative flex-1'>
      <LazyMotion features={domMax}>
        {isActive && (
          <m.div
            layoutId='tab-bg'
            className='absolute inset-0 rounded-full bg-white'
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        )}
      </LazyMotion>

      <Button
        variant='ghost'
        className={cn(
          'relative flex h-8 min-w-25 cursor-pointer items-center rounded-none px-2 transition-all duration-200 ease-linear hover:bg-transparent',
          {
            'text-gray-200 hover:opacity-80': !isActive,
            'text-black hover:text-black': isActive
          },
          className
        )}
        onClick={() => setActiveTab(action)}
      >
        <span className='relative z-10'>{label}</span>
      </Button>
    </div>
  );
}
