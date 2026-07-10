'use client';

import { BaseForm } from '@/components/form/base-form';
import { apiConfig } from '@/constants';
import { logger } from '@/logger';
import { useCreateCommentMutation, useUpdateCommentMutation } from '@/queries';
import { commentSchema } from '@/schemaValidations';
import { useCommentStore } from '@/store';
import type { CommentBodyType } from '@/types';
import { notify } from '@/utils';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaRegFaceGrinBeam } from 'react-icons/fa6';
import { Button, Col, Row, TextAreaField } from '@/components/form';
import { useShallow } from 'zustand/shallow';
import { useAuth, useClickOutside, useValidatePermission } from '@/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';

type EmojiClickEvent = Event & {
  detail: {
    unicode: string;
  };
};

type EmojiPickerElement = HTMLElement & {
  i18n: unknown;
};

type CommentFormProps = {
  parentId: string;
  movieId: string;
  mode?: 'reply' | 'edit';
  defaultMention?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};

const defaultValues: CommentBodyType = {
  content: '',
  movieId: '',
  movieItemId: '',
  parentId: '',
  replyToId: '',
  replyToKind: 0
};

export function CommentForm({
  parentId,
  movieId,
  mode = 'reply',
  defaultMention,
  onSubmit,
  onCancel
}: CommentFormProps) {
  const { isAuthenticated } = useAuth();
  const hasPermission = useValidatePermission();

  const canCreate =
    isAuthenticated &&
    hasPermission({
      requiredPermissions: [apiConfig.comment.create.permissionCode]
    });

  const canUpdate =
    isAuthenticated &&
    hasPermission({
      requiredPermissions: [apiConfig.comment.update.permissionCode]
    });

  const { editingComment, replyingComment, setEditingComment } =
    useCommentStore(
      useShallow((s) => ({
        editingComment: s.editingComment,
        replyingComment: s.replyingComment,
        setEditingComment: s.setEditingComment
      }))
    );

  const authorInfo = replyingComment?.author;

  const { mutate: createComment, isPending: createCommentLoading } =
    useCreateCommentMutation();
  const { mutate: updateComment, isPending: updateCommentLoading } =
    useUpdateCommentMutation();

  const mutationLoading = createCommentLoading || updateCommentLoading;

  const formMethodsRef = useRef<UseFormReturn<CommentBodyType> | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const wrapperRef = useClickOutside<HTMLDivElement>(() =>
    setShowPicker(false)
  );

  const pickerContainerRef = useRef<HTMLDivElement>(null);

  const canSubmit = editingComment ? canUpdate : canCreate;

  const initialValues: CommentBodyType = useMemo(
    () => ({
      content: editingComment?.content ?? defaultValues.content,
      movieId: editingComment?.movieId ?? movieId ?? defaultValues.movieId,
      movieItemId: editingComment?.movieItem?.id ?? defaultValues.movieItemId,
      parentId:
        editingComment?.parent?.id ?? parentId ?? defaultValues.parentId,
      replyToId: authorInfo?.id?.toString() ?? defaultValues.replyToId,
      replyToKind: authorInfo?.kind ?? defaultValues.replyToKind
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

  const handleSubmit = (
    values: CommentBodyType,
    form?: UseFormReturn<CommentBodyType>
  ) => {
    if (values.content?.trim().length === 0) {
      notify.error('Bạn chưa nhập nội dung bình luận');
      return;
    }

    const mutate = editingComment ? updateComment : createComment;
    const payload = editingComment
      ? { ...values, id: editingComment.id }
      : values;

    mutate(payload, {
      onSuccess: async (res) => {
        if (res.result) {
          notify.success(
            `${editingComment ? 'Cập nhật' : 'Trả lời'} bình luận thành công`
          );
          setEditingComment(null);
          onSubmit?.();
          form?.reset(initialValues);
        } else {
          notify.error(
            `${editingComment ? 'Cập nhật' : 'Trả lời'} bình luận thất bại`
          );
        }
      },
      onError: (error) => {
        logger.error('[UPDATE_COMMENT_ERROR]', error);
        notify.error(
          `${editingComment ? 'Cập nhật' : 'Trả lời'} bình luận thất bại`
        );
      }
    });
  };

  useEffect(() => {
    let picker: EmojiPickerElement | null = null;
    let mounted = true;
    let emojiClickHandler: EventListener | null = null;

    (async () => {
      const { Picker } = await import('emoji-picker-element');
      const vi = (await import('emoji-picker-element/i18n/vi')).default;

      if (!mounted) return;

      picker = new Picker() as EmojiPickerElement;
      picker.i18n = vi;
      picker.className = 'comment-form-emoji-picker';
      picker.style.cssText = `
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s linear;
      `;
      picker.style.setProperty('--border-radius', '8px');
      picker.style.setProperty('--border-size', '0');

      emojiClickHandler = (event) => {
        const emojiEvent = event as EmojiClickEvent;
        const emoji = emojiEvent.detail.unicode;
        if (formMethodsRef.current) {
          const currentValue =
            formMethodsRef.current.getValues('content') || '';
          formMethodsRef.current.setValue('content', currentValue + emoji, {
            shouldDirty: true,
            shouldTouch: true
          });
        }
      };

      picker.addEventListener('emoji-click', emojiClickHandler);

      if (pickerContainerRef.current) {
        pickerContainerRef.current.appendChild(picker);
      }
    })();

    return () => {
      mounted = false;
      if (picker && emojiClickHandler) {
        picker.removeEventListener('emoji-click', emojiClickHandler);
      }
      if (picker && picker.parentNode) picker.parentNode.removeChild(picker);
    };
  }, []);

  useEffect(() => {
    const pickerEl = pickerContainerRef.current?.querySelector('emoji-picker');

    if (pickerEl) {
      pickerEl.style.opacity = showPicker ? '1' : '0';
      pickerEl.style.visibility = showPicker ? 'visible' : 'hidden';
    }
  }, [showPicker]);

  if (!canSubmit) return null;

  return (
    <BaseForm
      defaultValues={defaultValues}
      initialValues={initialValues}
      schema={commentSchema}
      onSubmit={(values, form) => handleSubmit(values, form)}
      className='bg-transparent-white max-640:p-2 mt-4 flex flex-col gap-2 rounded-md border-zinc-600/50 p-2.5'
    >
      {(form) => {
        formMethodsRef.current = form;
        return (
          <>
            <Row className='mb-0'>
              <Col className='w-fit'>
                {mode === 'reply' && (
                  <span className='bg-golden-glow max-640:text-[13px] max-640:mb-1 mb-2 inline-block rounded px-1.5 py-1 font-semibold text-black'>
                    {defaultMention}
                  </span>
                )}
              </Col>
              <Col>
                <TextAreaField
                  control={form.control}
                  name='content'
                  className='bg-black-denim max-640:text-[13px] max-640:placeholder:text-[13px] block w-full resize-none rounded-md! border border-solid border-transparent text-sm leading-normal font-normal text-white'
                  placeholder='Viết bình luận'
                  maxLength={1000}
                />
              </Col>
            </Row>
            <Row className='max-640:gap-2 mb-0 flex items-center gap-2'>
              <Col className='grid-c-12'>
                <div
                  className='relative ml-auto flex w-fit items-center gap-4'
                  ref={wrapperRef}
                >
                  <div ref={pickerContainerRef} />
                  <Button
                    type='button'
                    onClick={() => setShowPicker((prev) => !prev)}
                    className='flex h-fit items-center justify-center px-0! py-0 hover:bg-transparent'
                    variant='ghost'
                    disabled={mutationLoading}
                  >
                    <FaRegFaceGrinBeam className='text-golden-glow size-5' />
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={onCancel}
                    className='hover:text-destructive max-640:text-[13px] max-640:p-0 h-fit px-0! py-0 hover:bg-transparent'
                  >
                    Hủy
                  </Button>
                  <Button
                    className='text-golden-glow hover:text-golden-glow max-640:text-[13px] max-640:pr-2! max-640:py-0 h-fit gap-2 bg-transparent px-2! py-0 font-medium hover:bg-transparent'
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
