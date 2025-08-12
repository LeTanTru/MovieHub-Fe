import { cn } from '@/lib';
import Link, { type LinkProps } from 'next/link';

type NavigationLinkProps = React.PropsWithChildren<LinkProps> & {
  className?: string;
};

export default function NavigationLink({
  children,
  className,
  href,
  ...props
}: NavigationLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "data-[active]:focus:bg-accent data-[active]:hover:bg-accent data-[active]:bg-accent data-[active]:text-accent-foreground hover:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus:bg-transparent focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
