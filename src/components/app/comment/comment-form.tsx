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
  mode = 'reply',
  defaultMention,
  onSubmitted,
  onCancel
}: {
  parentId: string;
  movieId: string;
  mode?: 'reply' | 'edit';
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
    replyToId: authorInfo?.id?.toString() || '',
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
      className='bg-transparent-white max-640:p-2 mt-4 flex h-full flex-col gap-2.5 rounded-md! p-2.5'
    >
      {(form) => (
        <>
          <div className='relative'>
            {mode === 'reply' && (
              <span className='bg-golden-glow max-640:text-[13px] max-520:text-xs max-640:mb-1 mb-2 inline-block rounded px-1.5 py-1 font-semibold text-black'>
                {defaultMention}
              </span>
            )}
            <TextAreaField
              control={form.control}
              name='content'
              className='dark:bg-black-denim max-640:text-[13px] max-520:text-xs max-640:placeholder:text-[13px] max-520:placeholder:text-xs block h-30! min-h-30! w-full resize-none rounded-md! border border-solid border-transparent text-sm leading-normal font-normal text-white'
              placeholder='Viết bình luận'
              maxLength={1000}
            />
          </div>
          <div className='max-640:gap-2 flex items-center gap-2'>
            <div className='grow'></div>
            <Button
              type='button'
              variant='ghost'
              onClick={onCancel}
              className='dark:hover:text-destructive max-640:text-[13px] max-520:text-xs max-640:p-0 max-640:h-5! max-640:min-h-auto py-0 dark:hover:bg-transparent'
            >
              Hủy
            </Button>
            <Button
              className='dark:text-golden-glow dark:hover:text-golden-glow max-640:text-[13px] max-520:text-xs max-640:px-2! max-640:gap-1 h-5! min-h-auto gap-2 py-0 font-medium dark:bg-transparent dark:hover:bg-transparent dark:hover:opacity-80'
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
