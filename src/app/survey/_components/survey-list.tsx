'use client';

import SurveyCard from './survey-card';
import { useAuth, useNavigate } from '@/hooks';
import { useMakeSurveyMutation, useSurveyListQuery } from '@/queries';
import { SurveyResType } from '@/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/form';
import { notify } from '@/utils';
import { logger } from '@/logger';
import { cn } from '@/lib';

export default function SurveyList() {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();
  const { data: surveyListData, isLoading } =
    useSurveyListQuery(!!isAuthenticated);

  const { mutateAsync: makeSurveyMutate, isPending } = useMakeSurveyMutation();

  const movieList = surveyListData?.data || [];

  const [selectedMovieIds, setSelectedMovieIds] = useState<string[]>([]);

  const handleClick = (movie: SurveyResType) => {
    setSelectedMovieIds((prev) =>
      prev.includes(movie.id)
        ? prev.filter((id) => id !== movie.id)
        : [...prev, movie.id]
    );
  };

  const handleSubmit = async () => {
    await makeSurveyMutate(
      {
        movieIds: selectedMovieIds
      },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success('Hoàn thành khảo sát thành công');
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
        navigate.back();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [profile?.isMakeSurvey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div
        className={cn('mb-4 grid grid-cols-5 gap-4', {
          'pointer-events-none': isPending
        })}
      >
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <SurveyCard.Skeleton key={index} />
            ))
          : movieList.map((movie) => (
              <SurveyCard
                key={movie.id}
                movie={movie}
                onClick={handleClick}
                isSelected={selectedMovieIds.includes(movie.id)}
              />
            ))}
      </div>
      <Button
        className='ml-auto w-50'
        disabled={selectedMovieIds.length < 3 || isPending}
        onClick={handleSubmit}
        loading={isPending}
      >
        Hoàn thành
      </Button>
    </>
  );
}
