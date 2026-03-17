'use client';

import { useParams } from 'next/navigation';
import { usePersonQuery } from '@/queries';
import MovieList from './movie-list';
import NotFound from './not-found';
import PersonSidebar from './person-sidebar';

export default function Person() {
  const { id } = useParams<{ id: string }>();
  const { data: personData, isLoading: personLoading } = usePersonQuery(id);

  const person = personData?.data;

  if (!person) return <NotFound />;

  return (
    <>
      <PersonSidebar person={person} loading={personLoading} />
      <MovieList />
    </>
  );
}
