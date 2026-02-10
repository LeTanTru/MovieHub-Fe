'use client';

import { Button, Col, Row, TextAreaField } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { Modal } from '@/components/modal';
import { getQueryClient } from '@/components/providers';
import { queryKeys, reviewRatings } from '@/constants';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { useCreateReviewMutation } from '@/queries';
import { reviewSchema } from '@/schemaValidations';
import { useMovieStore, useReviewStore } from '@/store';
import { ApiResponse, MovieResType, ReviewBodyType } from '@/types';
import { formatRating, notify } from '@/utils';
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
  const selectedReview = useReviewStore((s) => s.selectedReview);
  const movie = useMovieStore((s) => s.movie);
  const setMovie = useMovieStore((s) => s.setMovie);
  const queryClient = getQueryClient();

  const { mutateAsync: createReviewMutate, isPending: createReviewLoading } =
    useCreateReviewMutation();

  const defaultValues: ReviewBodyType = {
    id: '',
    content: '',
    movieId: movie?.id?.toString() || '',
    rate: 0 // no selection
  };

  const initialValues: ReviewBodyType = {
    id: selectedReview?.id || '',
    content: selectedReview?.content || '',
    movieId: movie?.id?.toString() || '',
    rate: selectedReview?.rate || 0
  };

  const handleSelectRating = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmit = async (values: ReviewBodyType) => {
    if (selectedRating === null) {
      notify.error('Vui lòng chọn đánh giá sao');
      return;
    }

    if (values.content?.trim().length === 0) {
      notify.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    await createReviewMutate(
      {
        ...values,
        rate: selectedRating || values.rate
      },
      {
        onSuccess: async (res) => {
          if (res.result) {
            notify.success(
              selectedReview
                ? 'Cập nhật đánh giá phim thành công!'
                : 'Đánh giá phim thành công!'
            );
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: [queryKeys.REVIEW_LIST]
              }),
              queryClient.invalidateQueries({
                queryKey: [queryKeys.CHECK_MOVIE, movie?.id?.toString()]
              }),
              queryClient.invalidateQueries({
                queryKey: [queryKeys.MOVIE, movie?.id?.toString()]
              })
            ]);
            const newMovieData = queryClient.getQueryData<
              ApiResponse<MovieResType>
            >([queryKeys.MOVIE, movie?.id?.toString()]);
            const newMovie = newMovieData?.data;
            setMovie(newMovie);
            onClose();
            setSelectedRating(null);
          } else {
            notify.error('Đánh giá phim thất bại');
          }
        },
        onError: (error) => {
          logger.error('Error while creating/updating review', error);
          notify.error('Đánh giá phim thất bại');
        }
      }
    );
  };

  return (
    <Modal
      open={opened}
      onClose={onClose}
      className='[&_.body-wrapper]:dark:bg-review-modal [&_.body-wrapper]:h-fit! [&_.body-wrapper]:min-h-fit! [&_.body-wrapper]:max-w-160'
      headerClassName='border-none'
      closeOnBackdropClick
    >
      <BaseForm
        defaultValues={defaultValues}
        initialValues={initialValues}
        schema={reviewSchema}
        onSubmit={handleSubmit}
        className='p-8 pt-0'
      >
        {(form) => (
          <>
            <div className='mb-2 text-center text-xl leading-normal font-semibold text-white'>
              <h3>{movie?.title}</h3>
            </div>
            <div className='mb-8'>
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
                          unoptimized
                        />
                      </div>
                      <span>{rating.label}</span>
                    </div>
                  ))}
              </div>
              <div className='relative mt-4'>
                <TextAreaField
                  control={form.control}
                  className='scrollbar-none block h-auto min-h-8.75 min-h-25 w-full resize-none rounded-md border border-solid bg-transparent px-5 py-4 leading-normal font-normal text-white transition-all duration-200 ease-linear focus:border-white'
                  rows={100}
                  cols={3}
                  placeholder='Viết đánh giá của bạn...'
                  maxLength={1000}
                  name='content'
                />
              </div>
            </div>
            <Row className='mb-0 flex items-center justify-center'>
              <Col span={6}>
                <Button type='button' onClick={onClose}>
                  Đóng
                </Button>
              </Col>
              <Col span={6}>
                <Button
                  className='bg-light-golden-yellow hover:bg-light-golden-yellow/80'
                  variant='primary'
                  loading={createReviewLoading}
                >
                  Gửi đánh giá
                </Button>
              </Col>
            </Row>
          </>
        )}
      </BaseForm>
    </Modal>
  );
}
