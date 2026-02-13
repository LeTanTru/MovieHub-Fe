'use client';

import { MessageIcon } from '@/assets';
import { ButtonWatchNow } from '@/components/app/button-watch-now';
import { Button } from '@/components/form';
import { useAuth, useDisclosure } from '@/hooks';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { formatRating, getIdFromSlug, notify } from '@/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonLikeDetail } from '@/components/app/button-like';
import { useParams } from 'next/navigation';
import { ButtonAddToPlaylist } from '@/components/app/button-add-to-playlist';
import { useCheckMovieQuery } from '@/queries';
import { ButtonShareMovie } from '@/components/app/button-share';
import { scroller } from 'react-scroll';
import { ReviewModal } from '@/app/movie/[slug]/_components/review';

export default function MovieActionBar({
  isLoading = false
}: {
  isLoading?: boolean;
}) {
  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);

  const { opened, open, close } = useDisclosure();
  const { isAuthenticated } = useAuth();
  const movie = useMovieStore((s) => s.movie);

  const { data: checkMovieData } = useCheckMovieQuery({
    movieId: id,
    enabled: !!id && isAuthenticated
  });

  const isReviewed = checkMovieData?.result && checkMovieData.data;

  const handleOpenReviewModal = () => {
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
          &nbsp;để đánh giá phim
        </span>
      );
      return;
    }

    if (isReviewed) {
      notify.info('Bạn đã đánh giá phim này rồi');
      return;
    }

    open();
  };

  if (isLoading)
    return (
      <div className='relative z-3 p-7.5'>
        <div className='flex items-center justify-between gap-8'>
          <Skeleton className='skeleton h-12 w-44 rounded-4xl' />
          <div className='flex grow justify-start gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={`action-skeleton-${index}`}
                className='skeleton h-12 w-20 rounded-lg'
              />
            ))}
          </div>
          <Skeleton className='skeleton h-10 w-28 rounded-4xl' />
        </div>
      </div>
    );

  if (!movie) return null;

  return (
    <>
      <div className='relative z-3 p-7.5'>
        <div className='flex items-center justify-between gap-8'>
          <ButtonWatchNow
            className='text-watch-now inline-flex min-h-15 shrink-0 items-center justify-center gap-4 rounded-4xl bg-[linear-gradient(39deg,rgba(254,207,89,1),rgba(255,241,204,1))] px-8! py-4! text-base font-semibold opacity-100 shadow-[0_5px_10px_5px_rgba(255,218,125,.1)] transition-all duration-200 ease-linear hover:opacity-90 hover:shadow-[0_5px_10px_10px_rgba(255,218,125,.15)]'
            href={`${route.watch.path}/${slug}?season=${movie.seasons[0].label}`}
          />
          {/* Left */}
          <div className='flex grow justify-start gap-4'>
            <ButtonLikeDetail targetId={id} />
            <ButtonAddToPlaylist movieId={id} />
            <ButtonShareMovie />
            <Button
              className='hover:text-light-golden-yellow! h-fit min-w-20! flex-col px-2! text-xs hover:bg-white/10'
              variant='ghost'
              onClick={() => {
                scroller.scrollTo('discussion', {
                  duration: 200,
                  delay: 0,
                  smooth: true,
                  offset: -100
                });
              }}
            >
              <MessageIcon />
              Bình luận
            </Button>
          </div>
          {/* Right */}
          <div className='relative flex flex-col items-end gap-2 text-white'>
            <div
              className='bg-review flex cursor-pointer items-center rounded-[48px] px-2.5 py-2 transition-all duration-200 ease-linear hover:opacity-80'
              onClick={handleOpenReviewModal}
            >
              <div className='h-6 w-6 bg-[url(/logo.webp)] bg-cover bg-position-[50%]'></div>
              <span className='mr-2 ml-1 font-bold'>
                {formatRating(movie?.averageRating || 0)}
                &nbsp;({movie.reviewCount})
              </span>
              {!isReviewed && (
                <span className='text-xs underline'>Đánh giá</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <ReviewModal opened={opened} onClose={close} />
    </>
  );
}
