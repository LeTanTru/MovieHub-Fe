'use client';

import { Button } from '@/components/form';
import { apiConfig } from '@/constants';
import { cn } from '@/lib';
import {
  useAuth,
  useDisclosure,
  useMovieInfo,
  useValidatePermission
} from '@/hooks';
import { FaFlag } from 'react-icons/fa6';
import VideoReportModal from './video-report-modal';

type ButtonReportProps = {
  videoId: string;
  className?: string;
};

export function ButtonReport({ videoId, className }: ButtonReportProps) {
  const { isAuthenticated } = useAuth();
  const hasPermission = useValidatePermission();
  const { trailerLink, watchLink } = useMovieInfo();

  const { opened, open, close } = useDisclosure();

  const canReport =
    isAuthenticated &&
    hasPermission({
      requiredPermissions: [apiConfig.userReport.create.permissionCode]
    });

  if (!canReport || !videoId || (!trailerLink && !watchLink)) return null;

  return (
    <>
      <Button
        variant='ghost'
        className={cn(
          'hover:text-golden-glow flex h-10! items-center justify-center gap-2 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10',
          className
        )}
        onClick={open}
      >
        <FaFlag /> <span className='max-640:sr-only'>Báo lỗi</span>
      </Button>
      <VideoReportModal open={opened} onClose={close} videoId={videoId} />
    </>
  );
}
