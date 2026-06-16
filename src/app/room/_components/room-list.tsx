'use client';

import { ButtonAction } from '@/components/app/button-action';
import { ROOM_TAB_LATEST, roomActions } from '@/constants';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';

export function RoomList() {
  const [activeTab, setActiveTab] = useState<string>(ROOM_TAB_LATEST);

  return (
    <div className='relative mx-auto flex h-50 w-full max-w-475 items-center justify-start px-12.5'>
      <div className='flex-start relative mb-5 flex min-h-11 items-center gap-4'>
        <h3 className='mr-4 text-[28px] leading-[1.4] font-bold text-white text-shadow-[0_2px_1px_rgba(0,0,0,.3)]'>
          Xem chung
        </h3>
        <div className='relative flex shrink-0 items-stretch' role='tablist'>
          {roomActions.map((action) => (
            <ButtonAction
              key={action.key}
              label={action.label}
              action={action.key}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              className='max-640:text-[13px] max-520:text-xs'
            />
          ))}
        </div>
        <div className='relative flex size-7.5 cursor-pointer items-center justify-center rounded-full border border-white bg-transparent transition-all duration-200 ease-linear hover:opacity-80'>
          <EllipsisVertical size={16} />
        </div>
      </div>
    </div>
  );
}
