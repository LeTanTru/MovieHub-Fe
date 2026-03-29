'use client';

import { BaseForm } from '@/components/form/base-form';
import { getQueryClient } from '@/components/providers/query-provider';
import { MOVIE_TYPE_SINGLE, queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useCreateCommentMutation } from '@/queries';
import { route } from '@/routes';
import { commentSchema } from '@/schemaValidations';
import { useMovieStore } from '@/store';
import { CommentBodyType } from '@/types';
import { notify } from '@/utils';
import Link from 'next/link';
import { FaTelegramPlane } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useClickOutside, useQueryParams } from '@/hooks';
import { Button, Col, Row, TextAreaField } from '@/components/form';
import { useShallow } from 'zustand/shallow';
import { type UseFormReturn } from 'react-hook-form';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaRegFaceGrinBeam } from 'react-icons/fa6';

export default function CommentInput({
  isLoading = false
}: {
  isLoading?: boolean;
}) {
  const { isAuthenticated } = useAuth();
  const queryClient = getQueryClient();
  const formMethodsRef = useRef<UseFormReturn<CommentBodyType> | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const wrapperRef = useClickOutside<HTMLDivElement>(() =>
    setShowPicker(false)
  );

  const pickerContainerRef = useRef<HTMLDivElement>(null);

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

  const defaultValues: CommentBodyType = {
    content: '',
    movieId: '',
    movieItemId: ''
  };

  const initialValues = useMemo<CommentBodyType>(
    () => ({
      content: '',
      movieId: String(movie?.id || ''),
      movieItemId:
        movie?.type === MOVIE_TYPE_SINGLE
          ? String(currentSeason?.id || '')
          : String(currentEpisode?.id || '')
    }),
    [movie?.id, movie?.type, currentSeason?.id, currentEpisode?.id]
  );

  const handleSubmit = async (
    values: CommentBodyType,
    form?: UseFormReturn<CommentBodyType>
  ) => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-golden-glow transition-all duration-200 ease-linear hover:opacity-80'
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
            queryKey: [queryKeys.MOVIE, movie?.id]
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
      picker.style.right = '120px';
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

  if (isLoading)
    return (
      <div className='bg-transparent-white flex flex-col gap-2 rounded-md p-2'>
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
      className='bg-transparent-white max-640:p-2 flex flex-col gap-2 rounded-md p-2.5'
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
                  className='dark:bg-black-denim max-640:text-[13px] max-520:text-xs max-640:placeholder:text-[13px] max-520:placeholder:text-xs block w-full resize-none rounded-md border border-solid border-transparent text-sm leading-normal font-normal text-white'
                  placeholder='Viết bình luận'
                  maxLength={1000}
                />
              </Col>
            </Row>
            <Row className='mb-0 items-center gap-2'>
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
                    className='dark:text-golden-glow dark:hover:text-golden-glow max-640:text-[13px] max-520:text-xs max-640:pr-2! max-640:py-0 h-fit gap-2 py-0 font-medium dark:bg-transparent dark:hover:bg-transparent'
                    disabled={createCommentLoading || !form.formState.isDirty}
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
