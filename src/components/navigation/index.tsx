import NavigationItem from '@/components/navigation/NavigationItem';
import {
  NavigationMenu,
  NavigationMenuList
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib';
import { NavigationProps } from '@/types';

export default function Navigation({
  className,
  navListClassName,
  navItemClassName,
  items = [{ label: '', href: '', subItems: [], submenu: false, type: '' }],
  render = () => null
}: NavigationProps) {
  const safeItems = items.map((item) => ({
    ...item,
    subItems: item.subItems ?? []
  }));

  return (
    <NavigationMenu viewport={false} className={cn(className)}>
      <NavigationMenuList className={cn(navListClassName)}>
        {safeItems.map((item, index) => (
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
