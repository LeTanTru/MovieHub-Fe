'use client';

import MotionWrapper from './motion-wrapper';
import { PersonCard } from '@/components/app/person-card';
import {
  MOVIE_TAB_ACTOR,
  MOVIE_TAB_DIRECTOR,
  movieTabPersonTitles,
  PERSON_KIND_ACTOR
} from '@/constants';
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

  const key = kind === PERSON_KIND_ACTOR ? MOVIE_TAB_ACTOR : MOVIE_TAB_DIRECTOR;

  return (
    <MotionWrapper uniqueKey={key} direction={direction}>
      <h3 className='max-1120:mb-4 max-800:text-xl max-640:text-lg mb-6 text-2xl font-semibold'>
        {title}
      </h3>

      {personList.length === 0 ? (
        <p className='text-gray-400'>
          Danh sách {title.toLowerCase()} trống. Vui lòng chờ cập nhật.
        </p>
      ) : (
        <div
          className='max-1600:grid-cols-5 max-1360:gap-5 max-1280:grid-cols-4 max-1280:gap-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-640:gap-3 max-520:grid-cols-2 grid grid-cols-6 gap-6'
          key={key}
        >
          {personList.map((person) => (
            <PersonCard
              person={person}
              key={`tab-item-${key}-${person.id}`}
              showFullName
              willNavigate
              params={{ kind }}
            />
          ))}
        </div>
      )}
    </MotionWrapper>
  );
}
