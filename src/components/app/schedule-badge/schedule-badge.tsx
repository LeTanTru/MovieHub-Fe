'use client';

import { bell } from '@/assets';
import Image from 'next/image';

export default function ScheduleBadge() {
  return (
    <div className='mb-8'>
      <div className='bg-blue-party relative flex items-center gap-4 rounded-md bg-[linear-gradient(90deg,#4158D0,#C850C0)] px-4 py-2 text-white'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-black/33 pb-1'>
          <Image
            src={bell}
            alt='Bell'
            width={27}
            height={27}
            className='scale-1.2 object-cover'
            unoptimized
          />
        </div>
        <div>
          <strong>Tập 5</strong> sẽ phát sóng <strong> ngày 18-02-2026</strong>.
          Các bạn nhớ đón xem nhé 😚
        </div>
      </div>
    </div>
  );
}
