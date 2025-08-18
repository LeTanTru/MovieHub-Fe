import { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib';

type RowProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export default function Row({ children, className, ...rest }: RowProps) {
  return (
    <div
      className={cn('my-4 flex w-full flex-row gap-x-4', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
