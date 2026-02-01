'use client';

import { cn } from '@/lib';
import { useMemo, useRef, useState, useEffect, useCallback } from 'react';

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
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const activeTab = tabRefs.current[activeKey];
    const container = containerRef.current;

    if (activeTab && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: activeTab.offsetWidth
      });
    }
  }, [activeKey]);

  const handleClick = useCallback((key: string) => {
    setActiveKey(key);
  }, []);

  return (
    <div className='flex flex-col gap-5 px-10'>
      <div
        ref={containerRef}
        className='relative flex flex-wrap gap-4 border-b border-solid'
        role='tablist'
      >
        {movieTabs.map((tab) => (
          <div
            role='tab'
            key={tab.key}
            ref={(el) => {
              tabRefs.current[tab.key] = el;
            }}
            className={cn(
              'flex cursor-pointer items-center justify-center px-4 py-3 text-sm font-medium text-white opacity-90 transition-opacity duration-200 ease-linear',
              {
                'text-light-golden-yellow opacity-100': tab.key === activeKey
              }
            )}
            onClick={() => handleClick(tab.key)}
          >
            {tab.label}
          </div>
        ))}

        <div
          className='bg-light-golden-yellow absolute -bottom-px h-0.5 rounded transition-all duration-300 ease-in-out'
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            willChange: 'transform, width, position',
            transform: 'translateZ(0)'
          }}
        />
      </div>
    </div>
  );
}
