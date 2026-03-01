'use client';

import { HeartIcon } from '@/assets';
import { ButtonInfo } from '@/components/app/button-info';
import { ButtonPlay } from '@/components/app/button-play';
import { Separator } from '@/components/ui/separator';
import { ageRatings, MOVIE_TYPE_SERIES } from '@/constants';
import { useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import { route } from '@/routes';
import { MetadataType, MovieResType } from '@/types';
import {
  formatDuration,
  getYearFromDate,
  parseJSON,
  renderImageUrl,
  sanitizeText
} from '@/utils';
import Link from 'next/link';

type MovieItemProps = {
  movie: MovieResType;
  isGrabbing: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
  handleLike: (targetId: string) => void;
  handleRemoveLike: (favouriteId: string) => void;
  isLiked: boolean;
};

export default function AnimeItem({
  movie,
  isGrabbing,
  onPointerDown,
  onPointerUp,
  handleLike,
  handleRemoveLike,
  isLiked
}: MovieItemProps) {
  const movieLink = `${route.movie.path}/${movie.slug}.${movie.id}`;
  const metadata = parseJSON<MetadataType>(movie.metadata || '{}');

  const ageRating = ageRatings.find(
    (rating) => rating.value === movie.ageRating
  );

  const latestSeason = metadata?.latestSeason;
  const latestEpisode = metadata?.latestEpisode;

  const isSeries = movie.type === MOVIE_TYPE_SERIES;
  const duration = metadata?.duration || 0;
  const releaseYear = getYearFromDate(
    latestSeason?.releaseDate || movie.releaseDate
  );

  const { iconRef, startAnimation } = useClickAnimation();

  const handleClick = () => {
    startAnimation();

    const action = isLiked ? handleRemoveLike : handleLike;
    action(movie.id);
  };

  return (
    <div className='slide-elements'>
      <Link href={movieLink} className='hidden'></Link>
      <div className='cover-fade'>
        <div className='cover-image'>
          <img
            src={renderImageUrl(movie.thumbnailUrl)}
            alt={`${movie.title} - ${movie.originalTitle}`}
          />
        </div>
      </div>
      <div
        className='safe-area'
        style={{ cursor: isGrabbing ? 'grabbing' : 'grab' }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div className='slide-content'>
          <div className='media-item'>
            {movie.imageTitleUrl ? (
              <div className='media-title-image'>
                <Link title={movie.title} href={movieLink}>
                  <img
                    src={renderImageUrl(movie.imageTitleUrl)}
                    alt={movie.title}
                    className='bg-transparent'
                  />
                </Link>
              </div>
            ) : (
              <h3 className='media-title line-clamp-1'>
                <Link title={movie.title} href={movieLink}>
                  {movie.title}
                </Link>
              </h3>
            )}
            <h3 className='media-alias-title'>
              <Link title={movie.originalTitle} href={movieLink}>
                {movie.originalTitle}
              </Link>
            </h3>
            <div className='hl-tags'>
              <div className='tag-model'>
                <span className='last'>{ageRating?.label}</span>
              </div>
              <div className='tag-classic'>
                <span>{releaseYear}</span>
              </div>
              {isSeries && (
                <>
                  <div className='tag-classic'>
                    <span>Phần {latestSeason?.label || '1'}</span>
                  </div>
                  <div className='tag-classic'>
                    <span>Tập {latestEpisode?.label || '1'}</span>
                  </div>
                </>
              )}
              <div className='tag-classic'>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>
            <div className='hl-tags mb-4!'>
              {movie.categories.map((category) => (
                <Link
                  key={category.id}
                  className='tag-topic'
                  href={`${route.category.path}/${category.slug}.${category.id}`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div
              className='description line-clamp-3 break-all'
              dangerouslySetInnerHTML={{
                __html: sanitizeText(movie.description)
              }}
            />
            <div className='touch'>
              <ButtonPlay
                href={`${route.watch.path}/${movie.slug}.${movie.id}`}
                title={`Xem phim ${movie.title} - ${movie.originalTitle}`}
              />

              <div className='touch-group'>
                <button
                  className='item group button-like'
                  onClick={handleClick}
                >
                  <div className='inc-icon icon-20'>
                    <HeartIcon
                      ref={iconRef}
                      iconClassName={cn(
                        'size-5 transition-all duration-200 ease-linear',
                        {
                          'text-golden-glow stroke-0': isLiked,
                          'text-white group-hover:text-golden-glow group-hover:stroke-0':
                            !isLiked
                        }
                      )}
                    />
                  </div>
                </button>
                <Separator orientation='vertical' />
                <ButtonInfo
                  href={`${route.movie.path}/${movie.slug}.${movie.id}`}
                  title={`Xem chi tiết phim ${movie.title} - ${movie.originalTitle}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
