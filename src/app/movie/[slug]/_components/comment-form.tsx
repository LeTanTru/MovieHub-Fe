'use client';

import { BaseForm } from '@/components/form/base-form';
import { getQueryClient } from '@/components/providers';
import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useCreateCommentMutation, useUpdateCommentMutation } from '@/queries';
import { route } from '@/routes';
import { commentSchema } from '@/schemaValidations';
import { useCommentStore, useMovieStore } from '@/store';
import { CreateCommentBodyType } from '@/types';
import { getIdFromSlug, notify } from '@/utils';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaTelegramPlane } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks';
import { Button, TextAreaField } from '@/components/form';
import { useShallow } from 'zustand/shallow';
import { useMemo } from 'react';

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
  const { editingComment, setEditingComment } = useCommentStore(
    useShallow((s) => ({
      editingComment: s.editingComment,
      setEditingComment: s.setEditingComment
    }))
  );

  const { mutateAsync: createCommentMutate, isPending: createCommentLoading } =
    useCreateCommentMutation();
  const { mutateAsync: updateCommentMutate, isPending: updateCommentLoading } =
    useUpdateCommentMutation();

  const isEditing = !!editingComment?.id;

  const defaultValues: CreateCommentBodyType = {
    id: '',
    content: '',
    movieId: id || '',
    movieItemId: null,
    parentId: null,
    replyToId: null,
    replyToKind: null
  };

  const initialValues: CreateCommentBodyType = useMemo(
    () => ({
      id: editingComment?.id?.toString() || '',
      content: editingComment?.content || ''
    }),
    [editingComment?.content, editingComment?.id]
  );

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

    const mutate = isEditing ? updateCommentMutate : createCommentMutate;

    await mutate(values, {
      onSuccess: async (res) => {
        if (res.result) {
          notify.success(
            isEditing
              ? 'Cập nhật bình luận thành công!'
              : 'Bình luận thành công!'
          );
          await queryClient.invalidateQueries({
            queryKey: [queryKeys.COMMENT_LIST]
          });
          if (!isEditing) {
            await queryClient.invalidateQueries({
              queryKey: [queryKeys.MOVIE, movie?.id?.toString()]
            });
          }
          if (isEditing) {
            setEditingComment(null);
          }
          form?.reset(defaultValues);
        } else {
          notify.error(
            isEditing ? 'Cập nhật bình luận thất bại' : 'Bình luận thất bại'
          );
        }
      },
      onError: (error) => {
        logger.error(
          `Error while ${isEditing ? 'updating' : 'creating'} comment`,
          error
        );
        notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    });
  };

  const handleCancel = () => {
    setEditingComment(null);
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
      initialValues={initialValues}
      schema={commentSchema}
      onSubmit={(values, form) => handleSubmit(values, form)}
      className='dark:bg-discussion-form flex flex-col gap-2 rounded-[12px] p-2.5'
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
              disabled={createCommentLoading || updateCommentLoading}
              onClick={handleCancel}
              type='button'
              variant='ghost'
            >
              {isEditing && 'Hủy'}
            </Button>
            <Button
              className='text-light-golden-yellow hover:text-light-golden-yellow min-h-7.5 gap-2 bg-transparent px-4.5 py-2 font-medium hover:bg-transparent hover:opacity-80'
              disabled={
                createCommentLoading ||
                updateCommentLoading ||
                !form.formState.isDirty
              }
              loading={createCommentLoading || updateCommentLoading}
              type='submit'
              variant='ghost'
            >
              {isEditing ? 'Cập nhật' : 'Gửi'}
              <FaTelegramPlane />
            </Button>
          </div>
        </>
      )}
    </BaseForm>
  );
}
