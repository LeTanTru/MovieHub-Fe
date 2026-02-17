'use client';

import './topic.css';
import { route } from '@/routes';
import Link from 'next/link';

export default function TopicItemMoreV1({ moreCount }: { moreCount: number }) {
  return (
    <Link
      href={`${route.topic.path}`}
      className='topic bg-background/50 group relative top-0 justify-between overflow-hidden rounded-md pt-5 pr-10 pb-5 pl-6 transition-all duration-200 ease-linear hover:-translate-y-2'
    >
      <div className='mask absolute top-0 right-0 bottom-0 left-0 bg-linear-to-b from-red-500 to-blue-500'></div>
      <div className='relative z-3 flex h-full min-h-27.5 w-full shrink-0 items-center justify-center'>
        <h3 className='line-clamp-2 block truncate text-[28px] leading-[1.3] font-bold text-white transition-all duration-200 ease-linear text-shadow-[0_1px_0_#eee] group-hover:opacity-80'>
          +{moreCount} chủ đề
        </h3>
      </div>
    </Link>
  );
}
