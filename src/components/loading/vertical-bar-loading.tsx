import { cn } from '@/lib';
import './vertical-bar-loading.css';

export default function VerticalBarLoading({
  className
}: {
  className?: string;
}) {
  return (
    <div className={cn('bar-list', className)}>
      <div className='mx-auto flex w-12 items-center justify-between overflow-hidden rounded-full bg-transparent'>
        <div className='bar-item bar-item-1 h-12 w-2 bg-gray-500' />
        <div className='bar-item bar-item-2 h-12 w-2 bg-gray-500' />
        <div className='bar-item bar-item-3 h-12 w-2 bg-gray-500' />
      </div>
    </div>
  );
}
