'use client';
import { logoWithText } from '@/assets';
import AuthDialog from '@/components/app/auth/auth-dialog';
import DropdownAvatar from '@/components/app/header/dropdown-avatar';
import { Button } from '@/components/form';
import List from '@/components/list';
import ListItem from '@/components/list/ListItem';
import Navigation from '@/components/navigation';
import {
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenIcon, InfoIcon, LifeBuoyIcon, MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const navigationLinks = [
  { href: '#', label: 'Trang chủ' },
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

export default function Header() {
  const { profile, loading } = useAuthStore();

  return (
    <div>
      <header className='border-b pr-4 pl-0'>
        <div className='flex h-16 items-center justify-between gap-4'>
          {/* Left side */}
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
                                item.items!.length > 2
                                  ? 'w-60 grid-cols-2'
                                  : `w-48`
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
                            item.items!.length > 4
                              ? 'w-200 grid-cols-4'
                              : `w-48`
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
                                  {
                                    <div className='font-medium'>
                                      {sub.label}
                                    </div>
                                  }
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
          {/* Right side */}
          <div className='flex items-center gap-2'>
            {/* <DarkModeToggle /> */}
            <AnimatePresence mode='wait' initial={false}>
              {loading ? (
                <motion.div
                  key='loading'
                  // initial={{ opacity: 0, x: 10 }}
                  // animate={{ opacity: 1, x: 0 }}
                  // exit={{ opacity: 0, x: 10 }}
                  // transition={{ duration: 0.25 }}
                >
                  <Skeleton className='h-10 w-10 rounded-full' />
                </motion.div>
              ) : !profile ? (
                <motion.div
                  key='auth'
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <AuthDialog />
                </motion.div>
              ) : (
                <motion.div
                  key='avatar'
                  // initial={{ opacity: 0, x: 10 }}
                  // animate={{ opacity: 1, x: 0 }}
                  // exit={{ opacity: 0, x: 10 }}
                  // transition={{ duration: 0.25 }}
                >
                  <DropdownAvatar profile={profile} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </div>
  );
}
