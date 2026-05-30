'use client';

import { usePersonQuery } from '@/queries';
import { MovieList } from './movie-list';
import { NotFound } from './not-found';
import { PersonSidebar } from './person-sidebar';
import { useSlugId } from '@/hooks';

export function Person() {
  const { id: personId } = useSlugId();
  const { data: person, isLoading } = usePersonQuery(personId);

  if (!person) return <NotFound />;

  return (
    <>
      <PersonSidebar person={person} loading={isLoading} />
      <MovieList personId={personId} />
    </>
  );
}
