import { emptyData } from '@/assets';
import { cn } from '@/lib';
import Image from 'next/image';

export default function NoData({
  className,
  content = 'Không có dữ liệu',
  width = 200,
  height = 80,
  size,
  src
}: {
  className?: string;
  content?: string | React.ReactNode;
  width?: number;
  height?: number;
  size?: number;
  src?: string;
}) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-4 rounded-lg py-4 pt-50 dark:bg-transparent dark:text-white',
        className
      )}
    >
      <Image
        src={src || emptyData.src}
        width={size || width}
        height={size || height}
        alt={'No data'}
      />
      <p>{content}</p>
    </div>
  );
}
