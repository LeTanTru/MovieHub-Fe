import { PropsWithChildren, HTMLAttributes } from 'react';
import { cn } from '@/lib';

type ColProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  span?: number;
};

export default function Col({ children, className, span, ...rest }: ColProps) {
  const spanClass = span ? `w-${span}/24` : 'w-full';

  return (
    <div className={cn('flex flex-col', spanClass, className)} {...rest}>
      {children}
    </div>
  );
}
