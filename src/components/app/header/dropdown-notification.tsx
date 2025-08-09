import { Button } from '@/components/form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dropdownNotificationMotion } from '@/constants';
import { useClickOutside } from '@/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon } from 'lucide-react';
import Link from 'next/link';

export default function DropdownNotification() {
  const { nodeRef, setOpen, open } = useClickOutside();

  return (
    <div className='header-height relative' ref={nodeRef}>
      <Button
        variant='ghost'
        className='size-full rounded-full p-0! hover:bg-transparent! focus:outline-none focus-visible:ring-0'
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className='relative flex size-10 items-center justify-center rounded-full border-1 border-slate-500 p-4'>
          <BellIcon className={'size-5 fill-white stroke-2'} />
          <div className='text-accent text-md absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white'>
            0
          </div>
        </div>
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownNotificationMotion}
            initial='initial'
            animate='animate'
            exit='exit'
            className='bg-background absolute top-20 -right-8 mt-2 flex max-h-[80dvh] min-h-50 w-100 flex-col justify-between rounded-md shadow-[0px_0px_6px_2px_var(--accent)] before:absolute before:-top-4 before:right-0 before:left-0 before:h-4 before:w-full before:bg-transparent before:content-[""]'
          >
            <div className='absolute -top-2 right-11 h-2 w-4'>
              <div className='bg-background h-4 w-4 rotate-45 shadow-[-3px_-3px_4px_0px_var(--accent)]' />
            </div>
            <Tabs
              defaultValue='tab-1'
              className='flex-1 overflow-hidden rounded-lg p-0'
            >
              <TabsList className='border-b-accent w-full rounded-none border-b-1 bg-transparent py-0'>
                <TabsTrigger
                  value='tab-1'
                  className='data-[state=active]:bg-background! cursor-pointer border-0 border-r-1 border-none! border-transparent transition-all duration-200 ease-linear data-[state=active]:shadow-none data-[state=inactive]:hover:text-white!'
                >
                  Phim
                </TabsTrigger>
                <Separator orientation='vertical' />
                <TabsTrigger
                  value='tab-2'
                  className='data-[state=active]:bg-background! cursor-pointer border-0 border-r-1 border-none! border-transparent transition-all duration-200 ease-linear data-[state=active]:shadow-none data-[state=inactive]:hover:text-white!'
                >
                  Cộng đồng
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value='tab-1'
                className='flex items-center justify-center'
              >
                <div className='text-muted-foreground p-4 text-center text-sm'>
                  Không có thông báo nào
                </div>
              </TabsContent>
              <TabsContent
                value='tab-2'
                className='flex items-center justify-center'
              >
                <p className='text-muted-foreground p-4 text-center text-sm'>
                  Không có thông báo nào
                </p>
              </TabsContent>
            </Tabs>
            <Link
              className='border-t-accent hover:bg-background mt-auto block w-full border-t-1 px-4 py-2 text-center text-sm transition-all duration-500 ease-linear hover:text-slate-400'
              href={'/user/notification'}
              onClick={() => setOpen(false)}
            >
              Xem tất cả
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
