import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { cn } from '@/lib';

type NavigationLinkProps = React.ComponentProps<typeof NavigationMenuLink>;

export default function NavigationLink({
  children,
  className,
  ...props
}: NavigationLinkProps) {
  return (
    <NavigationMenuLink
      className={cn('focus:bg-transparent', className)}
      {...props}
    >
      {children}
    </NavigationMenuLink>
  );
}
