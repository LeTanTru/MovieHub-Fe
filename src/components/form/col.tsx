import type { PropsWithChildren, HTMLAttributes } from 'react';
import { cn } from '@/lib';

type ColProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export default function Col({ children, className, ...rest }: ColProps) {
  return (
    <div className={cn('flex flex-col px-2', className)} {...rest}>
      {children}
    </div>
  );
}
