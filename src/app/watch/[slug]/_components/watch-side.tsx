'use client';

import SuggestionList from './suggestion-list';
import { defaultAvatar, MessageIcon } from '@/assets';
import { ButtonReview } from '@/components/app/button-review';
import { Button } from '@/components/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PERSON_KIND_ACTOR } from '@/constants';
import { cn } from '@/lib';
import { useSuggestionMovieListQuery } from '@/queries';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { PersonResType } from '@/types';
import { getIdFromSlug, renderImageUrl } from '@/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaStar } from 'react-icons/fa6';
import { scroller } from 'react-scroll';
import { useShallow } from 'zustand/shallow';

const ActorCell = ({ actor }: { actor: PersonResType }) => {
  return (
    <div className='flex flex-col items-center gap-3 text-center'>
      <Link
        href={`${route.person.path}/${actor.id}`}
        className='bg-main-background relative h-20 w-20 shrink-0 overflow-hidden rounded-full'
      >
        <Avatar className='h-full w-full transition-all duration-200 ease-linear hover:scale-105'>
          <AvatarImage
            src={renderImageUrl(actor.avatarPath)}
            alt={actor.otherName}
          />
          <AvatarFallback>
            <AvatarImage src={defaultAvatar.src} alt={actor.otherName} />
          </AvatarFallback>
        </Avatar>
      </Link>
      <Link
        href={`${route.person.path}/${actor.id}`}
        className='hover:text-light-golden-yellow mb-1.5 line-clamp-2 leading-normal font-normal whitespace-normal text-white transition-all duration-200 ease-linear'
        title={actor.otherName}
      >
        {actor.otherName}
      </Link>
    </div>
  );
};

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
        <Button
          className='hover:text-light-golden-yellow! h-fit min-w-20! flex-col px-2! hover:bg-white/10'
          variant='ghost'
          onClick={() => {
            setTimeout(() => {
              scroller.scrollTo('discussion-detail', {
                duration: 0,
                delay: 0,
                smooth: true,
                offset: -100,
                isDynamic: true
              });
            }, 50);
          }}
        >
          <MessageIcon />
          Bình luận
        </Button>
        <Button
          className='hover:text-light-golden-yellow! h-fit min-w-20! flex-col px-2! hover:bg-white/10'
          variant='ghost'
        >
          <FaStar />
          Đánh giá
        </Button>
        <ButtonReview movieId={movie.id} className='text-sm' />
      </div>

      <div
        className={cn(
          'flex-wrap items-end gap-2 border-t border-solid border-white/10 pt-10',
          {
            flex: actors.length === 0
          }
        )}
      >
        <h3
          className={cn('font-medium whitespace-nowrap text-white', {
            'mb-8 text-xl': actors.length > 0
          })}
        >
          Diễn viên:
        </h3>
        {actors.length > 0 ? (
          <div className='grid grid-cols-3 gap-x-2.5 gap-y-6'>
            {actors.map((actor) => (
              <ActorCell key={`info-actor-${actor.id}`} actor={actor} />
            ))}
          </div>
        ) : (
          <span className='text-foreground/80 font-light'>Đang cập nhật</span>
        )}
      </div>

      <SuggestionList movieList={suggestionMovieList} />
    </div>
  );
}
