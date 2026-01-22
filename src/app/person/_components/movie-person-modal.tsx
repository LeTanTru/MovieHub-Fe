'use client';

import './person-card.css';
import { ageRatings, AppConstants } from '@/constants';
import { Button } from '@/components/form';
import { FaHeart, FaPlay } from 'react-icons/fa6';
import { FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { MoviePersonResType } from '@/types';
import Link from 'next/link';
import { formatDate } from '@/utils';
import {
  TagAgeRating,
  TagCategory,
  TagNormal,
  TagWrapper
} from '@/components/tag';
import { route } from '@/routes';

export default function MoviePersonModal({
  mp,
  pos
}: {
  mp: MoviePersonResType;
  pos: { x: number; y: number } | null;
}) {
  return (
    <AnimatePresence>
      {pos && (
        <motion.div
          style={{
            top: `${pos.y}px`,
            left: `${pos.x}px`,
            position: 'absolute',
            zIndex: 50,
            transformOrigin: '50% 50%'
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'linear' }}
          className='bg-gunmetal-blue w-full max-w-105 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border-none leading-normal text-white shadow-[0_5px_10px_0_rgba(0,0,0,.2)]'
        >
          <div className='text-sm font-light text-white'>
            <div
              className='image-modal-mask relative bg-cover bg-position-[50%]'
              style={{
                backgroundImage: `url(${AppConstants.contentRootUrl}${mp.movie.posterUrl})`
              }}
            >
              <div className='absolute top-0 right-0 bottom-0 left-0 z-3 flex flex-col items-start justify-end bg-[linear-gradient(20deg,rgba(47,51,70,.6),rgba(47,51,70,0))] p-4' />
              <div className='ratio-16x9 relative w-full before:block before:pt-(--bs-aspect-ratio)' />
            </div>
            <div className='w-full bg-[linear-gradient(0deg,rgba(47,51,70,1),rgba(47,51,70,.7))] px-6 pt-0 pb-6'>
              <div className='mb-4'>
                <h3 className='font-semibold text-shadow-[0_0_3px_#00000030]'>
                  {mp.movie.title}
                </h3>
                <h3 className='text-light-golden-yellow mb-0 text-sm text-xs leading-normal font-normal'>
                  {mp.movie.originalTitle}
                </h3>
              </div>
              <div className='mb-5 flex items-stretch justify-between gap-2.5'>
                <Link href={'/'} className='block grow'>
                  <Button className='bg-light-golden-yellow color text-background border-light-golden-yellow hover:bg-light-golden-yellow w-full border'>
                    <FaPlay />
                    Xem ngay
                  </Button>
                </Link>
                <Button className='border border-white/50 bg-transparent! text-white'>
                  <FaHeart />
                  Thích
                </Button>
                <Link
                  href={`${route.movie.path}/${mp.movie.slug}.${mp.movie.id}`}
                  className='block grow'
                >
                  <Button className='w-full border border-white/50 bg-transparent! text-white'>
                    <FaInfoCircle />
                    Chi tiết
                  </Button>
                </Link>
              </div>
              <TagWrapper className='gap-1.25'>
                <TagAgeRating
                  className='flex shrink-0 items-center overflow-hidden rounded bg-white px-2 text-xs leading-5.5 font-medium text-black'
                  value={
                    ageRatings.find((age) => age.value === mp.movie.ageRating)!
                      .label
                  }
                />
                <TagNormal
                  className='bg-transparent-white inline-flex h-5.5 items-center rounded border-none px-1.5 text-xs text-white'
                  value={formatDate(mp.movie.releaseDate).split('/')[2]}
                />
              </TagWrapper>
              <div className=''>
                <TagWrapper className='mt-2 gap-1.25'>
                  {mp.movie.categories.map((item, index) => (
                    <TagCategory
                      text={item.name}
                      key={item.id}
                      className={
                        index > 0
                          ? 'before:content[""] ml-0.5 before:mr-1.5 before:h-1 before:w-1 before:rounded-full before:bg-white'
                          : ''
                      }
                    />
                  ))}
                </TagWrapper>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
