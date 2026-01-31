'use client';

import './topic.css';
import { route } from '@/routes';
import { CollectionResType } from '@/types';
import { generateSlug } from '@/utils';
import Link from 'next/link';
import { FaAngleRight } from 'react-icons/fa6';

export default function TopicItemV2({ topic }: { topic: CollectionResType }) {
  const colors = JSON.parse(topic?.color || '[]');
  const gradientStyle = {
    background: `linear-gradient(to left, ${colors.join(', ')})`
  };

  return (
    <Link
      href={`${route.topic.path}/${generateSlug(topic.name)}.${topic.id}`}
      className='bg-background/50 sha relative top-0 flex overflow-hidden rounded-tl-[20px] rounded-tr-[40px] rounded-br-[20px] rounded-bl-[40px] px-6 py-5 transition-all duration-200 ease-linear after:absolute after:inset-0 after:z-3 after:rounded-tl-[64px] after:rounded-tr-[40px] after:rounded-br-[64px] after:rounded-bl-[40px] after:shadow-[inset_0_-10px_20px_0_#fff2] after:content-[""] hover:-translate-y-2'
    >
      <div
        className='absolute top-0 right-0 bottom-0 left-0'
        style={gradientStyle}
      ></div>
      <div className='relative z-3 flex h-full min-h-27.5 w-full shrink-0 flex-col items-start justify-end gap-3'>
        <h3 className='line-clamp-2 text-2xl leading-[1.3] font-bold text-white'>
          {topic.name}
        </h3>
        <div className='flex min-h-7.5 items-center justify-center gap-x-1 text-sm'>
          <span className='font-medium'>Xem toàn bộ</span>
          <FaAngleRight strokeWidth={4} />
        </div>
      </div>
    </Link>
  );
}
