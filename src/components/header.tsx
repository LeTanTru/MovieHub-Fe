import { logo } from '@/assets';
import DarkModeToggle from '@/components/dark-mode-toggle';
import { Button } from '@/components/form';
import LocaleSwitcher from '@/components/locale-switcher';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib';
import { BookOpenIcon, InfoIcon, LifeBuoyIcon, MenuIcon } from 'lucide-react';
import Image from 'next/image';

const navigationLinks = [
  { href: '#', label: 'Home' },
  {
    label: 'Features',
    submenu: true,
    type: 'description',
    items: [
      {
        href: '#',
        label: 'Components',
        description: 'Browse all components in the library.'
      },
      {
        href: '#',
        label: 'Documentation',
        description: 'Learn how to use the library.'
      },
      {
        href: '#',
        label: 'Templates',
        description: 'Pre-built layouts for common use cases.'
      }
    ]
  },
  {
    label: 'Pricing',
    submenu: true,
    type: 'simple',
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
    type: 'icon',
    items: [
      { href: '#', label: 'Getting Started', icon: 'BookOpenIcon' },
      { href: '#', label: 'Tutorials', icon: 'LifeBuoyIcon' },
      { href: '#', label: 'About Us', icon: 'InfoIcon' }
    ]
  }
];

export default function Header() {
  return (
    <div>
      <header className='border-b px-4 md:px-6'>
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
              <PopoverContent align='start' className='w-64 p-1 md:hidden'>
                <NavigationMenu className='max-w-none *:w-full'>
                  <NavigationMenuList className='flex-col items-start gap-0 md:gap-2'>
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index} className='w-full'>
                        {link.submenu ? (
                          <>
                            <div className='text-muted-foreground px-2 py-1.5 text-xs font-medium'>
                              {link.label}
                            </div>
                            <ul>
                              {link.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <NavigationMenuLink
                                    href={item.href}
                                    className='py-1.5'
                                  >
                                    {item.label}
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <NavigationMenuLink
                            href={link.href}
                            className='py-1.5'
                          >
                            {link.label}
                          </NavigationMenuLink>
                        )}
                        {/* Add separator between different types of items */}
                        {index < navigationLinks.length - 1 &&
                          // Show separator if:
                          // 1. One is submenu and one is simple link OR
                          // 2. Both are submenus but with different types
                          ((!link.submenu &&
                            navigationLinks[index + 1].submenu) ||
                            (link.submenu &&
                              !navigationLinks[index + 1].submenu) ||
                            (link.submenu &&
                              navigationLinks[index + 1].submenu &&
                              link.type !==
                                navigationLinks[index + 1].type)) && (
                            <div
                              role='separator'
                              aria-orientation='horizontal'
                              className='bg-border -mx-1 my-1 h-px w-full'
                            />
                          )}
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
            {/* Main nav */}
            <div className='flex items-center gap-6'>
              <Link href='#'>
                <Image
                  src={logo}
                  alt='Logo'
                  width={200}
                  height={40}
                  className='h-[40px] w-[200px]'
                />
              </Link>
              {/* Navigation menu */}
              <NavigationMenu viewport={false} className='max-md:hidden'>
                <NavigationMenuList className='gap-2'>
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      {link.submenu ? (
                        <>
                          <NavigationMenuTrigger className='text-muted-foreground hover:text-primary bg-transparent px-2 py-1.5 font-medium *:[svg]:-me-0.5 *:[svg]:size-3.5'>
                            {link.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className='data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1'>
                            <ul
                              className={cn(
                                link.type === 'description'
                                  ? 'min-w-64'
                                  : 'min-w-48'
                              )}
                            >
                              {link.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <NavigationMenuLink
                                    href={item.href}
                                    className='py-1.5'
                                  >
                                    {/* Display icon if present */}
                                    {link.type === 'icon' && 'icon' in item && (
                                      <div className='flex items-center gap-2'>
                                        {item.icon === 'BookOpenIcon' && (
                                          <BookOpenIcon
                                            size={16}
                                            className='text-foreground opacity-60'
                                            aria-hidden='true'
                                          />
                                        )}
                                        {item.icon === 'LifeBuoyIcon' && (
                                          <LifeBuoyIcon
                                            size={16}
                                            className='text-foreground opacity-60'
                                            aria-hidden='true'
                                          />
                                        )}
                                        {item.icon === 'InfoIcon' && (
                                          <InfoIcon
                                            size={16}
                                            className='text-foreground opacity-60'
                                            aria-hidden='true'
                                          />
                                        )}
                                        <span>{item.label}</span>
                                      </div>
                                    )}

                                    {/* Display label with description if present */}
                                    {link.type === 'description' &&
                                    'description' in item ? (
                                      <div className='space-y-1'>
                                        <div className='font-medium'>
                                          {item.label}
                                        </div>
                                        <p className='text-muted-foreground line-clamp-2 text-xs'>
                                          {item.description}
                                        </p>
                                      </div>
                                    ) : (
                                      // Display simple label if not icon or description type
                                      !link.type ||
                                      (link.type !== 'icon' &&
                                        link.type !== 'description' && (
                                          <span>{item.label}</span>
                                        ))
                                    )}
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink
                          href={link.href}
                          className='text-muted-foreground hover:text-primary py-1.5 font-medium'
                        >
                          {link.label}
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          {/* Right side */}
          <div className='flex items-center gap-2'>
            <LocaleSwitcher />
            <DarkModeToggle />
            <Link href='/login' className='text-lg font-bold'>
              Login
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
