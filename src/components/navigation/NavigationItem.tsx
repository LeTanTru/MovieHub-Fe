import { NavigationMenuItem } from '@/components/ui/navigation-menu';

interface SubmenuProps {
  [key: string]: any;
}

interface ItemProps {
  href?: string;
  label: string;
  submenu?: boolean;
  type?: string;
  items?: SubmenuProps[];
}

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
