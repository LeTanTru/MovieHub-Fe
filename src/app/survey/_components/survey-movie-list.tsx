'use client';

import SurveyMovieCardSkeleton from './survey-movie-card-skeleton';
import SurveyMovieCard from './survey-movie-card';
import { useAuth } from '@/hooks';
import { useSurveyMovieListQuery } from '@/queries';
import { MovieSurveyResType } from '@/types';
import { useState } from 'react';

export default function SurveyMovieList() {
  const { isAuthenticated } = useAuth();
  const { data: surveyListData, isLoading } =
    useSurveyMovieListQuery(!!isAuthenticated);
  const movieList = surveyListData?.data || [];

  const [selectedMovies, setSelectedMovies] = useState<MovieSurveyResType[]>(
    []
  );

  const handleClick = (movie: MovieSurveyResType) => {
    if (selectedMovies.some((m) => m.id === movie.id)) {
      setSelectedMovies(selectedMovies.filter((m) => m.id !== movie.id));
    } else {
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  return (
    <div className='grid grid-cols-5 gap-4'>
      {isLoading
        ? Array.from({ length: 20 }).map((_, index) => (
            <SurveyMovieCardSkeleton key={index} />
          ))
        : movieList.map((movie) => (
            <SurveyMovieCard
              key={movie.id}
              movie={movie}
              onClick={handleClick}
              isSelected={!!selectedMovies.find((m) => m.id === movie.id)}
            />
          ))}
    </div>
  );
}
