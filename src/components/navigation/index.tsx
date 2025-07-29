import NavigationItem from '@/components/navigation/NavigationItem';
import {
  NavigationMenu,
  NavigationMenuList
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib';

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
  className?: string;
  navListClassName?: string;
  navItemClassName?: string;
  items: ItemProps[];
  render: (item: ItemProps, index: number) => React.ReactNode;
}

export default function Navigation({
  className,
  navListClassName,
  navItemClassName,
  items,
  render
}: NavigationProps) {
  return (
    <NavigationMenu viewport={false} className={cn(className)}>
      <NavigationMenuList className={cn(navListClassName)}>
        {items.map((item, index) => (
          <NavigationItem
            className={navItemClassName}
            key={index}
            render={(item) => render(item, index)}
            item={item}
          />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
