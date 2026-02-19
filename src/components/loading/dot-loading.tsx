import { cn } from '@/lib';

export default function DotLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center space-x-2 bg-transparent',
        className
      )}
    >
      <div className='h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.6s]' />
      <div className='h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]' />
      <div className='h-2 w-2 animate-bounce rounded-full bg-gray-500' />
    </div>
  );
}
