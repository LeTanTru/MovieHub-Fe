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
import { useMovieStore } from '@/store';
import { ApiResponse, MovieResType, ReviewBodyType } from '@/types';
import { formatRating, notify } from '@/utils';
import Image from 'next/image';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

export default function ReviewModal({
  opened,
  onClose
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const { movie, setMovie } = useMovieStore(
    useShallow((s) => ({ movie: s.movie, setMovie: s.setMovie }))
  );
  const queryClient = getQueryClient();

  const { mutateAsync: createReviewMutate, isPending: createReviewLoading } =
    useCreateReviewMutation();

  const defaultValues: ReviewBodyType = {
    id: '',
    content: '',
    movieId: '',
    rate: 0 // no selection
  };

  const initialValues: ReviewBodyType = {
    id: '',
    content: '',
    movieId: movie?.id || '',
    rate: 0
  };

  const handleSelectRating = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmit = async (values: ReviewBodyType) => {
    if (selectedRating === null) {
      notify.error('Bạn chưa chọn mức độ hài lòng');
      return;
    }

    if (values.content?.trim().length === 0) {
      notify.error('Bạn chưa nhập nội dung đánh giá');
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
            notify.success('Đánh giá phim thành công!');
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: [queryKeys.REVIEW_LIST]
              }),
              queryClient.invalidateQueries({
                queryKey: [queryKeys.CHECK_MOVIE, movie?.id]
              }),
              queryClient.invalidateQueries({
                queryKey: [queryKeys.MOVIE, movie?.id]
              })
            ]);
            const newMovieData = queryClient.getQueryData<
              ApiResponse<MovieResType>
            >([queryKeys.MOVIE, movie?.id]);
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
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      }
    );
  };

  return (
    <Modal
      open={opened}
      onClose={onClose}
      bodyWrapperClassName='bg-vintage-navi w-160 max-768:w-150 max-640:w-[95%]'
      confirmOnClose={isFormChanged}
    >
      <BaseForm
        defaultValues={defaultValues}
        initialValues={initialValues}
        schema={reviewSchema}
        onSubmit={handleSubmit}
        className='max-640:px-6 max-480:px-4 max-480:pb-4 max-480:pt-0 max-480:pt-0 bg-transparent px-8 pb-5'
        onFormChange={setIsFormChanged}
      >
        {(form) => (
          <>
            <div className='max-640:mb-0 mb-2 text-center text-xl leading-normal font-semibold text-white'>
              <h3>{movie?.title}</h3>
            </div>
            <div className='max-768:mb-6 max-640:mb-4 mb-8'>
              <div className='max-640:mb-4 max-480:mb-2 mb-6 block text-center'>
                <div className='flex items-center justify-center'>
                  <div className='h-10 w-10 bg-[url("/logo.webp")] bg-cover bg-position-[50%]'></div>
                  <strong>{formatRating(movie?.averageRating || 0)}</strong>
                  <span>&nbsp;/ {movie?.reviewCount || 0} lượt đánh giá</span>
                </div>
              </div>
              <div className='max-640:grid-cols-3 max-480:grid-cols-2 max-640:bg-transparent max-640:gap-3 max-480:gap-2 max-640:p-0 grid grid-cols-5 gap-5 rounded-xl bg-[rgba(0,0,0,0.3)] p-4'>
                {reviewRatings
                  .slice()
                  .reverse()
                  .map((rating) => (
                    <div
                      onClick={() => handleSelectRating(+rating.value)}
                      className={cn(
                        'max-640:bg-[rgba(0,0,0,0.3)] max-640:flex-row max-640:py-2.5 flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg px-2.5 py-4 whitespace-nowrap text-white grayscale-100 transition-all duration-200 ease-linear select-none hover:grayscale-0',
                        {
                          'bg-dark-conflower-blue grayscale-0':
                            selectedRating === rating.value
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
                    </div>
                  ))}
              </div>
              <div className='max-640:mt-3 max-480:mt-2 relative mt-4'>
                <TextAreaField
                  control={form.control}
                  className='scrollbar-none max-640:text-[13px] block h-auto min-h-8.75 min-h-25 w-full resize-none rounded-md border border-solid bg-transparent px-5 py-4 leading-normal font-normal text-white transition-all duration-200 ease-linear focus:border-white'
                  rows={100}
                  cols={3}
                  placeholder='Viết đánh giá của bạn...'
                  maxLength={1000}
                  name='content'
                />
              </div>
            </div>
            <Row className='max-480:-mx-1 mb-0 flex items-center justify-center'>
              <Col className='max-640:w-2/5 max-480:w-1/2 max-480:px-1 mb-0 w-1/3'>
                <Button
                  type='button'
                  className='max-640:text-[13px]'
                  onClick={onClose}
                >
                  Đóng
                </Button>
              </Col>
              <Col className='max-640:w-2/5 max-480:w-1/2 max-480:px-1 mb-0 w-1/3'>
                <Button
                  className='dark:bg-golden-glow dark:hover:bg-golden-glow/80 dark:disabled:bg-golden-glow/80 dark:disabled:hover:bg-golden-glow/80 max-640:text-[13px]'
                  variant='primary'
                  loading={createReviewLoading}
                  disabled={
                    !form.formState.isDirty ||
                    !selectedRating ||
                    createReviewLoading
                  }
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
