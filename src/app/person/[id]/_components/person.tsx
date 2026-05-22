'use client';

import { useParams } from 'next/navigation';
import { usePersonQuery } from '@/queries';
import { MovieList } from './movie-list';
import { NotFound } from './not-found';
import { PersonSidebar } from './person-sidebar';

export function Person() {
  const { id } = useParams<{ id: string }>();
  const { data: person, isLoading } = usePersonQuery(id);

  if (!person) return <NotFound />;

  return (
    <>
      <PersonSidebar person={person} loading={isLoading} />
      <MovieList personId={id} />
    </>
  );
}
