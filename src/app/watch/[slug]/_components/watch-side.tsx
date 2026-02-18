'use client';

import { ButtonReview, ButtonViewReview } from '@/components/app/button-review';
import { ButtonViewComment } from '@/components/app/button-comment';
import { getIdFromSlug } from '@/utils';
import { PERSON_KIND_ACTOR } from '@/constants';
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
    <div className='flex w-110 shrink-0 flex-col gap-10 border-l border-solid border-white/10 p-10'>
      <div className='flex items-center justify-end gap-4'>
        <ButtonViewComment to='discussion-watch' className='text-sm' />
        <ButtonViewReview to='discussion-watch' className='text-sm' />
        <ButtonReview movieId={movie.id} className='text-sm' />
      </div>

      <ActorList actors={actors} />
      <SuggestionList movieList={suggestionMovieList} />
    </div>
  );
}
