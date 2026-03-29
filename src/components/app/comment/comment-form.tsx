'use client';

import { BaseForm } from '@/components/form/base-form';
import { logger } from '@/logger';
import { useCreateCommentMutation, useUpdateCommentMutation } from '@/queries';
import { commentSchema } from '@/schemaValidations';
import { useCommentStore } from '@/store';
import { CommentBodyType } from '@/types';
import { notify } from '@/utils';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaRegFaceGrinBeam } from 'react-icons/fa6';
import { Button, Col, Row, TextAreaField } from '@/components/form';
import { useShallow } from 'zustand/shallow';
import { useClickOutside } from '@/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';

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

  const authorInfo = replyingComment?.author;

  const { mutateAsync: createCommentMutate, isPending: createCommentLoading } =
    useCreateCommentMutation();
  const { mutateAsync: updateCommentMutate, isPending: updateCommentLoading } =
    useUpdateCommentMutation();

  const mutationLoading = createCommentLoading || updateCommentLoading;

  const formMethodsRef = useRef<UseFormReturn<CommentBodyType> | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const wrapperRef = useClickOutside<HTMLDivElement>(() =>
    setShowPicker(false)
  );

  const pickerContainerRef = useRef<HTMLDivElement>(null);

  const defaultValues: CommentBodyType = {
    content: '',
    movieId,
    movieItemId: '',
    parentId: parentId,
    replyToId: '',
    replyToKind: 0
  };

  const initialValues: CommentBodyType = useMemo(
    () => ({
      content: editingComment?.content || '',
      movieId: editingComment?.movieId || movieId,
      movieItemId: editingComment?.movieItem?.id || '',
      parentId: editingComment?.parent?.id || parentId,
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

  const handleSubmit = async (values: CommentBodyType, form?: any) => {
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

  useEffect(() => {
    let picker: any;
    let mounted = true;

    (async () => {
      const { Picker } = await import('emoji-picker-element');
      const vi = (await import('emoji-picker-element/i18n/vi')).default;

      if (!mounted) return;

      picker = new Picker();
      picker.i18n = vi;
      picker.style.position = 'absolute';
      picker.style.zIndex = '1000';
      picker.style.opacity = '0';
      picker.style.visibility = 'hidden';
      picker.style.right = '180px';
      picker.style.top = '0px';
      picker.style.transition = 'all 0.2s linear';
      picker.style.setProperty('--border-radius', '8px');
      picker.style.setProperty('--border-size', '0');

      picker.addEventListener('emoji-click', (event: any) => {
        const emoji = event.detail.unicode;
        if (formMethodsRef.current) {
          const currentValue =
            formMethodsRef.current.getValues('content') || '';
          formMethodsRef.current.setValue('content', currentValue + emoji, {
            shouldDirty: true,
            shouldTouch: true
          });
        }
      });

      if (pickerContainerRef.current) {
        pickerContainerRef.current.appendChild(picker);
      }
    })();

    return () => {
      mounted = false;
      if (picker && picker.parentNode) picker.parentNode.removeChild(picker);
    };
  }, []);

  useEffect(() => {
    const pickerEl = pickerContainerRef.current?.querySelector('emoji-picker');

    if (pickerEl) {
      if (!showPicker) {
        pickerEl.style.opacity = '0';
        pickerEl.style.visibility = 'hidden';
      } else {
        pickerEl.style.opacity = '1';
        pickerEl.style.visibility = 'visible';
      }
    }
  }, [showPicker]);

  return (
    <BaseForm
      defaultValues={defaultValues}
      initialValues={initialValues}
      schema={commentSchema}
      onSubmit={(values, form) => handleSubmit(values, form)}
      className='bg-transparent-white max-640:p-2 mt-4 flex flex-col gap-2 rounded-md p-2.5'
    >
      {(form) => {
        formMethodsRef.current = form;
        return (
          <>
            <Row className='mb-0'>
              <Col className='w-fit'>
                {mode === 'reply' && (
                  <span className='bg-golden-glow max-640:text-[13px] max-520:text-xs max-640:mb-1 mb-2 inline-block rounded px-1.5 py-1 font-semibold text-black'>
                    {defaultMention}
                  </span>
                )}
              </Col>
              <Col>
                <TextAreaField
                  control={form.control}
                  name='content'
                  className='dark:bg-black-denim max-640:text-[13px] max-520:text-xs max-640:placeholder:text-[13px] max-520:placeholder:text-xs block w-full resize-none rounded-md! border border-solid border-transparent text-sm leading-normal font-normal text-white'
                  placeholder='Viết bình luận'
                  maxLength={1000}
                />
              </Col>
            </Row>
            <Row className='max-640:gap-2 mb-0 flex items-center gap-2'>
              <Col className='grid-c-12'>
                <div
                  className='relative ml-auto flex w-fit items-center'
                  ref={wrapperRef}
                >
                  <div className='grow'></div>
                  <div ref={pickerContainerRef} />
                  <Button
                    type='button'
                    onClick={() => setShowPicker((prev) => !prev)}
                    className='flex h-fit items-center justify-center py-0 hover:bg-transparent'
                    variant='ghost'
                    disabled={form.formState.isSubmitting}
                  >
                    <FaRegFaceGrinBeam className='text-golden-glow' />
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={onCancel}
                    className='dark:hover:text-destructive max-640:text-[13px] max-520:text-xs max-640:p-0 h-fit py-0 dark:hover:bg-transparent'
                  >
                    Hủy
                  </Button>
                  <Button
                    className='dark:text-golden-glow dark:hover:text-golden-glow max-640:text-[13px] max-520:text-xs max-640:px-2! max-640:gap-1 h-fit gap-2 py-0 font-medium dark:bg-transparent dark:hover:bg-transparent dark:hover:opacity-80'
                    disabled={mutationLoading || !form.formState.isDirty}
                    type='submit'
                    variant='ghost'
                  >
                    Gửi
                    <FaTelegramPlane />
                  </Button>
                </div>
              </Col>
            </Row>
          </>
        );
      }}
    </BaseForm>
  );
}
