import { cn } from '@/lib';

export default function Container({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <main className={cn('container mx-auto', className)} {...props}>
      {children}
    </main>
  );
}
