'use client';

import { DownloadAppModal } from './download-app-modal';
import { Button } from '@/components/form';
import { useDisclosure } from '@/hooks';
import { useAppVersionLatestQuery } from '@/queries';
import { MonitorSmartphone } from 'lucide-react';

export function ButtonDownloadApp() {
  const { opened, open, close } = useDisclosure(false);
  const { data: appVersion } = useAppVersionLatestQuery({ enabled: opened });

  const handleOpen = () => {
    open();
  };

  return (
    <>
      <Button onClick={handleOpen} size='lg' className='gap-1 rounded-full'>
        <MonitorSmartphone className='size-5' />
        <p className='flex h-full flex-col items-center justify-center'>
          <span className='leading-[1.2]'>Tải ứng dụng</span>
          <span className='leading-[1.2] font-semibold'>MovieHub</span>
        </p>
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
