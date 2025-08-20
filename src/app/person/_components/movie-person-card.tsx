'use client';

import { apiConfig } from '@/constants';
import { cn } from '@/lib';
import route from '@/routes';
import { MoviePersonResType } from '@/types';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type Dir = 'up' | 'down';

const makeItemVariants = (dir: Dir) => {
  const delta = 10;
  const from = dir === 'down' ? -delta : delta;
  const toExit = dir === 'down' ? delta : -delta;

  return {
    initial: { opacity: 0, y: from, scale: 0.98, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, y: toExit, scale: 0.98, filter: 'blur(6px)' }
  } satisfies import('framer-motion').Variants;
};

const itemTransition: import('framer-motion').Transition = {
  opacity: { duration: 0.25, ease: [0.0, 0.0, 0.2, 1] },
  default: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }
};

export default function MoviePersonList({
  moviePersonList,
  type = 'all'
}: {
  moviePersonList: MoviePersonResType[];
  type: string;
}) {
  return (
    <LayoutGroup>
      <AnimatePresence mode='wait'>
        <motion.div
          key={type}
          initial={{ opacity: 0, y: type === 'all' ? -10 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: type === 'all' ? -10 : 10 }}
        >
          {type === 'all' ? (
            <MovieCardByAll type={type} moviePersonList={moviePersonList} />
          ) : (
            <MoviePersonCardByTime
              type={type}
              moviePersonList={moviePersonList}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
}

function MovieCardByAll({
  moviePersonList,
  type
}: {
  moviePersonList: MoviePersonResType[];
  type: string;
}) {
  const dir: Dir = type === 'all' ? 'down' : 'up';
  const itemVariants = makeItemVariants(dir);
  return (
    <div className='grid grid-cols-6 gap-6'>
      <AnimatePresence mode='popLayout' initial={false}>
        {moviePersonList?.map((mp) => (
          <motion.div
            key={mp.id}
            layout
            variants={itemVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            transition={itemTransition}
            className='relative flex flex-col gap-3'
          >
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
                <Link href={`${route.movie}/${mp.movie.id}`}>
                  {mp.movie.title}
                </Link>
              </h4>
              <h4 className='text-light-gray mt-[5px] line-clamp-1 text-xs leading-6'>
                <Link href={`${route.movie}/${mp.movie.id}`}>
                  {mp.movie.originalTitle}
                </Link>
              </h4>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function groupByYear(list: MoviePersonResType[]) {
  return list.reduce((acc: Record<string, MoviePersonResType[]>, mp) => {
    const year = mp.movie.releaseDate?.split(' ')[0].split('/')[2];
    if (!year) return acc;
    if (!acc[year]) acc[year] = [];
    acc[year].push(mp);
    return acc;
  }, {});
}

function MoviePersonCardByTime({
  moviePersonList,
  type
}: {
  moviePersonList: MoviePersonResType[];
  type: string;
}) {
  const grouped = groupByYear(moviePersonList);
  const dir: Dir = type === 'all' ? 'down' : 'up';
  const itemVariants = makeItemVariants(dir);

  return Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .map((year, index) => (
      <div
        key={year}
        className={cn('relative -ml-10 flex items-start justify-start', {
          'mt-12': index > 0
        })}
      >
        <div className='before:bg-light-golden-yellow relative z-2 h-20 w-20 flex-shrink-0 text-center font-semibold text-white before:absolute before:top-0 before:-left-[5px] before:h-2.5 before:w-2.5 before:rounded-full before:content-[""]'>
          <span className='absolute flex h-full w-full -rotate-90 items-center justify-end text-[40px] font-black tracking-[3px] opacity-20'>
            {year}
          </span>
        </div>
        <div className='relative z-3 grid flex-grow-1 grid-cols-6 gap-x-4 gap-y-6'>
          <AnimatePresence mode='popLayout' initial={false}>
            {grouped[year].map((mp) => (
              <motion.div
                key={mp.id}
                layout
                variants={itemVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                transition={itemTransition}
                className='relative flex w-full flex-col gap-3'
              >
                <Link
                  className='bg-accent relative block h-0 w-full overflow-hidden rounded-[8px] pb-[150%]'
                  href={`${route.movie}/${mp.movie.id}`}
                >
                  <div>
                    <Image
                      src={`${apiConfig.imageProxy.baseUrl}${mp.movie.thumbnailUrl}`}
                      fill
                      alt={mp.movie.title}
                      className='absolute top-0 right-0 bottom-0 left-0 h-full w-full object-cover transition-all duration-200 ease-linear hover:scale-105'
                    />
                  </div>
                </Link>
                <div className='min-h-10.5 text-center'>
                  <h4 className='hover:text-light-golden-yellow mb-0 line-clamp-1 text-sm leading-6 font-normal text-white transition-all duration-200 ease-linear'>
                    <Link href={`${route.movie}/${mp.movie.id}`}>
                      {mp.movie.title}
                    </Link>
                  </h4>
                  <h4 className='text-light-gray mt-[5px] line-clamp-1 text-xs leading-6'>
                    <Link href={`${route.movie}/${mp.movie.id}`}>
                      {mp.movie.originalTitle}
                    </Link>
                  </h4>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    ));
}
