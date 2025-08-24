'use client';
import { Button } from '@/components/form';
import { cn } from '@/lib';
import { useMoviePersonListQuery } from '@/queries';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PERSON_ACTOR } from '@/constants';
import MoviePersonList from '@/app/person/_components/movie-person-card';

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
        <div className='pt-0 pb-10 pl-10 max-[1120px]:pl-0'>
          <div className='mb-8 flex items-center justify-between gap-8 max-[1120px]:mb-4'>
            <div className='mb-0 text-xl leading-1.5 font-semibold text-white max-[1120px]:text-xl max-[640px]:text-[16px]'>
              Các phim đã tham gia
            </div>
            <div
              className='relative flex flex-shrink-0 items-stretch rounded-[8px] border border-solid border-white p-0.5 text-sm font-normal'
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
          <MoviePersonList
            moviePersonList={moviePersonList?.content || []}
            type={activeKey}
          />
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
