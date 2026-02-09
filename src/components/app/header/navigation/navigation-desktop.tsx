'use client';

import { ItemProps } from '@/types';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib';
import { List, ListItem } from '@/components/list';
import { usePathname } from 'next/navigation';

export default function NavigationDesktop({
  navigationList
}: {
  navigationList: ItemProps[];
}) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className='1368:block flex hidden items-center gap-2 md:gap-6'>
      <List className='flex gap-4'>
        {navigationList.map((item) =>
          item.submenu ? (
            <ListItem
              key={item.label}
              className='relative flex cursor-pointer items-center gap-1 p-2 text-sm transition-all duration-200 ease-linear'
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className='hover:text-light-golden-yellow flex items-center gap-1 whitespace-nowrap transition-colors duration-200 ease-linear'>
                {item.label}
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-all duration-200 ease-linear',
                    {
                      'rotate-180': hovered === item.label
                    }
                  )}
                />
              </div>

              <AnimatePresence>
                {hovered === item.label && (
                  <motion.ul
                    initial={{
                      opacity: 0,
                      rotateX: -10,
                      transformOrigin: 'top center',
                      transformPerspective: 800
                    }}
                    animate={{
                      opacity: 1,
                      rotateX: 0
                    }}
                    exit={{
                      opacity: 0,
                      rotateX: -10
                    }}
                    transition={{
                      duration: 0.2,
                      ease: 'linear'
                    }}
                    style={{
                      transformStyle: 'preserve-3d'
                    }}
                    className={cn(
                      'bg-navigation scrollbar-none absolute top-12 -left-50 z-50 max-h-120 w-48 grid-cols-1 overflow-y-auto rounded shadow-[0px_0px_6px_2px_var(--accent)]',
                      {
                        // 'p-0': item.subItems!.length <= 4 && item.isGrid,
                        'w-160 grid-cols-4 p-2':
                          item.subItems!.length > 4 && item.isGrid,
                        grid: item.isGrid,
                        'w-48 p-1': !item.isGrid
                      }
                    )}
                  >
                    <div className='absolute -top-2 left-20 z-[-1]'>
                      <div className='bg-navigation h-4 w-4 rotate-45 shadow-[-3px_-3px_6px_0px_var(--accent)]' />
                    </div>
                    {item.subItems?.map((sub) => (
                      <ListItem
                        key={sub.label}
                        title={sub.label}
                        className='hover:bg-accent hover:text-light-golden-yellow rounded transition-all duration-200 ease-linear'
                      >
                        <Link
                          className='line-clamp-1 block truncate px-4 py-2'
                          href={sub.href!}
                        >
                          {sub.label}
                        </Link>
                      </ListItem>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </ListItem>
          ) : (
            <ListItem
              key={item.label}
              className='hover:text-light-golden-yellow p-2 text-sm whitespace-nowrap transition-all duration-200 ease-linear'
            >
              <Link
                href={item.href!}
                className={cn({
                  'text-white': pathname === item.href
                })}
              >
                {item.label}
              </Link>
            </ListItem>
          )
        )}
      </List>
    </div>
  );
}
