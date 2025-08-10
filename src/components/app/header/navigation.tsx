'use client';

import List from '@/components/list';
import ListItem from '@/components/list/ListItem';

import {
  NavigationMenuContent,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';

import Navigation from '@/components/navigation';
import { useCategoryQuery } from '@/queries/use-category';
import { cn } from '@/lib';
import { ItemProps } from '@/types';
import route from '@/routes';
import NavigationLink from '@/components/navigation/NavigationLink';

export default function NavigationMenu() {
  const categories = useCategoryQuery();

  const navigationList: ItemProps[] = [
    {
      label: 'Thể loại',
      submenu: true,
      href: '',
      subItems: categories.map((category) => ({
        label: category.name,
        href: `${route.category}/${category.slug}`
      }))
    },
    {
      label: 'Phim lẻ',
      href: `${route.movie.type.single}`
    },
    {
      label: 'Phim bộ',
      href: `${route.movie.type.series}`
    },
    {
      label: 'Quốc gia',
      submenu: true,
      subItems: [
        { href: `${route.country}/` + 'viet-nam', label: 'Việt Nam' },
        { href: `${route.country}/` + 'nhat-ban', label: 'Nhật Bản' },
        { href: `${route.country}/` + 'han-quoc', label: 'Hàn Quốc' },
        { href: `${route.country}/` + 'trung-quoc', label: 'Trung Quốc' },
        { href: `${route.country}/` + 'thai-lan', label: 'Thái Lan' }
      ]
    },
    {
      label: 'Diễn viên',
      href: route.actor
    },
    {
      label: 'Lịch chiếu',
      href: route.schedule
    }
  ];

  return (
    <div className='flex items-center gap-2'>
      {/* Main nav */}
      {/* Mobile menu trigger */}

      {/* <Popover>
        <PopoverTrigger asChild>
          <Button
            className='group size-8 md:hidden'
            variant='ghost'
            size='icon'
          >
            <MenuIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align='start'
          className='bg-background w-auto min-w-fit rounded-sm border-none p-1 md:hidden'
        >
          <Navigation
            className='max-w-none *:w-full'
            navListClassName='flex-col items-start gap-0 md:gap-2'
            navItemClassName='w-full'
            items={categories}
            render={(item, index) => {
              return (
                <>
                  {item.submenu ? (
                    <div className='p-1'>
                      <div className='text-muted-foreground px-2 py-1.5 text-xs font-medium'>
                        {item.label}
                      </div>
                      <List
                        className={`grid ${
                          item.items!.length > 2 ? 'w-60 grid-cols-2' : `w-48`
                        }`}
                      >
                        {item.items!.map((subItem, itemIndex) => (
                          <ListItem key={itemIndex}>
                            <NavigationMenuLink
                              href={subItem.href}
                              className='py-2'
                            >
                              {subItem.label}
                            </NavigationMenuLink>
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  ) : (
                    <NavigationMenuLink
                      href={item.href}
                      className='px-3 py-1.5'
                    >
                      {item.label}
                    </NavigationMenuLink>
                  )}

                  {index !== navigationLinks.length - 1 && (
                    <div
                      role='separator'
                      aria-orientation='horizontal'
                      className='bg-border my-1 h-px w-full'
                    />
                  )}
                </>
              );
            }}
          />
        </PopoverContent>
      </Popover> */}
      <div className='flex items-center gap-2 md:gap-6'>
        {/* Navigation menu */}
        <Navigation
          className='max-md:hidden'
          navListClassName='gap-2'
          items={navigationList}
          render={(item: ItemProps) => {
            return item.submenu ? (
              <>
                <NavigationMenuTrigger className='text-muted-foreground hover:text-primary focus:text-primary group-[state=open]:text-primary cursor-pointer bg-transparent font-medium transition-all duration-200 ease-linear group-[state=open]:bg-transparent hover:bg-transparent! focus:bg-transparent data-[state=open]:bg-transparent *:[svg]:-me-0.5 *:[svg]:size-3.5'>
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent className='data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! bg-background! z-50 border-none! duration-200'>
                  <List
                    className={cn('grid', {
                      'w-48': item.subItems!.length <= 4,
                      'w-200 grid-cols-4': item.subItems!.length > 4
                    })}
                  >
                    {item.subItems!.map((sub, index) => (
                      <ListItem key={index}>
                        <NavigationLink
                          href={sub.href}
                          className='text-muted-foreground hover:text-primary cursor-pointer py-2.5! pl-4'
                        >
                          <div className='flex items-center gap-2'>
                            {sub.icon && <sub.icon className='size-4' />}
                            {<div className='font-medium'>{sub.label}</div>}
                          </div>
                        </NavigationLink>
                      </ListItem>
                    ))}
                  </List>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationLink
                href={item.href}
                className='text-muted-foreground hover:text-primary py-1.5 font-medium transition-all duration-200 ease-linear hover:bg-transparent'
              >
                {item.label}
              </NavigationLink>
            );
          }}
        />
      </div>
    </div>
  );
}
