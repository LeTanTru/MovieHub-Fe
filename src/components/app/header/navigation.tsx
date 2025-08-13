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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/form';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

export default function NavigationMenu() {
  const categories = useCategoryQuery();

  const navigationList: ItemProps[] = [
    {
      label: 'Chủ đề',
      href: route.topic
    },
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
        { href: `${route.country}/` + 'an-do', label: 'Ấn Độ' },
        { href: `${route.country}/` + 'anh', label: 'Anh' },
        { href: `${route.country}/` + 'duc', label: 'Đức' },
        { href: `${route.country}/` + 'han-quoc', label: 'Hàn Quốc' },
        { href: `${route.country}/` + 'hong-kong', label: 'Hồng Kông' },
        { href: `${route.country}/` + 'indonesia', label: 'Indonesia' },
        { href: `${route.country}/` + 'italia', label: 'Italia' },
        { href: `${route.country}/` + 'my', label: 'Mỹ' },
        { href: `${route.country}/` + 'nhat-ban', label: 'Nhật Bản' },
        { href: `${route.country}/` + 'phap', label: 'Pháp' },
        { href: `${route.country}/` + 'trung-quoc', label: 'Trung Quốc' },
        { href: `${route.country}/` + 'thai-lan', label: 'Thái Lan' },
        { href: `${route.country}/` + 'uc', label: 'Úc' },
        { href: `${route.country}/` + 'canada', label: 'Canada' },
        { href: `${route.country}/` + 'nga', label: 'Nga' },
        { href: `${route.country}/` + 'viet-nam', label: 'Việt Nam' }
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
    <>
      {/* Mobile menu */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className='group xxl:hidden size-8'
            variant='ghost'
            size='icon'
          >
            <MenuIcon className='size-8' />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align='start'
          className='bg-popover xxl:hidden w-auto min-w-fit rounded-sm border-none p-1'
        >
          <Navigation
            navListClassName='gap-2 grid grid-cols-2 w-80'
            navItemClassName='[&>button]:px-2 [&>button]:text-sm [&>button>svg]:-rotate-90 [&>button[data-state="open"]>svg]:rotate-0'
            items={navigationList}
            render={(item: ItemProps) => {
              return item.submenu ? (
                <>
                  <NavigationMenuTrigger className='text-muted-foreground hover:text-primary focus:text-primary group-[state=open]:text-primary cursor-pointer bg-transparent font-medium transition-all duration-200 ease-linear group-[state=open]:bg-transparent hover:bg-transparent! focus:bg-transparent data-[state=open]:bg-transparent *:[svg]:-me-0.5 *:[svg]:size-3.5'>
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className='data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! bg-popover absolute z-50 w-100 border-none! duration-200'>
                    <List className={cn('grid w-100 grid-cols-2')}>
                      {item.subItems!.map((sub, index) => (
                        <ListItem key={index}>
                          <NavigationLink
                            href={sub.href!}
                            className='text-muted-foreground hover:text-primary cursor-pointer py-2.5! whitespace-nowrap'
                          >
                            <div className='flex items-center gap-2'>
                              {sub.icon && <sub.icon className='size-4' />}
                              {
                                <div className='text-sm font-medium'>
                                  {sub.label}
                                </div>
                              }
                            </div>
                          </NavigationLink>
                        </ListItem>
                      ))}
                    </List>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationLink
                  href={item.href!}
                  className='text-muted-foreground hover:text-primary py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-linear hover:bg-transparent'
                >
                  {item.label}
                </NavigationLink>
              );
            }}
          />
        </PopoverContent>
      </Popover>
      {/* Desktop menu */}
      <div className='xxl:block flex hidden items-center gap-2 md:gap-6'>
        <Navigation
          navListClassName='gap-2'
          items={navigationList}
          render={(item: ItemProps) => {
            return item.submenu ? (
              <>
                <NavigationMenuTrigger className='text-muted-foreground hover:text-primary focus:text-primary group-[state=open]:text-primary cursor-pointer bg-transparent font-medium transition-all duration-200 ease-linear group-[state=open]:bg-transparent hover:bg-transparent! focus:bg-transparent data-[state=open]:bg-transparent *:[svg]:-me-0.5 *:[svg]:size-3.5'>
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent className='data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! bg-background/90! z-50 border-none! duration-200'>
                  <List
                    className={cn('grid', {
                      'w-48': item.subItems!.length <= 4,
                      'w-150 grid-cols-4': item.subItems!.length > 4
                    })}
                  >
                    {item.subItems!.map((sub, index) => (
                      <ListItem key={index}>
                        <NavigationLink
                          href={sub.href!}
                          className='text-muted-foreground hover:text-primary cursor-pointer py-2.5! pl-4 whitespace-nowrap'
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
                href={item.href!}
                className='text-muted-foreground hover:text-primary py-1.5 font-medium whitespace-nowrap transition-all duration-200 ease-linear hover:bg-transparent'
              >
                {item.label}
              </NavigationLink>
            );
          }}
        />
      </div>
    </>
  );
}
