'use client';

import AuthDialog from '@/components/app/auth';
import { Button } from '@/components/form';
import List from '@/components/list';
import ListItem from '@/components/list/ListItem';
import { useClickOutside } from '@/hooks';
import { ItemProps } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, MenuIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function NavigationMobile({
  navigationList
}: {
  navigationList: ItemProps[];
}) {
  const [openSub, setOpenSub] = useState<string | null>(null);
  const { nodeRef, open, setOpen } = useClickOutside(() => {
    setOpenSub(null);
  });
  return (
    <div className='xxl:hidden relative' ref={nodeRef}>
      <Button
        variant='ghost'
        onClick={() => setOpen((prev) => !prev)}
        className='group flex size-8 items-center justify-center rounded-md hover:bg-transparent!'
      >
        <AnimatePresence mode='wait' initial={false}>
          {open ? (
            <motion.div
              key='close'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <X className='size-8' />
            </motion.div>
          ) : (
            <motion.div
              key='search'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <MenuIcon className='size-8' />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0, transformOrigin: '5% 0%' }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.1, ease: 'linear' }}
            className='bg-accent absolute top-10 w-80 rounded p-6'
          >
            <div className='flex justify-center'>
              <AuthDialog />
            </div>
            <List className='mt-4 grid w-full grid-cols-2 gap-2'>
              {navigationList.map((item) =>
                item.submenu ? (
                  <ListItem
                    key={item.label}
                    className='relative flex cursor-pointer gap-2 py-2 text-sm'
                    onClick={() =>
                      setOpenSub((prev) =>
                        prev === item.label ? null : item.label
                      )
                    }
                  >
                    {item.label}
                    <ChevronDown className='size-5' />
                    <AnimatePresence>
                      {openSub === item.label && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            scale: 0,
                            transformOrigin: '5% 0%'
                          }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.05, ease: 'linear' }}
                          className='bg-popover absolute top-10 left-0 grid w-80 grid-cols-2 gap-2 rounded-sm p-2 px-6 py-4 shadow-lg'
                        >
                          {item.subItems!.map((sub, index) => (
                            <Link
                              key={sub.label}
                              href={sub.href!}
                              className='text-muted-foreground hover:text-primary flex cursor-pointer items-center gap-2 py-2 whitespace-nowrap'
                            >
                              {sub.icon && <sub.icon className='size-4' />}
                              <span className='text-sm font-medium'>
                                {sub.label}
                              </span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ListItem>
                ) : (
                  <Link
                    className='py-2 text-sm'
                    key={item.label}
                    href={item.href!}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </List>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
