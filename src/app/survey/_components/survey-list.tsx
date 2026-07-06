'use client';

import { SurveyCard } from './survey-card';
import { useAuth, useNavigate } from '@/hooks';
import { useMakeSurveyMutation, useSurveyListQuery } from '@/queries';
import type { SurveyResType } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/form';
import { notify } from '@/utils';
import { logger } from '@/logger';
import { cn } from '@/lib';

export function SurveyList() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  const { isAuthenticated, profile } = useAuth();
  const { data: movieList = [], isLoading } =
    useSurveyListQuery(!!isAuthenticated);

  const { mutate: makeSurvey, isPending } = useMakeSurveyMutation();

  const [selectedMovieIds, setSelectedMovieIds] = useState<string[]>([]);

  const handleClick = (movie: SurveyResType) => {
    setSelectedMovieIds((prev) =>
      prev.includes(movie.id)
        ? prev.filter((id) => id !== movie.id)
        : [...prev, movie.id]
    );
  };

  const handleSubmit = () => {
    makeSurvey(
      {
        movieIds: selectedMovieIds
      },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success('Hoàn thành khảo sát thành công');
            window.location.reload();
          } else {
            notify.error('Hoàn thành khảo sát thất bại');
          }
        },
        onError: (error) => {
          logger.error('[MAKE_SURVEY_ERROR]', error);
          notify.error('Hoàn thành khảo sát thất bại');
        }
      }
    );
  };

  useEffect(() => {
    if (profile?.isMakeSurvey) {
      notify.info('Bạn đã hoàn thành khảo sát rồi');
      const timeoutId = setTimeout(() => {
        navigateRef.current.back();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [profile?.isMakeSurvey]);

  return (
    <>
      <div
        className={cn(
          'max-1360:grid-cols-4 max-990:grid-cols-5 max-860:grid-cols-4 max-640:grid-cols-3 max-520:grid-cols-2 max-480:gap-3 mb-4 grid grid-cols-5 gap-4',
          {
            'pointer-events-none': isPending
          }
        )}
      >
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <SurveyCard.Skeleton key={index} />
            ))
          : movieList.map((movie, index) => (
              <SurveyCard
                key={movie.id}
                movie={movie}
                onClick={handleClick}
                isSelected={selectedMovieIds.includes(movie.id)}
                priority={index < 10}
              />
            ))}
      </div>
      {!isLoading && (
        <Button
          className='max-640:w-full mx-auto w-1/2'
          disabled={selectedMovieIds.length < 3 || isPending}
          onClick={handleSubmit}
          loading={isPending}
        >
          Hoàn thành (Chọn ít nhất 3 phim)
        </Button>
      )}
    </>
  );
}
