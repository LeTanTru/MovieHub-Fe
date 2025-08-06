import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { logoWithText } from '@/assets';
import { Button } from '@/components/form';
import List from '@/components/list';
import ListItem from '@/components/list/ListItem';

import {
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';

import Image from 'next/image';
import Link from 'next/link';
import { BookOpenIcon, InfoIcon, LifeBuoyIcon, MenuIcon } from 'lucide-react';
import Navigation from '@/components/navigation';

const navigationLinks = [
  {
    label: 'Features',
    submenu: true,
    items: [
      {
        href: '#',
        label: 'Components'
      },
      {
        href: '#',
        label: 'Documentation'
      },
      {
        href: '#',
        label: 'Templates'
      },
      {
        href: '#',
        label: 'Changelog'
      },
      {
        href: '#',
        label: 'Changelog'
      },
      {
        href: '#',
        label: 'Changelog'
      },
      {
        href: '#',
        label: 'Changelog'
      },
      {
        href: '#',
        label: 'Changelog'
      },
      {
        href: '#',
        label: 'Changelog'
      },
      {
        href: '#',
        label: 'Changelog'
      },
      {
        href: '#',
        label: 'Changelog'
      }
    ]
  },
  {
    label: 'Pricing',
    submenu: true,
    items: [
      { href: '#', label: 'Product A' },
      { href: '#', label: 'Product B' },
      { href: '#', label: 'Product C' },
      { href: '#', label: 'Product D' }
    ]
  },
  {
    label: 'About',
    submenu: true,
    items: [
      { href: '#', label: 'Getting Started', icon: BookOpenIcon },
      { href: '#', label: 'Tutorials', icon: LifeBuoyIcon },
      { href: '#', label: 'About Us', icon: InfoIcon }
    ]
  }
];

export default function NavigationMenu() {
  return (
    <div className='flex items-center gap-2'>
      {/* Mobile menu trigger */}
      <Popover>
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
            items={navigationLinks}
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
      </Popover>

      {/* Main nav */}
      <div className='flex items-center gap-2 md:gap-6'>
        <Link href='/'>
          <Image
            src={logoWithText}
            alt='Logo'
            width={200}
            height={40}
            className='h-[40px] w-[200px]'
            priority
          />
        </Link>
        {/* Navigation menu */}
        <Navigation
          className='max-md:hidden'
          navListClassName='gap-2'
          items={navigationLinks}
          render={(item) => {
            return item.submenu ? (
              <>
                <NavigationMenuTrigger className='text-muted-foreground hover:text-primary focus:text-primary group-[state=open]:text-primary cursor-pointer bg-transparent font-medium transition-all duration-200 ease-linear group-[state=open]:bg-transparent hover:bg-transparent! focus:bg-transparent data-[state=open]:bg-transparent *:[svg]:-me-0.5 *:[svg]:size-3.5'>
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent className='data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! bg-background! z-50 border-none! duration-200'>
                  <List
                    className={`grid ${
                      item.items!.length > 4 ? 'w-200 grid-cols-4' : `w-48`
                    }`}
                  >
                    {item.items!.map((sub, index) => (
                      <ListItem key={index}>
                        <NavigationMenuLink
                          href={item.href}
                          className='text-muted-foreground hover:text-primary cursor-pointer py-2.5! pl-4'
                        >
                          <div className='flex items-center gap-2'>
                            {sub.icon && <sub.icon className='size-4' />}
                            {<div className='font-medium'>{sub.label}</div>}
                          </div>
                        </NavigationMenuLink>
                      </ListItem>
                    ))}
                  </List>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                href={item.href}
                className='text-muted-foreground hover:text-primary py-1.5 font-medium transition-all duration-200 ease-linear hover:bg-transparent'
              >
                {item.label}
              </NavigationMenuLink>
            );
          }}
        />
      </div>
    </div>
  );
}
