'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/form/button';
import { useEffect } from 'react';
import { storageKeys } from '@/constants';
import { getData, setData } from '@/utils';
import { useDisclosure, useIsMounted } from '@/hooks';
import { envConfig } from '@/config';

const DISCLAIMER_INTERVAL_MS = 2 * 60 * 60 * 1000;

const DISCLAIMER_TEXT = {
  title: 'Cảnh báo quan trọng',
  description:
    'Trang web này chỉ được sử dụng cho mục đích học tập và phát triển kỹ năng lập trình web. Tất cả nội dung phim trên website này được thu thập từ các nguồn công khai và không nhằm mục đích thương mại.',
  warning:
    'Theo quy định của pháp luật Việt Nam, việc sử dụng và phân phối nội dung vi phạm bản quyền có thể bị xử lý hình sự và dân sự. Để tránh rủi ro pháp lý, hãy sử dụng các nền tảng phát trực tuyến có giấy phép hợp lệ như Netflix, Disney+, VietFilm,...',
  notice: 'Cảnh báo này sẽ xuất hiện lại sau 2 giờ.',
  agree: 'Tôi đã hiểu và đồng ý'
};

const shouldShowDisclaimer = () => {
  const lastAcknowledgedAt = Number(getData(storageKeys.DISCLAIMER_SHOWN) ?? 0);

  if (!Number.isFinite(lastAcknowledgedAt) || lastAcknowledgedAt <= 0) {
    return true;
  }

  return Date.now() - lastAcknowledgedAt >= DISCLAIMER_INTERVAL_MS;
};

export function DisclaimerModal() {
  const isMounted = useIsMounted();
  const { opened, open, close } = useDisclosure(false);

  const handleAgree = () => {
    setData(storageKeys.DISCLAIMER_SHOWN, Date.now().toString());
    close();
  };

  useEffect(() => {
    if (!isMounted || envConfig.NEXT_PUBLIC_NODE_ENV === 'development') {
      close();
      return;
    }

    if (shouldShowDisclaimer()) {
      open();
      return;
    }

    close();
  }, [close, isMounted, open]);

  if (!isMounted) return null;

  return (
    <Dialog open={opened}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className='max-520:w-[90%] pointer-events-auto border-gray-800 bg-[#0b0f19] p-6 text-white [&>button]:hidden'
      >
        <DialogHeader className='flex flex-col items-center gap-3 text-center'>
          <div className='flex size-14 shrink-0 items-center justify-center rounded-full bg-rose-500/10'>
            <AlertTriangle className='size-8 animate-pulse text-rose-500' />
          </div>
          <DialogTitle className='text-xl'>{DISCLAIMER_TEXT.title}</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4 text-sm leading-relaxed text-[#8892b0]'>
          <DialogDescription className='text-[#8892b0]'>
            {DISCLAIMER_TEXT.description}
          </DialogDescription>
          <div className='rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-amber-200/90'>
            {DISCLAIMER_TEXT.warning}
          </div>
          <p className='text-center font-medium italic'>
            {DISCLAIMER_TEXT.notice}
          </p>
          <Button
            onClick={handleAgree}
            className='w-full cursor-pointer transition-all duration-200 ease-linear'
          >
            {DISCLAIMER_TEXT.agree}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
