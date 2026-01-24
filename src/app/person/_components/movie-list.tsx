'use client';

import { Button } from '@/components/form';
import { cn } from '@/lib';
import { useMoviePersonListQuery } from '@/queries';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PERSON_ACTOR } from '@/constants';
import MoviePersonList from '@/app/person/_components/movie-card';

export default function MovieList({ id }: { id: number }) {
  const { data } = useMoviePersonListQuery({
    personId: id,
    kind: PERSON_ACTOR
  });
  const actions: { key: string; text: string }[] = [
    { key: 'all', text: 'Tất cả' },
    { key: 'time', text: 'Thời gian' }
  ];
  const [activeKey, setActiveKey] = useState(actions[0].key);
  const moviePersonList = data?.data.content || [];

  return (
    <div className='grow'>
      <div className='border-b-transparent-white border-b border-solid'>
        <div className='max-1120:pl-0 pt-0 pb-10 pl-10'>
          <div className='max-1120:mb-4 mb-8 flex items-center justify-between gap-8'>
            <div className='max-1120:text-xl mb-0 text-xl leading-1.5 font-semibold text-white max-sm:text-[16px]'>
              Các phim đã tham gia
            </div>
            <div
              className='relative flex shrink-0 items-stretch rounded-xl border border-solid border-white p-0.5 text-sm font-normal'
              role='tablist'
            >
              {actions.map((action) => (
                <ActionButton
                  key={action.key}
                  text={action.text}
                  action={action.key}
                  activeKey={activeKey}
                  setActiveKey={setActiveKey}
                />
              ))}
            </div>
          </div>
          <MoviePersonList moviePersonList={moviePersonList} type={activeKey} />
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  action,
  text,
  activeKey,
  setActiveKey
}: {
  action: string;
  text: string;
  activeKey: string;
  setActiveKey: (key: string) => void;
}) {
  const isActive = action === activeKey;

  return (
    <div className='relative flex-1'>
      <Button
        variant='ghost'
        className={cn(
          'flex h-6.5 cursor-pointer items-center rounded px-2 text-sm transition-all duration-200 ease-linear hover:bg-transparent!',
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
