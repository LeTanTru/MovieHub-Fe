'use client';

import { Button } from '@/components/form';
import { Modal } from '@/components/modal';
import { reviewRatings } from '@/constants';
import { cn } from '@/lib';
import { useMovieStore } from '@/store';
import { formatRating } from '@/utils';
import Image from 'next/image';
import { useState } from 'react';

export default function ReviewModal({
  opened,
  onClose
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const { movie } = useMovieStore((state) => state);

  const handleSelectRating = (rating: number) => {
    setSelectedRating(rating);
  };

  return (
    <Modal
      open={opened}
      onClose={onClose}
      contentClassName='dark:bg-review-modal h-auto max-w-160'
      titleClassName='border-none'
      closeOnBackdropClick
    >
      <div className='p-8 pt-0'>
        <div className='mb-2 text-center text-xl leading-normal font-semibold text-white'>
          <h3>{movie?.title}</h3>
        </div>
        <div className='mb-12'>
          <div className='mb-6 block text-center'>
            <div className='flex items-center justify-center gap-2'>
              <div className='h-10 w-10 bg-[url("/logo.webp")] bg-cover bg-position-[50%]'></div>
              <strong>{formatRating(movie?.averageRating || 0)}</strong>
              <span>/ {movie?.reviewCount || 0} lượt đánh giá</span>
            </div>
          </div>
          <div className='grid grid-cols-5 gap-x-5 rounded-2xl bg-[rgba(0,0,0,0.3)] p-4'>
            {reviewRatings
              .slice()
              .reverse()
              .map((rating) => (
                <div
                  onClick={() => handleSelectRating(+rating.value)}
                  className={cn(
                    'jucenter flex cursor-pointer flex-col items-center gap-2.5 rounded-[12px] px-2.5 py-4 text-white grayscale-100 transition-all duration-200 ease-linear select-none hover:grayscale-0',
                    {
                      'bg-rating-active grayscale-0':
                        selectedRating === rating.value
                    }
                  )}
                  key={rating.label}
                >
                  <div className='h-15 w-15 shrink-0'>
                    <Image
                      src={rating.icon}
                      alt={rating.label}
                      width={60}
                      height={60}
                    />
                  </div>
                  <span>{rating.label}</span>
                </div>
              ))}
          </div>
          <div className='relative mt-4'>
            <textarea
              className='block h-auto min-h-8.75 w-full resize-none rounded-md border border-solid bg-transparent px-5 py-4 leading-normal font-normal text-white transition-all duration-200 ease-linear focus:border-white'
              rows={3}
              cols={3}
              placeholder='Viết đánh giá của bạn (tùy chọn)'
              maxLength={1000}
            />
            <div className='absolute top-2 right-2.5 leading-none text-gray-400'>
              0/1000
            </div>
          </div>
        </div>
        <div className='flex items-center justify-center gap-4'>
          <Button
            className='bg-light-golden-yellow hover:bg-light-golden-yellow/80'
            variant='primary'
          >
            Gửi đánh giá
          </Button>
          <Button onClick={onClose} className='w-20'>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}
