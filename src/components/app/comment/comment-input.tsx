'use client';

import { BaseForm } from '@/components/form/base-form';
import { apiConfig, MOVIE_TYPE_SINGLE, queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useCreateCommentMutation } from '@/queries';
import { commentSchema } from '@/schemaValidations';
import { CommentBodyType, MovieResType } from '@/types';
import { invalidateQueries, notify } from '@/utils';
import { FaTelegramPlane } from 'react-icons/fa';
import {
  useAuth,
  useClickOutside,
  useQueryParams,
  useValidatePermission
} from '@/hooks';
import { Button, Col, Row, TextAreaField } from '@/components/form';
import { type UseFormReturn } from 'react-hook-form';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaRegFaceGrinBeam } from 'react-icons/fa6';

type EmojiClickEvent = Event & {
  detail: {
    unicode: string;
  };
};

type EmojiPickerElement = HTMLElement & {
  i18n: unknown;
};

type CommentInputProps = {
  movie: MovieResType;
  selectedSeason: string;
};

const defaultValues: CommentBodyType = {
  content: '',
  movieId: '',
  movieItemId: ''
};

export function CommentInput({ movie, selectedSeason }: CommentInputProps) {
  const { isAuthenticated } = useAuth();
  const hasPermission = useValidatePermission();

  const canCreate =
    isAuthenticated &&
    hasPermission({
      requiredPermissions: [apiConfig.comment.create.permissionCode]
    });

  const formMethodsRef = useRef<UseFormReturn<CommentBodyType> | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const wrapperRef = useClickOutside<HTMLDivElement>(() =>
    setShowPicker(false)
  );

  const pickerContainerRef = useRef<HTMLDivElement>(null);

  const { searchParams } = useQueryParams<{ episode: string }>();

  const { mutate: createComment, isPending } = useCreateCommentMutation();

  const seasons = movie.seasons || [];
  const episode = searchParams.episode;
  const currentSeason = seasons.find(
    (season) => season.label === selectedSeason.toString()
  );

  const currentEpisode = currentSeason?.episodes?.find(
    (epi) => epi.label === episode
  );

  const initialValues = useMemo<CommentBodyType>(
    () => ({
      content: defaultValues.content,
      movieId: String(movie.id ?? defaultValues.movieId),
      movieItemId:
        movie.type === MOVIE_TYPE_SINGLE
          ? String(currentSeason?.id ?? defaultValues.movieItemId)
          : String(currentEpisode?.id ?? defaultValues.movieItemId)
    }),
    [movie.id, movie.type, currentSeason?.id, currentEpisode?.id]
  );

  const handleSubmit = (
    values: CommentBodyType,
    form?: UseFormReturn<CommentBodyType>
  ) => {
    if (values.content?.trim().length === 0) {
      notify.error('Bạn chưa nhập nội dung bình luận');
      return;
    }

    createComment(values, {
      onSuccess: async (res) => {
        if (res.result) {
          notify.success('Bình luận thành công');

          invalidateQueries(
            [queryKeys.COMMENT_LIST, { movieId: movie.id }],
            [queryKeys.MOVIE, movie.id]
          );
          form?.reset(initialValues);
        } else {
          notify.error('Bình luận thất bại');
        }
      },
      onError: (error) => {
        logger.error('[CREATE_COMMENT_ERROR]', error);
        notify.error('Bình luận thất bại');
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
      picker.className = 'comment-input-emoji-picker';
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

  if (!canCreate) return null;

  return (
    <BaseForm
      defaultValues={defaultValues}
      initialValues={initialValues}
      schema={commentSchema}
      onSubmit={(values, form) => handleSubmit(values, form)}
      className='bg-transparent-white max-640:p-2 flex flex-col gap-2 rounded-md border border-zinc-600/50 p-2.5'
    >
      {(form) => {
        formMethodsRef.current = form;
        return (
          <>
            <Row className='mb-0'>
              <Col className='grid-c-12'>
                <TextAreaField
                  control={form.control}
                  name='content'
                  className='bg-black-denim max-640:text-[13px] max-520:text-xs max-640:placeholder:text-[13px] max-520:placeholder:text-xs block w-full resize-none rounded-md border border-solid border-transparent text-sm leading-normal font-normal text-white'
                  placeholder='Viết bình luận'
                  maxLength={1000}
                />
              </Col>
            </Row>
            <Row className='mb-0 items-center gap-2'>
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
                    disabled={isPending}
                  >
                    <FaRegFaceGrinBeam className='text-golden-glow size-5' />
                  </Button>
                  <Button
                    className='text-golden-glow hover:text-golden-glow max-640:text-[13px] max-520:text-xs max-640:pr-2! max-640:py-0 h-fit gap-2 bg-transparent px-2! py-0 font-medium hover:bg-transparent'
                    disabled={isPending || !form.formState.isDirty}
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
