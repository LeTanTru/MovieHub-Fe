'use client';

import { AvatarField, Button } from '@/components/form';
import { Separator } from '@/components/ui/separator';
import { dropdownAvatarList, dropdownAvatarMotion } from '@/constants';
import { ProfileType } from '@/types';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import ButtonLogout from '@/components/button-logout';
import { renderImageUrl } from '@/utils';
import { List, ListItem } from '@/components/list';
import { useDisclosure } from '@/hooks';

type DropdownAvatarProps = {
  profile?: ProfileType | null;
};

export default function DropdownAvatar({ profile }: DropdownAvatarProps) {
  const { opened, open, close } = useDisclosure();

  const handleOpen = () => open();
  const handleClose = () => close();

  return (
    <div
      className='group relative'
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <Button
        variant='ghost'
        className='size-full rounded-full px-0! hover:bg-transparent! focus:outline-none focus-visible:ring-0'
      >
        {profile?.avatarPath ? (
          <AvatarField
            disablePreview
            src={renderImageUrl(profile.avatarPath)}
            className='border-none'
            size={40}
          />
        ) : (
          <div className='bg-muted flex size-10 items-center justify-center rounded-full text-xl'>
            {profile?.fullName?.charAt(0) ?? 'U'}
          </div>
        )}
        <ChevronDown />
      </Button>

      <AnimatePresence>
        {opened && (
          <motion.div
            variants={dropdownAvatarMotion}
            initial='initial'
            animate='animate'
            exit='exit'
            className='bg-popover absolute top-[calc(100%+0px)] right-1 mt-2 w-48 rounded-md shadow-[0px_0px_6px_2px_var(--accent)] before:absolute before:-top-4 before:right-0 before:left-0 before:h-4 before:w-full before:bg-transparent before:content-[""]'
          >
            <div className='absolute -top-2 right-8 h-2 w-4'>
              <div className='bg-popover h-4 w-4 rotate-45 shadow-[-3px_-3px_4px_0px_var(--accent)]' />
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
                <ListItem key={item.link} onClick={handleClose}>
                  <Link
                    href={item.link}
                    className='hover:bg-accent hover:text-accent-foreground flex h-9 w-full cursor-pointer items-center justify-start gap-2 rounded-none px-4 text-sm transition-all duration-200 ease-linear focus:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50'
                  >
                    <item.icon size={16} className={item.className} />
                    <span>{item.title}</span>
                  </Link>
                </ListItem>
              ))}
            </List>
            <Separator />
            <ButtonLogout />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
