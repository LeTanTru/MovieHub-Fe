'use client';

import { BaseForm } from '@/components/form/base-form';
import { logger } from '@/logger';
import { useCreateCommentMutation, useUpdateCommentMutation } from '@/queries';
import { commentSchema } from '@/schemaValidations';
import { useCommentStore } from '@/store';
import { AuthorInfoType, CreateCommentBodyType } from '@/types';
import { notify } from '@/utils';
import { FaTelegramPlane } from 'react-icons/fa';
import { Button, TextAreaField } from '@/components/form';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

export default function CommentForm({
  parentId,
  movieId,
  defaultMention,
  onSubmitted,
  onCancel
}: {
  parentId: string;
  movieId: string;
  defaultMention?: string;
  onSubmitted?: () => void;
  onCancel?: () => void;
}) {
  const { editingComment, replyingComment, setEditingComment } =
    useCommentStore(
      useShallow((s) => ({
        editingComment: s.editingComment,
        replyingComment: s.replyingComment,
        setEditingComment: s.setEditingComment
      }))
    );

  const authorInfo = useMemo(
    () =>
      replyingComment
        ? (JSON.parse(replyingComment?.authorInfo) as AuthorInfoType)
        : null,
    [replyingComment]
  );

  const { mutateAsync: createCommentMutate, isPending: createCommentLoading } =
    useCreateCommentMutation();
  const { mutateAsync: updateCommentMutate, isPending: updateCommentLoading } =
    useUpdateCommentMutation();

  const defaultValues: CreateCommentBodyType = {
    content: '',
    movieId,
    movieItemId: '',
    parentId: parentId,
    replyToId: '',
    replyToKind: 0
  };

  const initialValues: CreateCommentBodyType = useMemo(
    () => ({
      content: editingComment?.content || '',
      movieId: editingComment?.movieId?.toString() || movieId,
      movieItemId: editingComment?.movieItem?.id?.toString() || '',
      parentId: editingComment?.parent?.id?.toString() || parentId,
      replyToId: authorInfo?.id?.toString() || '',
      replyToKind: authorInfo?.kind || 0
    }),
    [
      authorInfo?.id,
      authorInfo?.kind,
      editingComment?.content,
      editingComment?.movieId,
      editingComment?.movieItem?.id,
      editingComment?.parent?.id,
      movieId,
      parentId
    ]
  );

  const handleSubmit = async (values: CreateCommentBodyType, form?: any) => {
    if (values.content?.trim().length === 0) {
      notify.error('Bạn chưa nhập nội dung bình luận');
      return;
    }

    const mutate = editingComment ? updateCommentMutate : createCommentMutate;
    const payload = editingComment
      ? { ...values, id: editingComment.id }
      : values;

    await mutate(payload, {
      onSuccess: async (res) => {
        if (res.result) {
          setEditingComment(null);
          onSubmitted?.();
          form?.reset(initialValues);
        } else {
          notify.error(
            `${editingComment ? 'Chỉnh sửa' : 'Trả lời'} bình luận thất bại`
          );
        }
      },
      onError: (error) => {
        logger.error(`Error while updating comment`, error);
        notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    });
  };

  return (
    <BaseForm
      defaultValues={defaultValues}
      initialValues={initialValues}
      schema={commentSchema}
      onSubmit={(values, form) => handleSubmit(values, form)}
      className='dark:bg-discussion-form mt-4 flex h-full flex-col gap-2.5 rounded-[12px] p-2.5'
    >
      {(form) => (
        <>
          <div className='relative'>
            <TextAreaField
              control={form.control}
              name='content'
              className='dark:bg-discussion-input block h-30! min-h-30! w-full resize-none rounded-md border border-solid border-transparent leading-normal font-normal text-white'
              placeholder='Viết bình luận'
              maxLength={1000}
              label={
                !editingComment && (
                  <span className='bg-light-golden-yellow rounded px-1.5 py-1 font-semibold text-black'>
                    {defaultMention}
                  </span>
                )
              }
            />
          </div>
          <div className='flex items-center gap-2'>
            <div className='grow'></div>
            <Button
              type='button'
              variant='ghost'
              onClick={onCancel}
              className='hover:text-destructive h-fit py-0 hover:bg-transparent!'
            >
              Hủy
            </Button>
            <Button
              className='text-light-golden-yellow hover:text-light-golden-yellow h-fit gap-2 bg-transparent px-4.5 py-0 font-medium hover:bg-transparent hover:opacity-80'
              disabled={
                createCommentLoading ||
                updateCommentLoading ||
                !form.formState.isDirty
              }
              loading={createCommentLoading || updateCommentLoading}
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
