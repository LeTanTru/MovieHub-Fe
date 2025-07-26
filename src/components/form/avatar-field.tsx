'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { defaultAvatar } from '@/assets';

type AvatarFieldProps = {
  size?: number;
  icon?: React.ReactNode;
  src?: string;
  className?: string;
  disablePreview?: boolean;
  zoomSize?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export default function AvatarField({
  size = 80,
  zoomSize = 256,
  icon,
  src,
  className,
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className={cn(
            'max-w-md overflow-hidden rounded-full p-0',
            'ring-0 focus:ring-0 focus:outline-none',
            '[&>[data-slot=dialog-close]]:hidden'
          )}
          style={{ width: zoomSize, height: zoomSize }}
        >
          <DialogTitle asChild>
            <VisuallyHidden>Avatar preview</VisuallyHidden>
          </DialogTitle>
          <Image
            src={avatarSrc}
            alt='Avatar preview'
            width={zoomSize}
            height={zoomSize}
            className='rounded-full object-cover'
            style={{ width: zoomSize, height: zoomSize }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultAvatar.src;
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
