'use client';

import { cn } from '@/lib';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function MovieTabs() {
  const movieTabs = useMemo(
    () => [
      {
        key: 'episode',
        label: 'Tập phim'
      },
      {
        key: 'actor',
        label: 'Diễn viên'
      },
      {
        key: 'suggestion',
        label: 'Đề xuất'
      }
    ],
    []
  );

  const [activeKey, setActiveKey] = useState<string>(movieTabs[0].key);
  const [lineStyle, setLineStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = movieTabs.findIndex((tab) => tab.key === activeKey);
    const activeTab = tabRefs.current[activeIndex];

    if (activeTab) {
      setLineStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth
      });
    }
  }, [activeKey, movieTabs]);

  const handleClick = useCallback((key: string) => {
    setActiveKey(key);
  }, []);

  return (
    <div className='flex flex-col gap-5 px-10'>
      <div
        className='relative flex flex-wrap gap-8 border-b border-solid border-gray-700'
        role='tablist'
      >
        {movieTabs.map((tab, index) => (
          <motion.div
            role='tab'
            key={tab.key}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            className={cn(
              'flex cursor-pointer items-center justify-center py-3 text-sm font-medium text-white opacity-90 transition-colors duration-200 ease-linear',
              {
                'text-light-golden-yellow opacity-100': tab.key === activeKey
              }
            )}
            onClick={() => handleClick(tab.key)}
          >
            {tab.label}
          </motion.div>
        ))}

        <motion.div
          className='bg-light-golden-yellow absolute bottom-0 h-0.5'
          initial={false}
          animate={{
            left: lineStyle.left,
            width: lineStyle.width
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
        />
      </div>
    </div>
  );
}
