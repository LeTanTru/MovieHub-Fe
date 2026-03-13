'use client';

import { AvatarField, Button } from '@/components/form';
import { Separator } from '@/components/ui/separator';
import { dropdownAvatarList } from '@/constants';
import { ProfileType } from '@/types';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, m } from 'framer-motion';
import Link from 'next/link';
import { renderImageUrl } from '@/utils';
import { List, ListItem } from '@/components/list';
import { useClickOutside, useDisclosure } from '@/hooks';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib';
import { ButtonLogout } from '@/components/app/button-logout';

type DropdownAvatarProps = {
  profile: ProfileType;
};

export default function DropdownAvatar({ profile }: DropdownAvatarProps) {
  const { opened, close, toggle } = useDisclosure();
  const pathname = usePathname();
  const dropdownRef = useClickOutside<HTMLDivElement>(close);

  const handleToggle = () => toggle();

  return (
    <div className='group relative' onClick={handleToggle} ref={dropdownRef}>
      <Button
        variant='ghost'
        className='size-full rounded-full p-0! focus:outline-none focus-visible:ring-0 dark:hover:bg-transparent'
      >
        <AvatarField
          src={renderImageUrl(profile.avatarPath)}
          alt={profile.fullName}
          size={44}
          disablePreview
        />
        <ChevronDown />
      </Button>

      <AnimatePresence>
        {opened && (
          <m.div
            initial={{
              opacity: 0,
              scale: 0.5,
              transformOrigin: '80% -15px'
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.5
            }}
            transition={{
              duration: 0.12,
              ease: 'linear'
            }}
            className='bg-charade absolute top-[calc(100%+8px)] right-1.5 mt-2 w-48 rounded-md shadow-[0px_0px_6px_2px_var(--accent)] before:absolute before:-top-4 before:right-0 before:left-0 before:h-4 before:w-full before:bg-transparent before:content-[""]'
          >
            <div className='absolute -top-2 right-8 h-2 w-4'>
              <div className='bg-charade h-4 w-4 rotate-45 shadow-[-3px_-3px_4px_0px_var(--accent)]' />
            </div>
            <div className='px-4 py-3'>
              <p className='truncate overflow-hidden text-sm font-medium whitespace-nowrap'>
                {profile?.fullName}
              </p>
              {profile?.username && (
                <p className='text-muted-foreground truncate text-xs'>
                  @{profile.username}
                </p>
              )}
            </div>
            <Separator />
            <List>
              {dropdownAvatarList.map((item) => (
                <ListItem key={item.link} onClick={handleToggle}>
                  <Link
                    href={item.link}
                    className={cn(
                      'hover:text-accent-foreground flex h-9 w-full cursor-pointer items-center justify-start gap-2 rounded-none px-4 text-sm opacity-70 transition-all duration-200 ease-linear hover:bg-black/20 hover:opacity-100 focus:outline-none focus-visible:ring-0',
                      {
                        'text-golden-glow opacity-100': pathname === item.link
                      }
                    )}
                  >
                    <item.icon size={16} className={item.className} />
                    <span>{item.title}</span>
                  </Link>
                </ListItem>
              ))}
            </List>
            <Separator />
            <ButtonLogout />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
