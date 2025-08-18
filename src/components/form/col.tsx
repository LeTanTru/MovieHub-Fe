import { PropsWithChildren, HTMLAttributes } from 'react';
import { cn } from '@/lib';

type ColProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  span?: number;
};

export default function Col({ children, className, span, ...rest }: ColProps) {
  const spanMap: Record<number, string> = {
    1: 'w-1/24',
    2: 'w-2/24',
    3: 'w-3/24',
    4: 'w-4/24',
    5: 'w-5/24',
    6: 'w-6/24',
    7: 'w-7/24',
    8: 'w-8/24',
    9: 'w-9/24',
    10: 'w-10/24',
    11: 'w-11/24',
    12: 'w-12/24',
    13: 'w-13/24',
    14: 'w-14/24',
    15: 'w-15/24',
    16: 'w-16/24',
    17: 'w-17/24',
    18: 'w-18/24',
    19: 'w-19/24',
    20: 'w-20/24',
    21: 'w-21/24',
    22: 'w-22/24',
    23: 'w-23/24',
    24: 'w-full'
  } as const;

  const spanClass = span ? spanMap[span] : 'w-full';

  return (
    <div className={cn('flex flex-col', spanClass, className)} {...rest}>
      {children}
    </div>
  );
}
