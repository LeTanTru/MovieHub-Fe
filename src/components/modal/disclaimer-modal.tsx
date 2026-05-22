'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/form';
import { useEffect } from 'react';
import { storageKeys } from '@/constants';
import { getData, removeData, setData } from '@/utils';
import { useDisclosure, useIsMounted } from '@/hooks';
import envConfig from '@/config';

const DISCLAIMER_TEXT = {
  title: 'Cảnh báo quan trọng',
  description:
    'Trang web này chỉ được sử dụng cho mục đích học tập và phát triển kỹ năng lập trình web. Tất cả nội dung phim trên website này được thu thập từ các nguồn công khai và không nhằm mục đích thương mại.',
  warning:
    'Theo quy định của pháp luật Việt Nam, việc sử dụng và phân phối nội dung vi phạm bản quyền có thể bị xử lý hình sự và dân sự. Để tránh rủi ro pháp lý, hãy sử dụng các nền tảng phát trực tuyến có giấy phép hợp lệ như Netflix, Disney+, VietFilm,...',
  agree: 'Tôi đã hiểu và đồng ý'
};

export function DisclaimerModal() {
  const isMounted = useIsMounted();

  const { opened, close } = useDisclosure(
    getData(storageKeys.DISCLAIMER_SHOWN) !== 'true'
  );

  const handleAgree = () => {
    setData(storageKeys.DISCLAIMER_SHOWN, 'true');
    close();
  };

  useEffect(() => {
    if (isMounted) {
      if (
        getData(storageKeys.DISCLAIMER_SHOWN) !== 'true' &&
        envConfig.NEXT_PUBLIC_NODE_ENV === 'production'
      ) {
        // show modal in prod if not agreed
      } else {
        close();
      }
    }
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <Dialog open={opened}>
      <DialogContent
        closeOnOverlay={false}
        className='max-520:w-[90%] pointer-events-auto border-gray-800 bg-[#0b0f19] p-6 text-white [&>button]:hidden'
      >
        <DialogHeader className='flex flex-row items-center gap-3 text-[#ccd6f6]'>
          <AlertTriangle className='size-8 animate-pulse text-amber-500' />
          <DialogTitle className='text-lg font-semibold'>
            {DISCLAIMER_TEXT.title}
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4 text-sm leading-relaxed text-[#8892b0]'>
          <DialogDescription className='text-[#8892b0]'>
            {DISCLAIMER_TEXT.description}
          </DialogDescription>
          <div className='rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-amber-200/90'>
            {DISCLAIMER_TEXT.warning}
          </div>
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
