'use client';

import { Button } from '@/components/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDisclosure } from '@/hooks';
import { route } from '@/routes';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCheck } from 'lucide-react';
import Link from 'next/link';
import { FaBell } from 'react-icons/fa';

export default function DropdownNotification() {
  const { opened, open, close } = useDisclosure();

  const handleOpen = () => open();
  const handleClose = () => close();

  return (
    <div
      className='relative'
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <Button
        variant='outline'
        className='h-11 w-11 rounded-full border-white p-0! text-white! hover:border-white/50 hover:text-white/50! focus:outline-none focus-visible:ring-0'
      >
        <FaBell className='size-5 stroke-2' />
        <div className='text-accent absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-base'>
          0
        </div>
      </Button>
      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0,
              transformOrigin: '87% -15px'
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              transition: {
                duration: 0.2,
                ease: 'linear'
              }
            }}
            exit={{
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0,
              transition: {
                duration: 0.2,
                ease: 'linear'
              }
            }}
            className='bg-popover absolute top-[calc(100%+8px)] -right-8 mt-2 flex max-h-[80dvh] min-h-50 w-100 flex-col justify-between rounded-md shadow-[0px_0px_6px_2px_var(--accent)] before:absolute before:-top-4 before:right-0 before:left-0 before:h-4 before:w-full before:bg-transparent before:content-[""]'
          >
            <div className='absolute -top-2 right-11 h-2 w-4'>
              <div className='bg-popover h-4 w-4 rotate-45 shadow-[-3px_-3px_4px_0px_var(--accent)]' />
            </div>
            <Tabs defaultValue='tab-1' className='flex-1 rounded-lg p-0'>
              <div className='flex justify-between border-b'>
                <div className='flex-1'>
                  <TabsList className='w-full justify-start gap-x-2 rounded-none bg-transparent px-2 py-0'>
                    <TabsTrigger
                      value='tab-1'
                      className='data-[state=active]:bg-popover! inline-block flex-0 cursor-pointer border-0 border-r border-none! border-transparent transition-all duration-200 ease-linear data-[state=active]:shadow-none data-[state=inactive]:hover:text-white!'
                    >
                      Phim
                    </TabsTrigger>
                    <TabsTrigger
                      value='tab-2'
                      className='data-[state=active]:bg-popover! flex-0 cursor-pointer border-0 border-r border-none! border-transparent transition-all duration-200 ease-linear data-[state=active]:shadow-none data-[state=inactive]:hover:text-white!'
                    >
                      Cộng đồng
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div>
                  <Button
                    variant='ghost'
                    className='text-slate-400 hover:bg-transparent! hover:text-white'
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
            <Link
              className='border-t-accent hover:bg-popover mt-auto block w-full border-t px-4 py-2 text-center text-sm text-slate-400 transition-all duration-500 ease-linear hover:text-white'
              href={route.user.notification.path}
              onClick={handleClose}
            >
              Xem tất cả
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
