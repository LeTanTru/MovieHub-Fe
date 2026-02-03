'use client';

import { cn } from '@/lib/utils';
import { EyeIcon } from 'lucide-react';
import Image from 'next/image';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AiOutlineUser } from 'react-icons/ai';
import {
  type HTMLAttributes,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { defaultAvatar } from '@/assets';
import { useImageStatus, useIsMounted } from '@/hooks';
import { createPortal } from 'react-dom';

type AvatarFieldProps = {
  size?: number;
  src?: string;
  fallbackSrc?: string;
  className?: string;
  previewClassName?: string;
  imagePreviewClassName?: string;
  disablePreview?: boolean;
  previewSize?: number;
  width?: number;
  height?: number;
  previewAspect?: number;
  alt?: string;
  zoomOnScroll?: boolean;
  showHoverIcon?: boolean;
} & HTMLAttributes<HTMLElement>;

export default function AvatarField({
  size = 48,
  previewSize = 200,
  src,
  fallbackSrc,
  className,
  previewClassName,
  imagePreviewClassName,
  disablePreview = false,
  width,
  height,
  previewAspect = 1,
  showHoverIcon = true,
  zoomOnScroll = true,
  alt,
  ...props
}: AvatarFieldProps) {
  const isMounted = useIsMounted();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);

  const { isError: imageError } = useImageStatus(src);

  const previewRef = useRef<HTMLDivElement | null>(null);

  const shouldDisablePreview = disablePreview || !src || imageError;

  const handleClick = (e: MouseEvent) => {
    if (shouldDisablePreview) return;
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!zoomOnScroll) return;

      e.preventDefault();

      setScale((prev) => {
        let next = prev + (e.deltaY > 0 ? -0.1 : 0.1);
        next = Math.max(1, Math.min(3, next));
        return next;
      });
    },
    [zoomOnScroll]
  );

  useEffect(() => {
    if (!isModalOpen || !previewRef.current) return;

    const node = previewRef.current;
    node.addEventListener('wheel', handleWheel, { passive: false });

    return () => node.removeEventListener('wheel', handleWheel);
  }, [handleWheel, isModalOpen]);

  if (!isMounted) return null;

  return (
    <>
      <div
        {...props}
        onClick={props?.onClick ?? handleClick}
        className={cn(
          'relative mx-auto',
          { 'cursor-pointer': !shouldDisablePreview },
          className
        )}
        style={{ width: width || size, height: height || size }}
      >
        <Avatar
          className={cn('h-full w-full shadow-sm', {
            'transition-all duration-200 ease-linear hover:scale-105 hover:opacity-90':
              !shouldDisablePreview
          })}
        >
          <AvatarImage
            src={src}
            alt={alt ?? 'Avatar'}
            className='object-cover'
          />
          <AvatarFallback className='bg-muted'>
            {fallbackSrc || defaultAvatar ? (
              <Image
                src={fallbackSrc || defaultAvatar}
                alt={alt || 'Avatar'}
                width={width || size}
                height={height || size}
                className='h-full w-full object-cover'
                unoptimized
              />
            ) : (
              <AiOutlineUser className='h-1/2 w-1/2' />
            )}
          </AvatarFallback>
        </Avatar>

        {!shouldDisablePreview && showHoverIcon && (
          <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition-all duration-200 ease-linear hover:opacity-100'>
            <EyeIcon className='h-6 w-6 text-white' />
          </div>
        )}
      </div>

      {createPortal(
        <LazyMotion features={domAnimation} strict>
          <AnimatePresence>
            {isModalOpen && !shouldDisablePreview && (
              <m.div
                className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setScale(1);
                  setIsModalOpen(false);
                }}
              >
                <m.div
                  ref={previewRef}
                  className={cn(
                    'relative cursor-zoom-in rounded',
                    previewClassName
                  )}
                  style={{
                    width: previewSize * previewAspect,
                    height: previewSize
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {src && (
                    <div
                      className='relative'
                      style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'visible'
                      }}
                    >
                      <Image
                        src={src}
                        alt='Preview'
                        fill
                        className={cn(
                          'rounded-full object-cover transition-transform duration-100',
                          imagePreviewClassName
                        )}
                        style={{
                          transform: `scale(${scale})`,
                          transformOrigin: 'center center'
                        }}
                        unoptimized
                      />
                    </div>
                  )}
                </m.div>
              </m.div>
            )}
          </AnimatePresence>
        </LazyMotion>,
        document.body
      )}
    </>
  );
}
