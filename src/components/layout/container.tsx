import type { HTMLAttributes } from 'react';

export function Container({ children, ...props }: HTMLAttributes<HTMLElement>) {
  return <main {...props}>{children}</main>;
}
