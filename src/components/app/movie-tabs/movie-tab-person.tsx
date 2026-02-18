'use client';

import MotionWrapper from './motion-wrapper';
import { PersonCard } from '@/components/app/person-card';
import {
  MOVIE_TAB_ACTOR,
  MOVIE_TAB_DIRECTOR,
  movieTabPersonTitles,
  PERSON_KIND_ACTOR
} from '@/constants';
import { cn } from '@/lib';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export default function MovieTabPerson({
  kind,
  direction
}: {
  kind: number;
  direction: number;
}) {
  const { moviePersons } = useMovieStore(
    useShallow((s) => ({ moviePersons: s.moviePersons }))
  );

  const personList = moviePersons
    .filter((moviePerson) => moviePerson.kind === kind)
    .map((moviePerson) => moviePerson.person);

  const title = movieTabPersonTitles[kind];

  return (
    <MotionWrapper
      uniqueKey={
        kind === PERSON_KIND_ACTOR ? MOVIE_TAB_ACTOR : MOVIE_TAB_DIRECTOR
      }
      direction={direction}
    >
      <h3 className='mb-8 text-lg leading-normal font-semibold text-white'>
        {title}
      </h3>
      <div
        className={cn('grid gap-6', {
          'grid-cols-6': personList.length > 0
        })}
      >
        {personList.length === 0 ? (
          <p className='text-gray-400'>
            Danh sách {title.toLowerCase()} trống. Vui lòng chờ cập nhật.
          </p>
        ) : (
          personList.map((person) => (
            <PersonCard
              person={person}
              key={`tab-item-actor-${person.id}`}
              showFullName
              willNavigate
              params={{ kind }}
            />
          ))
        )}
      </div>
    </MotionWrapper>
  );
}
