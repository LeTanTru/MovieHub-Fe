import { Button } from '@/components/form';
import { cn } from '@/lib';
import { motion } from 'framer-motion';

export default function ButtonAction({
  action,
  label,
  activeKey,
  setActiveKey
}: {
  action: string;
  label: string;
  activeKey: string;
  setActiveKey: (key: string) => void;
}) {
  const isActive = action === activeKey;

  return (
    <div className='relative flex-1'>
      {isActive && (
        <motion.div
          layoutId='tab-bg'
          className='absolute inset-0 rounded bg-white'
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      )}

      <Button
        variant='ghost'
        className={cn(
          'relative flex h-6.5 cursor-pointer items-center rounded-none! px-2 text-sm transition-all duration-200 ease-linear hover:bg-transparent!',
          {
            'text-gray-200 hover:opacity-80': !isActive,
            'text-black hover:text-black': isActive
          }
        )}
        onClick={() => setActiveKey(action)}
      >
        <span className='relative z-10'>{label}</span>
      </Button>
    </div>
  );
}
