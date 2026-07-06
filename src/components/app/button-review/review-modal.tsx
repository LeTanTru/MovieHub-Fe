'use client';

import { Button, Col, Row, TextAreaField } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { Modal } from '@/components/modal';
import { queryKeys, reviewRatings } from '@/constants';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { useCreateReviewMutation } from '@/queries';
import { reviewSchema } from '@/schemaValidations';
import type { MovieResType, ReviewBodyType } from '@/types';
import { formatRating, notify, invalidateQueries } from '@/utils';
import Image from 'next/image';
import { useMemo, useState } from 'react';

type ReviewModalProps = {
  opened: boolean;
  movie: MovieResType;
  onClose: () => void;
};

const defaultValues: ReviewBodyType = {
  id: '',
  content: '',
  movieId: '',
  rate: 0 // no selection
};

export function ReviewModal({ opened, movie, onClose }: ReviewModalProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  const { mutate: createReview, isPending } = useCreateReviewMutation();

  const initialValues: ReviewBodyType = useMemo(
    () => ({
      id: defaultValues.id,
      content: defaultValues.content,
      movieId: movie.id ?? defaultValues.movieId,
      rate: defaultValues.rate
    }),
    [movie.id]
  );

  const handleSelectRating = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmit = (values: ReviewBodyType) => {
    if (selectedRating === null) {
      notify.error('Bạn chưa chọn mức độ hài lòng');
      return;
    }

    if (values.content?.trim().length === 0) {
      notify.error('Bạn chưa nhập nội dung đánh giá');
      return;
    }

    createReview(
      {
        ...values,
        rate: selectedRating || values.rate
      },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success('Đánh giá phim thành công');
            invalidateQueries(
              [queryKeys.REVIEW_LIST, { movieId: movie.id }],
              [queryKeys.CHECK_MOVIE, movie.id],
              [queryKeys.MOVIE, movie.id]
            );
            onClose();
            setSelectedRating(null);
          } else {
            notify.error('Đánh giá phim thất bại');
          }
        },
        onError: (error) => {
          logger.error('[CREATE_REVIEW_ERROR]', error);
          notify.error('Đánh giá phim thất bại');
        }
      }
    );
  };

  return (
    <Modal
      open={opened}
      onClose={onClose}
      className='bg-vintage-navi max-768:w-150 max-640:w-[95%] top-1/2 left-1/2 mx-0 w-160 -translate-x-1/2 -translate-y-1/2'
      confirmOnClose={isFormChanged}
    >
      <BaseForm
        defaultValues={defaultValues}
        initialValues={initialValues}
        schema={reviewSchema}
        onSubmit={handleSubmit}
        className='bg-transparent p-4'
        onFormChange={setIsFormChanged}
      >
        {(form) => (
          <>
            <Modal.Header className='justify-end p-0'>
              <span className='sr-only'>Đánh giá phim</span>
            </Modal.Header>
            <div className='max-640:mb-0 mb-2 text-center text-xl leading-normal font-semibold text-white'>
              <h3>{movie.title}</h3>
            </div>
            <div className='max-640:mb-4 mb-6'>
              <div className='max-640:mb-2 mb-4 block text-center'>
                <div className='flex items-center justify-center'>
                  <div className='size-10 bg-[url("/logo.webp")] bg-cover bg-position-[50%]'></div>
                  <strong>{formatRating(movie.averageRating || 0)}</strong>
                  <span>&nbsp;/ {movie.reviewCount || 0} lượt đánh giá</span>
                </div>
              </div>
              <div className='max-640:grid-cols-3 max-480:grid-cols-2 max-640:bg-transparent max-640:gap-3 max-480:gap-2 max-640:p-0 grid grid-cols-5 gap-5 rounded-xl bg-[rgba(0,0,0,0.3)] p-4'>
                {reviewRatings
                  .slice()
                  .reverse()
                  .map((rating) => (
                    <button
                      type='button'
                      onClick={() => handleSelectRating(+rating.value)}
                      className={cn(
                        'max-640:flex-row max-640:py-2.5 flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg px-2.5 py-4 whitespace-nowrap text-white grayscale-100 transition-all duration-200 ease-linear select-none hover:grayscale-0',
                        {
                          'bg-dark-conflower-blue grayscale-0':
                            selectedRating === rating.value,
                          'max-640:bg-[rgba(0,0,0,0.3)]':
                            selectedRating !== rating.value
                        }
                      )}
                      key={rating.label}
                    >
                      <div className='max-640:size-10 size-15 shrink-0'>
                        <Image
                          src={rating.icon}
                          alt={rating.label}
                          width={60}
                          height={60}
                          className='size-full object-cover'
                          unoptimized
                        />
                      </div>
                      <span className='max-640:text-[13px] max-520:text-xs'>
                        {rating.label}
                      </span>
                    </button>
                  ))}
              </div>
              <div className='max-640:mt-3 max-480:mt-2 relative mt-4'>
                <TextAreaField
                  control={form.control}
                  className='max-640:text-[13px] block h-full min-h-25 w-full resize-none rounded-md border border-solid bg-transparent px-5 py-4 text-sm leading-normal font-normal text-white transition-all duration-200 ease-linear focus:border-white'
                  placeholder='Viết đánh giá của bạn... (Tùy chọn)'
                  maxLength={500}
                  rows={6}
                  name='content'
                  maxLengthClassName='-bottom-4 right-1.5'
                />
              </div>
            </div>
            <Row className='max-480:-mx-1 mb-0 flex items-center justify-center'>
              <Col className='grid-c-4 max-640:grid-c-6'>
                <Button
                  type='button'
                  className='max-640:text-[13px]'
                  onClick={onClose}
                >
                  Đóng
                </Button>
              </Col>
              <Col className='grid-c-4 max-640:grid-c-6'>
                <Button
                  className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80 max-640:text-[13px]'
                  variant='primary'
                  loading={isPending}
                  disabled={
                    !form.formState.isDirty || !selectedRating || isPending
                  }
                >
                  Gửi đánh giá
                </Button>
              </Col>
            </Row>
          </>
        )}
      </BaseForm>
      <Modal.Confirm message='Bạn có chắc chắn muốn hủy không ?' />
    </Modal>
  );
}
