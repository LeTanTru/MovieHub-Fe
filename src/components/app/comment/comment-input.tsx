'use client';

import { BaseForm } from '@/components/form/base-form';
import { getQueryClient } from '@/components/providers';
import { MOVIE_TYPE_SINGLE, queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useCreateCommentMutation } from '@/queries';
import { route } from '@/routes';
import { commentSchema } from '@/schemaValidations';
import { useMovieStore } from '@/store';
import { CreateCommentBodyType } from '@/types';
import { notify } from '@/utils';
import Link from 'next/link';
import { FaTelegramPlane } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useQueryParams } from '@/hooks';
import { Button, TextAreaField } from '@/components/form';
import { useShallow } from 'zustand/shallow';
import { UseFormReturn } from 'react-hook-form';

export default function CommentInput({
  isLoading = false
}: {
  isLoading?: boolean;
}) {
  const { isAuthenticated } = useAuth();
  const queryClient = getQueryClient();
  const { searchParams } = useQueryParams<{ episode: string }>();

  const { movie, selectedSeason } = useMovieStore(
    useShallow((s) => ({ movie: s.movie, selectedSeason: s.selectedSeason }))
  );

  const { mutateAsync: createCommentMutate, isPending: createCommentLoading } =
    useCreateCommentMutation();

  const seasons = movie?.seasons || [];
  const episode = searchParams.episode;
  const currentSeason = seasons.find(
    (season) => season.label === selectedSeason.toString()
  );

  const currentEpisode = currentSeason?.episodes?.find(
    (epi) => epi.label === episode
  );

  const defaultValues: CreateCommentBodyType = {
    content: '',
    movieId: '',
    movieItemId: ''
  };

  const initialValues: CreateCommentBodyType = {
    content: '',
    movieId: String(movie?.id || ''),
    movieItemId:
      movie?.type === MOVIE_TYPE_SINGLE
        ? String(currentSeason?.id || '')
        : String(currentEpisode?.id || '')
  };

  const handleSubmit = async (
    values: CreateCommentBodyType,
    form?: UseFormReturn<CreateCommentBodyType>
  ) => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-light-golden-yellow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để tham gia bình luận
        </span>
      );
      return;
    }

    if (values.content?.trim().length === 0) {
      notify.error('Bạn chưa nhập nội dung bình luận');
      return;
    }

    await createCommentMutate(values, {
      onSuccess: async (res) => {
        if (res.result) {
          notify.success('Bình luận thành công !');
          await queryClient.invalidateQueries({
            queryKey: [queryKeys.COMMENT_LIST]
          });
          await queryClient.invalidateQueries({
            queryKey: [queryKeys.MOVIE, movie?.id?.toString()]
          });
          form?.reset(initialValues);
        } else {
          notify.error('Bình luận thất bại');
        }
      },
      onError: (error) => {
        logger.error(`Error while creating comment`, error);
        notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    });
  };

  if (isLoading)
    return (
      <div className='bg-discussion-form flex flex-col gap-2 rounded-md p-2'>
        <Skeleton className='skeleton h-40 w-full' />
        <div className='flex items-center gap-4'>
          <Skeleton className='skeleton h-8 w-24' />
          <div className='grow'></div>
          <Skeleton className='skeleton h-10 w-20' />
        </div>
      </div>
    );

  return (
    <BaseForm
      defaultValues={defaultValues}
      initialValues={initialValues}
      schema={commentSchema}
      onSubmit={(values, form) => handleSubmit(values, form)}
      className='bg-discussion-form flex flex-col gap-2 rounded-md p-2.5'
    >
      {(form) => (
        <>
          <div className='relative'>
            <TextAreaField
              control={form.control}
              name='content'
              className='dark:bg-discussion-input block w-full resize-none rounded-md border border-solid border-transparent leading-normal font-normal text-white'
              placeholder='Viết bình luận'
              maxLength={1000}
            />
          </div>
          <div className='flex items-center gap-2'>
            <div className='grow'></div>

            <Button
              className='text-light-golden-yellow hover:text-light-golden-yellow min-h-7.5 gap-2 bg-transparent px-4.5 py-2 font-medium hover:bg-transparent hover:opacity-80'
              disabled={createCommentLoading || !form.formState.isDirty}
              loading={createCommentLoading}
              type='submit'
              variant='ghost'
            >
              Gửi
              <FaTelegramPlane />
            </Button>
          </div>
        </>
      )}
    </BaseForm>
  );
}
