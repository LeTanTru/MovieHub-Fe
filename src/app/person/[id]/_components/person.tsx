'use client';

import { usePersonQuery } from '@/queries';
import { MovieList } from './movie-list';
import { NotFound } from './not-found';
import { PersonSidebar } from './person-sidebar';
import { useSlugId } from '@/hooks';
import { ErrorCode } from '@/constants';

export function Person() {
  const { id: personId } = useSlugId();
  const { data: personData, isLoading } = usePersonQuery(personId);

  const person = personData?.data;
  const errorCode = personData?.code;

  if (isLoading) {
    return (
      <>
        <PersonSidebar.Skeleton />
        <MovieList personId={personId} />
      </>
    );
  }

  if (errorCode === ErrorCode.PERSON_ERROR_NOT_FOUND || !person) {
    return <NotFound />;
  }

  return (
    <>
      <PersonSidebar person={person} />
      <MovieList personId={personId} />
    </>
  );
}
