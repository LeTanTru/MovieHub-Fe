import { Button } from '@/components/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dropdownNotificationMotion } from '@/constants';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon } from 'lucide-react';
import { useState } from 'react';

export default function DropdownNotification() {
  const [open, setOpen] = useState(false);
  return (
    <div className='header-height relative'>
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
            className='bg-background absolute top-full -right-8 mt-2 w-80 rounded-md shadow-[0px_0px_6px_2px_var(--accent)] before:absolute before:-top-4 before:right-0 before:left-0 before:h-4 before:w-full before:bg-transparent before:content-[""]'
          >
            <div className='absolute -top-2 right-11 h-2 w-4'>
              <div className='bg-background h-4 w-4 rotate-45 shadow-[-3px_-3px_4px_0px_var(--accent)]' />
            </div>
            <Tabs defaultValue='tab-1'>
              <TabsList className='bg-transparent'>
                <TabsTrigger
                  value='tab-1'
                  className='data-[state=active]:bg-background! cursor-pointer border-none transition-all duration-200 ease-linear data-[state=active]:shadow-none data-[state=inactive]:hover:text-white!'
                >
                  Phim
                </TabsTrigger>
                <TabsTrigger
                  value='tab-2'
                  className='data-[state=active]:bg-background! cursor-pointer border-none transition-all duration-200 ease-linear data-[state=active]:shadow-none data-[state=inactive]:hover:text-white!'
                >
                  Cộng đồng
                </TabsTrigger>
              </TabsList>
              <TabsContent value='tab-1'>
                <p className='text-muted-foreground p-4 text-center text-xs'>
                  Phim
                </p>
              </TabsContent>
              <TabsContent value='tab-2'>
                <p className='text-muted-foreground p-4 text-center text-xs'>
                  Cộng đồng
                </p>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
