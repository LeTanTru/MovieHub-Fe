'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { defaultAvatar } from '@/assets';
import { motion, AnimatePresence } from 'framer-motion';

type AvatarFieldProps = {
  size?: number;
  icon?: React.ReactNode;
  src?: string;
  className?: string;
  previewClassName?: string;
  disablePreview?: boolean;
  zoomSize?: number;
} & React.HTMLAttributes<HTMLElement>;

export default function AvatarField({
  size = 80,
  zoomSize = 256,
  icon,
  src,
  className,
  previewClassName,
  disablePreview = false,
  ...props
}: AvatarFieldProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleClick = () => {
    if (!disablePreview && src) {
      setIsModalOpen(true);
    }
  };

  const avatarSrc = imageError || !src ? defaultAvatar : src;

  return (
    <>
      <div
        {...props}
        className={cn(
          'bg-muted flex cursor-pointer items-center justify-center overflow-hidden rounded-full border shadow-sm',
          className
        )}
        style={{ width: size, height: size }}
        onClick={handleClick}
      >
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            width={size}
            height={size}
            alt='Avatar'
            className='object-cover'
            onError={() => setImageError(true)}
          />
        ) : (
          icon || <ImageIcon className='h-1/2 w-1/2 opacity-40' />
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className={cn(
                'relative overflow-hidden rounded-full select-none',
                previewClassName
              )}
              style={{ width: zoomSize, height: zoomSize }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={avatarSrc}
                alt='Avatar preview'
                width={zoomSize}
                height={zoomSize}
                className={cn('rounded-full object-cover', previewClassName)}
                style={{ width: zoomSize, height: zoomSize }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultAvatar.src;
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
