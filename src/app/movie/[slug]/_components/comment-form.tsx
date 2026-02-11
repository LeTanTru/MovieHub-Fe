'use client';

import { BaseForm } from '@/components/form/base-form';
import { getQueryClient } from '@/components/providers';
import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useCreateCommentMutation } from '@/queries';
import { route } from '@/routes';
import { commentSchema } from '@/schemaValidations';
import { useMovieStore } from '@/store';
import { CreateCommentBodyType } from '@/types';
import { getIdFromSlug, notify } from '@/utils';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaTelegramPlane } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks';

export default function CommentForm({
  isLoading = false
}: {
  isLoading?: boolean;
}) {
  const { isAuthenticated } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);
  const movie = useMovieStore((s) => s.movie);
  const queryClient = getQueryClient();

  const { mutateAsync: createCommentMutate, isPending: createCommentLoading } =
    useCreateCommentMutation();

  const defaultValues: CreateCommentBodyType = {
    id: '',
    content: '',
    movieId: id || '',
    movieItemId: null,
    parentId: null,
    replyToId: null,
    replyToKind: null
  };

  const handleSubmit = async (values: CreateCommentBodyType, form?: any) => {
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

    await createCommentMutate(
      {
        ...values
      },
      {
        onSuccess: async (res) => {
          if (res.result) {
            notify.success('Bình luận thành công!');
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: [queryKeys.COMMENT_LIST]
              }),
              queryClient.invalidateQueries({
                queryKey: [queryKeys.MOVIE, movie?.id?.toString()]
              })
            ]);
            form?.reset();
          } else {
            notify.error('Bình luận thất bại');
          }
        },
        onError: (error) => {
          logger.error('Error while creating comment', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      }
    );
  };

  if (isLoading)
    return (
      <div className='bg-discussion-form flex flex-col gap-2 rounded-[12px] p-2'>
        <Skeleton className='skeleton h-40 w-full rounded-md' />
        <div className='flex items-center gap-4'>
          <Skeleton className='skeleton h-8 w-24 rounded' />
          <div className='grow'></div>
          <Skeleton className='skeleton h-10 w-20 rounded' />
        </div>
      </div>
    );

  return (
    <BaseForm
      defaultValues={defaultValues}
      schema={commentSchema}
      onSubmit={(values, form) => handleSubmit(values, form)}
      className='dark:bg-discussion-form flex flex-col gap-2 rounded-[12px] p-2'
    >
      {(form) => (
        <>
          <div className='relative'>
            <textarea
              {...form.register('content')}
              className='bg-discussion-input block h-auto min-h-20 w-full resize-none rounded-md border border-solid border-transparent px-5 py-4 leading-normal font-normal text-white'
              rows={6}
              cols={3}
              placeholder='Viết bình luận'
              maxLength={1000}
            />
            <div className='absolute top-2 right-2.5 leading-none text-gray-400'>
              {form.watch('content')?.length || 0}/1000
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='grow'></div>
            <button
              className='text-light-golden-yellow flex min-h-7.5 cursor-pointer items-center justify-center gap-2 bg-transparent px-4.5 py-2 font-medium transition-all duration-200 ease-linear hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50'
              type='submit'
              disabled={createCommentLoading}
            >
              <span>{createCommentLoading ? 'Đang gửi...' : 'Gửi'}</span>
              <FaTelegramPlane />
            </button>
          </div>
        </>
      )}
    </BaseForm>
  );
}
