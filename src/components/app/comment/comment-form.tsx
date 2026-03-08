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

  const authorInfo = replyingComment
    ? (JSON.parse(replyingComment?.authorInfo) as AuthorInfoType)
    : null;

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

  const initialValues: CreateCommentBodyType = {
    content: editingComment?.content || '',
    movieId: editingComment?.movieId || movieId,
    movieItemId: editingComment?.movieItem?.id || '',
    parentId: editingComment?.parent?.id || parentId,
    replyToId: authorInfo?.id || '',
    replyToKind: authorInfo?.kind || 0
  };

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
      className='bg-transparent-white mt-4 flex h-full flex-col gap-2.5 rounded-md! p-2.5'
    >
      {(form) => (
        <>
          <div className='relative'>
            {!editingComment && (
              <span className='bg-golden-glow max-520:text-xs mb-2 ml-1 inline-block rounded px-1.5 py-1 font-semibold text-black'>
                {defaultMention}
              </span>
            )}
            <TextAreaField
              control={form.control}
              name='content'
              className='dark:bg-black-denim max-520:text-xs max-520:placeholder:text-xs block h-30! min-h-30! w-full resize-none rounded-md! border border-solid border-transparent leading-normal font-normal text-white'
              placeholder='Viết bình luận'
              maxLength={1000}
            />
          </div>
          <div className='flex items-center gap-2'>
            <div className='grow'></div>
            <Button
              type='button'
              variant='ghost'
              onClick={onCancel}
              className='dark:hover:text-destructive max-520:text-xs max-520:px-2 h-fit py-0 dark:hover:bg-transparent'
            >
              Hủy
            </Button>
            <Button
              className='dark:text-golden-glow dark:hover:text-golden-glow max-520:text-xs max-520:px-2 h-fit gap-2 px-4.5 py-0 font-medium dark:bg-transparent dark:hover:bg-transparent dark:hover:opacity-80'
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
