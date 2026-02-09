'use client';

import './person-card.css';
import { cn } from '@/lib';
import { route } from '@/routes';
import { PersonResType } from '@/types';
import { renderImageUrl } from '@/utils';
import { User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Activity } from '@/components/activity';
import { motion, Transition, Variants } from 'framer-motion';

type Dir = 'up' | 'down';

const makeItemVariants = (dir: Dir): Variants => {
  const delta = 10;
  const from = dir === 'down' ? -delta : delta;
  const toExit = dir === 'down' ? delta : -delta;

  return {
    initial: { opacity: 0, y: from, scale: 0.98, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, y: toExit, scale: 0.98, filter: 'blur(6px)' }
  };
};

const itemTransition: Transition = {
  opacity: { duration: 0.2, ease: [0.0, 0.0, 0.2, 1] },
  default: { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }
};

export default function PersonCard({
  person,
  showFullName,
  willNavigate,
  dir = 'up',
  onDelete
}: {
  person: PersonResType;
  showFullName?: boolean;
  willNavigate?: boolean;
  dir?: Dir;
  onDelete?: (id: string) => void;
}) {
  const itemVariants = makeItemVariants(dir);
  return (
    <motion.div
      key={person.id}
      variants={itemVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={itemTransition}
      className='group relative overflow-hidden rounded-lg p-0'
    >
      <div className='flex flex-col items-center justify-center gap-0'>
        {willNavigate ? (
          <Link
            href={`${route.person.path}/${person.id}`}
            className='image-mask relative mb-2 w-full shrink-0 overflow-hidden rounded-none pb-[calc(100%+40px)]'
          >
            {person.avatarPath ? (
              <Image
                alt={person.name}
                className='absolute top-0 right-0 bottom-0 left-0 rounded-lg object-cover transition-all duration-200 ease-linear hover:scale-105'
                fill
                sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
                src={renderImageUrl(person.avatarPath)}
                unoptimized
              />
            ) : (
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <User className='size-15' />
              </div>
            )}
          </Link>
        ) : (
          <div className='image-mask relative mb-2 w-full shrink-0 overflow-hidden rounded-none pb-[calc(100%+40px)]'>
            {person.avatarPath ? (
              <Image
                alt={person.name}
                className='absolute top-0 right-0 bottom-0 left-0 rounded-lg object-cover transition-all duration-200 ease-linear hover:scale-105'
                fill
                sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
                src={renderImageUrl(person.avatarPath)}
                unoptimized
              />
            ) : (
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <User className='size-15' />
              </div>
            )}
          </div>
        )}
        <div className='relative z-2 -mt-10 px-2 py-3 text-center max-sm:text-[13px]'>
          <h4
            className={cn({
              'mb-1.5': showFullName
            })}
            title={person.otherName}
          >
            {person.otherName}
          </h4>
          <Activity visible={!!showFullName}>
            <span title={person.name} className='text-actor-name text-xs'>
              {person.name}
            </span>
          </Activity>
        </div>
      </div>
      {onDelete && (
        <div
          className='absolute top-1 right-1 cursor-pointer rounded bg-white p-1 text-black opacity-0 shadow-lg transition-all duration-200 ease-linear group-hover:opacity-100 hover:opacity-80'
          onClick={() => onDelete(person.id)}
          aria-label='Remove from favourite'
        >
          <X className='size-4' />
        </div>
      )}
    </motion.div>
  );
}
