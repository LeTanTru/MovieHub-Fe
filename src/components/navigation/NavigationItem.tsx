import { NavigationMenuItem } from '@/components/ui/navigation-menu';
import { ItemProps } from '@/types';

interface NavigationProps {
  item: ItemProps;
  className?: string;
  render: (item: ItemProps) => React.ReactNode;
}

export default function NavigationItem({
  item,
  render,
  className
}: NavigationProps) {
  return (
    <NavigationMenuItem key={Math.random()} className={className}>
      {render(item)}
    </NavigationMenuItem>
  );
}
