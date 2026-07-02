'use client';

import { roomStates } from '@/constants';
import { useClickOutside } from '@/hooks';
import { cn } from '@/lib';
import { AnimatePresence, m } from 'framer-motion';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';

type RoomFilterProps = {
  roomState: number;
  setRoomState: (state: number) => void;
};

export function RoomFilter({ roomState, setRoomState }: RoomFilterProps) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() =>
    setShowDropdown(false)
  );

  const handleToggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleSelectRoomState = (state: number) => {
    setRoomState(state);
    setShowDropdown(false);
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <div
        onClick={handleToggleDropdown}
        className='max-640:size-6 flex size-7.5 cursor-pointer items-center justify-center rounded-full border border-white bg-transparent transition-all duration-200 ease-linear hover:opacity-80'
      >
        <EllipsisVertical className='max-640:size-3.5 size-4' />
      </div>
      <AnimatePresence>
        {showDropdown && (
          <m.div
            initial={{
              opacity: 0,
              scale: 0.8
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.8
            }}
            transition={{ duration: 0.1, ease: 'linear' }}
            className={cn(
              'max-640:min-w-36 absolute top-10 -left-5 z-10 min-w-40 origin-[20px_-50%] overflow-hidden rounded-lg bg-gray-100 py-1 shadow-lg'
            )}
          >
            {roomStates.map((state) => {
              const isActive = roomState === Number(state.value);

              return (
                <button
                  key={state.value}
                  type='button'
                  className={cn(
                    'max-640:text-[13px] max-520:text-xs w-full cursor-pointer px-4 py-2 text-left text-black transition-all duration-200 ease-linear hover:text-black/80',
                    {
                      'bg-golden-glow': isActive,
                      'hover:bg-gray-300': !isActive
                    }
                  )}
                  onClick={() => handleSelectRoomState(Number(state.value))}
                >
                  <span>{state.label}</span>
                </button>
              );
            })}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
