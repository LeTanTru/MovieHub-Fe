'use client';

import { DownloadAppModal } from './download-app-modal';
import { Button } from '@/components/form';
import { useDisclosure } from '@/hooks';
import { useAppVersionLatestQuery } from '@/queries';
import { cn } from '@/lib';
import { MonitorSmartphone } from 'lucide-react';

type ButtonDownloadAppProps = {
  className?: string;
  iconOnly?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

export function ButtonDownloadApp({
  className,
  iconOnly = false,
  size = 'lg'
}: ButtonDownloadAppProps) {
  const { opened, open, close } = useDisclosure(false);
  const { data: appVersion } = useAppVersionLatestQuery({ enabled: opened });

  const handleOpen = () => {
    open();
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        size={size}
        className={cn('gap-1 rounded-full', className)}
        aria-label='Tải ứng dụng MovieHub'
        title='Tải ứng dụng MovieHub'
      >
        <MonitorSmartphone className='size-5' />
        {!iconOnly && (
          <p className='flex h-full flex-col items-center justify-center'>
            <span className='leading-[1.2]'>Tải ứng dụng</span>
            <span className='leading-[1.2] font-semibold'>MovieHub</span>
          </p>
        )}
      </Button>
      {appVersion && (
        <DownloadAppModal
          open={opened}
          appVersion={appVersion}
          onClose={close}
        />
      )}
    </>
  );
}
