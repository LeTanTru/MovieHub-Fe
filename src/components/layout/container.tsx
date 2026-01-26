import type { HTMLAttributes } from 'react';

export default function Container({
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <main {...props}>{children}</main>;
}
