'use client';

import { Button } from '@/components/form';
import { cn } from '@/lib';
import { useMoviePersonListQuery } from '@/queries';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import route from '@/routes';
import Image from 'next/image';
import { apiConfig, PERSON_ACTOR } from '@/constants';

export default function PersonMovieList({ id }: { id: number }) {
  const res = useMoviePersonListQuery({ personId: id, kind: PERSON_ACTOR });
  const actions: { key: string; text: string }[] = [
    { key: 'all', text: 'Tất cả' },
    { key: 'time', text: 'Thời gian' }
  ];
  const [activeKey, setActiveKey] = useState(actions[0].key);
  const moviePersonList = res.data?.data;

  return (
    <div className='flex-grow-1'>
      <div className='border-b-transparent-white border-b border-solid'>
        <div className='pt-0 pb-10 pl-10'>
          {/* header */}
          <div className='mb-8 flex items-center justify-between gap-8'>
            <div className='mb-0 text-xl leading-1.5 font-semibold text-white'>
              Các phim đã tham gia
            </div>

            <div
              className='relative flex flex-shrink-0 items-stretch rounded-[8px] border border-solid border-white p-0.5 text-sm font-normal'
              role='tablist'
            >
              {actions.map((action, index) => (
                <ActionButton
                  key={action.key}
                  text={action.text}
                  action={action.key}
                  activeKey={activeKey}
                  setActiveKey={setActiveKey}
                  index={index}
                  total={actions.length}
                />
              ))}
            </div>
          </div>
          {/* body */}
          {/* show all */}
          <div className='grid grid-cols-6 gap-6'>
            {moviePersonList?.content.map((mp) => (
              <div key={mp.id} className='relative flex flex-col gap-3'>
                <Link
                  className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-[8px] pb-[150%]'
                  href={`${route.movie}/${mp.id}`}
                >
                  <div>
                    <Image
                      fill
                      src={`${apiConfig.imageProxy.baseUrl}${mp.movie.thumbnailUrl}`}
                      alt={mp.movie.title}
                      className='absolute top-0 right-0 bottom-0 left-0 h-full w-full object-cover transition-all duration-200 ease-linear hover:scale-105'
                    />
                  </div>
                </Link>
                <div className='min-h-10.5 text-center'>
                  <h4 className='hover:text-light-golden-yellow mb-0 line-clamp-1 text-sm leading-6 font-normal text-white transition-all duration-200 ease-linear'>
                    <Link href={`${route.movie}/${mp.id}`}>
                      {mp.movie.title}
                    </Link>
                  </h4>
                  <h4 className='text-light-gray mt-[5px] line-clamp-1 text-xs leading-6'>
                    <Link href={`${route.movie}/${mp.id}`}>
                      {mp.movie.originalTitle}
                    </Link>
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  action,
  text,
  activeKey,
  setActiveKey,
  index,
  total
}: {
  action: string;
  text: string;
  activeKey: string;
  setActiveKey: (key: string) => void;
  index: number;
  total: number;
}) {
  const isActive = action === activeKey;

  return (
    <div className='relative flex-1'>
      <Button
        variant='ghost'
        className={cn(
          'flex h-[26px] cursor-pointer items-center rounded px-2 text-sm transition-all duration-200 ease-linear hover:bg-transparent!',
          {
            'text-background hover:text-background': isActive,
            'text-foreground': !isActive
          }
        )}
        onClick={() => setActiveKey(action)}
      >
        {text}
      </Button>

      {isActive && (
        <motion.div
          layoutId='tab-bg'
          className='absolute inset-0 -z-1 rounded bg-white'
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      )}
    </div>
  );
}
