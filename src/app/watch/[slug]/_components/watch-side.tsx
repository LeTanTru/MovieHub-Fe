'use client';

import { ButtonReview, ButtonViewReview } from '@/components/app/button-review';
import { ButtonViewComment } from '@/components/app/button-comment';
import { getIdFromSlug } from '@/utils';
import { MOVIE_WATCH_DISCUSSION_ID, PERSON_KIND_ACTOR } from '@/constants';
import { ActorList, SuggestionList } from '@/components/app/watch';
import { useMovieStore } from '@/store';
import { useParams } from 'next/navigation';
import { useShallow } from 'zustand/shallow';
import { useSuggestionMovieListQuery } from '@/queries';

export default function WatchSide() {
  const { slug } = useParams<{ slug: string }>();
  const movieId = getIdFromSlug(slug);

  const { movie, moviePersons } = useMovieStore(
    useShallow((s) => ({
      movie: s.movie,
      moviePersons: s.moviePersons
    }))
  );

  const actors = moviePersons
    .filter((moviePerson) => moviePerson.kind === PERSON_KIND_ACTOR)
    .map((moviePerson) => moviePerson.person);

  const { data: suggestionMovieListData } =
    useSuggestionMovieListQuery(movieId);

  const suggestionMovieList = suggestionMovieListData?.data || [];

  if (!movie) return null;

  return (
    <div className='max-1360:w-95 max-1120:border-none max-1120:w-full max-1120:p-7.5 max-990:p-5 max-640:pt-0 flex w-110 shrink-0 flex-col gap-7.5 border-l border-solid border-white/10 p-10'>
      <div className='flex items-center justify-end gap-4'>
        <ButtonViewComment
          className='max-1120:hidden'
          to={MOVIE_WATCH_DISCUSSION_ID}
          variant='watch'
        />
        <ButtonViewReview
          className='max-1120:hidden'
          to={MOVIE_WATCH_DISCUSSION_ID}
          variant='watch'
        />
        <ButtonReview movieId={movie.id} className='' />
      </div>

      <ActorList actors={actors} />
      <SuggestionList movieList={suggestionMovieList} />
    </div>
  );
}
