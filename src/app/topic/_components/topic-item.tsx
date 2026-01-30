'use client';

import './topics.css';
import { route } from '@/routes';
import { CollectionResType } from '@/types';
import { generateSlug } from '@/utils';
import Link from 'next/link';
import { FaAngleRight } from 'react-icons/fa6';

export default function TopicItem({ topic }: { topic: CollectionResType }) {
  const colors = JSON.parse(topic.color);

  const gradientStyle = {
    background: `linear-gradient(to right, ${colors.join(', ')})`
  };

  return (
    <Link
      href={`${route.topic.path}/${generateSlug(topic.name)}.${topic.id}`}
      className='topic bg-background/50 group relative top-0 justify-between overflow-hidden rounded-xl pt-5 pr-10 pb-5 pl-6 transition-all duration-200 ease-linear hover:-translate-y-2'
    >
      <div
        className='mask absolute top-0 right-0 bottom-0 left-0'
        style={gradientStyle}
      ></div>
      <div className='relative z-3 flex h-full min-h-27.5 w-full shrink-0 flex-col items-start justify-end gap-3 p-0 transition-all duration-200 ease-linear'>
        <h3 className='line-clamp-2 block truncate text-[28px] leading-[1.3] font-bold text-white transition-all duration-200 ease-linear text-shadow-[0_1px_0_#eee] group-hover:opacity-80'>
          {topic.name}
        </h3>
        <div className='flex min-h-7.5 items-center justify-center gap-x-2 font-medium transition-all duration-200 ease-linear group-hover:opacity-80'>
          <span>Xem toàn bộ</span>
          <FaAngleRight />
        </div>
      </div>
    </Link>
  );
}
