'use client';

import { MovieResType } from '@/types';
import { motion, Variants, Transition } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { route } from '@/routes';
import { isDesktopDevice, renderImageUrl } from '@/utils';
import { useIsMounted } from '@/hooks';
import { cn } from '@/lib';
import { X } from 'lucide-react';
import { MovieModal } from '@/components/app/movie-card';

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
  opacity: { duration: 0.25, ease: [0.0, 0.0, 0.2, 1] },
  default: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }
};

const MODAL_WIDTH = 400;
const EDGE_PADDING = 20;

export default function ComingSoonMovieCard({
  movie,
  dir = 'up',
  onDelete
}: {
  movie: MovieResType;
  dir?: Dir;
  onDelete?: (id: string) => void;
}) {
  const isMounted = useIsMounted();
  const itemVariants = makeItemVariants(dir);
  const isDesktop = isDesktopDevice();
  const [modalPos, setModalPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const cardRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const openModal = () => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const viewportWidth = window.innerWidth;

    let centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2 + scrollY;

    const modalLeftEdge = centerX - MODAL_WIDTH / 2;
    if (modalLeftEdge < EDGE_PADDING) {
      centerX = MODAL_WIDTH / 2 + EDGE_PADDING;
    }

    const modalRightEdge = centerX + MODAL_WIDTH / 2;
    if (modalRightEdge > viewportWidth - EDGE_PADDING) {
      centerX = viewportWidth - MODAL_WIDTH / 2 - EDGE_PADDING;
    }

    setModalPos({ x: centerX, y: centerY });
  };

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(openModal, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    hoverTimeout.current = setTimeout(() => {
      setModalPos(null);
    }, 200);
  };

  return (
    <>
      <motion.div
        key={movie.id}
        ref={cardRef}
        variants={itemVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={itemTransition}
        className='relative flex flex-col gap-3'
      >
        <Link
          className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-md pb-[56%]'
          href={`${route.movie.path}/${movie.slug}.${movie.id}`}
          onPointerEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (hoverTimeout.current) {
              clearTimeout(hoverTimeout.current);
              hoverTimeout.current = null;
            }
            setModalPos(null);
          }}
        >
          <div className='absolute bottom-0 left-4 z-3 overflow-hidden rounded-tl-sm rounded-tr-sm bg-white px-2 py-1 text-xs font-medium text-[#333] shadow-[0_0_5px_2px_rgba(0,0,0,.1)]'>
            Sắp chiếu
          </div>
          <Image
            alt={`${movie.title} - ${movie.originalTitle}`}
            className='absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-linear hover:scale-105'
            fill
            src={renderImageUrl(movie.thumbnailUrl)}
            unoptimized
            sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
          />
        </Link>

        <div className='min-h-10.5 text-left'>
          <h4
            className={cn(
              'hover:text-golden-glow mb-1 line-clamp-1 text-sm leading-5 font-normal text-white transition-colors duration-200 ease-linear',
              {
                'featured-title': movie.isFeatured
              }
            )}
          >
            <Link
              href={`${route.movie.path}/${movie.slug}.${movie.id}`}
              title={movie.title}
            >
              {movie.title}
            </Link>
          </h4>
          <h4 className='text-dark-gray line-clamp-1 text-xs leading-5 transition-colors duration-200 ease-linear hover:text-white'>
            <Link
              href={`${route.movie.path}/${movie.slug}.${movie.id}`}
              title={movie.originalTitle}
            >
              {movie.originalTitle}
            </Link>
          </h4>
        </div>

        {onDelete && (
          <button
            aria-label='Remove from favourite'
            className='absolute top-1.5 right-1.5 cursor-pointer rounded bg-white p-1 text-black shadow-lg transition-all duration-200 ease-linear'
            onClick={() => onDelete(movie.id)}
          >
            <X className='size-4' />
          </button>
        )}
      </motion.div>

      {isMounted &&
        isDesktop &&
        createPortal(
          <div
            onMouseEnter={() => {
              if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
            }}
            onMouseLeave={() => setModalPos(null)}
          >
            <MovieModal movie={movie} pos={modalPos} />
          </div>,
          document.body
        )}
    </>
  );
}
