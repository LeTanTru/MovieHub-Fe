import { emptyData } from '@/assets';
import { cn } from '@/lib';
import Image from 'next/image';

type NoDataProps = {
  className?: string;
  imageClassName?: string;
  content?: string | React.ReactNode;
  width?: number;
  height?: number;
  size?: number;
  src?: string;
};

export function NoData({
  className,
  imageClassName,
  content = 'Không có dữ liệu',
  width = 200,
  height = 80,
  size,
  src
}: NoDataProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-transparent py-4 pt-50 text-white',
        className
      )}
    >
      <Image
        src={src || emptyData.src}
        width={size || width}
        height={size || height}
        alt='No data'
        className={imageClassName}
      />
      <p className='text-center'>{content}</p>
    </div>
  );
}
