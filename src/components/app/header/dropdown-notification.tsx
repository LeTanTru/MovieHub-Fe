'use client';

import { Button } from '@/components/form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClickOutside, useDisclosure } from '@/hooks';
import { route } from '@/routes';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import { CheckCheck } from 'lucide-react';
import Link from 'next/link';
import { FaBell } from 'react-icons/fa';

export default function DropdownNotification() {
  const { opened, close, toggle } = useDisclosure();
  const dropdownRef = useClickOutside<HTMLDivElement>(close);

  const handleToggle = () => toggle();

  return (
    <div className='relative' onClick={handleToggle} ref={dropdownRef}>
      <Button
        variant='outline'
        className='group h-11 w-11 rounded-full p-0! focus:outline-none focus-visible:ring-0 dark:border-white dark:text-white dark:hover:border-white/50 dark:hover:text-white/50'
      >
        <FaBell className='size-5 stroke-2' />
        <div className='text-accent absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition-opacity duration-200 ease-linear group-hover:opacity-80'>
          0
        </div>
      </Button>
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {opened && (
            <m.div
              initial={{
                opacity: 0,
                scale: 0.5,
                transformOrigin: '87% -15px'
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
              onClick={(e) => e.stopPropagation()}
              className='bg-charade absolute top-[calc(100%+8px)] -right-8 mt-2 flex max-h-[80dvh] min-h-50 w-100 flex-col justify-between rounded shadow-[0px_0px_6px_2px_var(--accent)] before:absolute before:-top-4 before:right-0 before:left-0 before:h-4 before:w-full before:bg-transparent before:content-[""]'
            >
              <div className='absolute -top-2 right-11 h-2 w-4'>
                <div className='bg-charade h-4 w-4 rotate-45 shadow-[-3px_-3px_4px_0px_var(--accent)]' />
              </div>
              <Tabs defaultValue='tab-1' className='flex-1 rounded'>
                <div className='flex justify-between border-b'>
                  <div className='flex-1'>
                    <TabsList className='w-full justify-start gap-0 rounded-none border-none bg-transparent p-0'>
                      <TabsTrigger
                        value='tab-1'
                        className='data-[state=active]:text-golden-glow! inline-block h-full flex-0 cursor-pointer rounded border-0 border-r border-none! border-transparent transition-all duration-200 ease-linear data-[state=active]:bg-black/20! data-[state=active]:shadow-none data-[state=inactive]:hover:text-white!'
                      >
                        Phim
                      </TabsTrigger>
                      <TabsTrigger
                        value='tab-2'
                        className='data-[state=active]:text-golden-glow! inline-block h-full flex-0 cursor-pointer rounded border-0 border-r border-none! border-transparent transition-all duration-200 ease-linear data-[state=active]:bg-black/20! data-[state=active]:shadow-none data-[state=inactive]:hover:text-white!'
                      >
                        Cộng đồng
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <div>
                    <Button
                      variant='ghost'
                      className='dark:text-slate-400 dark:hover:bg-transparent dark:hover:text-white'
                    >
                      <CheckCheck />
                      Đã đọc
                    </Button>
                  </div>
                </div>
                <TabsContent
                  value='tab-1'
                  className='flex items-center justify-center'
                >
                  <div className='text-muted-foreground p-4 text-center text-sm'>
                    Không có thông báo nào 1
                  </div>
                </TabsContent>
                <TabsContent
                  value='tab-2'
                  className='flex items-center justify-center'
                >
                  <p className='text-muted-foreground p-4 text-center text-sm'>
                    Không có thông báo nào 2
                  </p>
                </TabsContent>
              </Tabs>
              <Separator />
              <Link
                className='hover:text-golden-glow mt-auto block w-full rounded-br rounded-bl px-4 py-2 text-center text-slate-400 transition-all duration-500 ease-linear hover:bg-black/10'
                href={route.user.notification.path}
                onClick={handleToggle}
              >
                Xem tất cả
              </Link>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
}
