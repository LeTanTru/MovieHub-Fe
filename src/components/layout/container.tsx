import { cn } from '@/lib';

export default function Container({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <main className={cn('container mx-auto', className)} {...props}>
      {children}
    </main>
  );
}
