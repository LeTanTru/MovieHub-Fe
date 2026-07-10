'use client';

import {
  formatDuration,
  getYearFromDate,
  parseJSON,
  renderImageUrl,
  sanitizeText
} from '@/utils';
import { route } from '@/routes';
import { ageRatings, MOVIE_TYPE_SERIES } from '@/constants';
import type { MetadataType, SidebarResType } from '@/types';
import Link from 'next/link';
import { ButtonPlay } from '@/components/app/button-play';
import { ButtonInfo } from '@/components/app/button-info';
import { useClickAnimation } from '@/hooks';
import { HeartIcon } from '@/assets';
import { cn } from '@/lib';
import Image from 'next/image';

type SliderItemProps = {
  slider: SidebarResType;
  isGrabbing: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
  onVote: (targetId: string, isLiked: boolean) => void;
  isLiked: boolean;
};

export function SliderItem({
  slider,
  isGrabbing,
  onPointerDown,
  onPointerUp,
  onVote,
  isLiked
}: SliderItemProps) {
  const movie = slider.movie;

  const metadata = parseJSON<MetadataType>(movie.metadata || '{}');

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
    onVote(slider.movie.id, isLiked);
  };

  let watchLink = `${route.watch.path}/${slider.movie.slug}.${slider.movie.id}`;

  if (latestSeason) watchLink += `?season=${latestSeason.label}`;

  if (latestEpisode) watchLink += `&episode=${latestEpisode.label}`;

  return (
    <div className='slide-elements'>
      <Link
        className='hidden'
        href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
      />
      <div
        className='background-fade'
        style={{
          backgroundImage: `url(${renderImageUrl(slider.webThumbnailUrl)})`
        }}
      ></div>
      <div className='cover-fade'>
        <div className='cover-image'>
          <Image
            title={`${slider.movie.title} - ${slider.movie.originalTitle}`}
            src={renderImageUrl(slider.webThumbnailUrl)}
            alt={`${slider.movie.title} - ${slider.movie.originalTitle}`}
            width={1920}
            height={1080}
            priority={slider.ordering === 0}
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
            {slider.movie.imageTitleUrl && (
              <div className='media-title-image'>
                <Link
                  title={slider.movie.title}
                  href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
                >
                  <Image
                    className='bg-transparent'
                    title={slider.movie.title}
                    src={renderImageUrl(slider.movie.imageTitleUrl)}
                    alt={slider.movie.title}
                    loading={slider.ordering === 0 ? 'eager' : 'lazy'}
                    width={1200}
                    height={390}
                    sizes='400px'
                    decoding='async'
                    priority={slider.ordering === 0}
                  />
                </Link>
              </div>
            )}
            {!slider.movie.imageTitleUrl && (
              <h3 className='media-title show'>
                <Link
                  title={slider.movie.title}
                  href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
                >
                  {slider.movie.title}
                </Link>
              </h3>
            )}
            <h3 className='media-alias-title'>
              <Link
                title={slider.movie.originalTitle}
                href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
              >
                {slider.movie.originalTitle}
              </Link>
            </h3>
            <div className='hl-tags'>
              {slider.movie.imdbRating && (
                <div className='tag-imdb'>
                  <span>{slider.movie.imdbRating}</span>
                </div>
              )}
              <div className='tag-model'>
                <span className='last'>
                  <strong>
                    {
                      ageRatings.find(
                        (ageRating) =>
                          ageRating.value === slider.movie.ageRating
                      )?.label
                    }
                  </strong>
                </span>
              </div>
              <div className='tag-classic'>
                <span>{releaseYear}</span>
              </div>
              {isSeries && (
                <>
                  {!!latestSeason && (
                    <div className='tag-classic'>
                      <span>Phần {latestSeason?.label || '1'}</span>
                    </div>
                  )}
                  {!!latestEpisode && (
                    <div className='tag-classic'>
                      <span>Tập {latestEpisode?.label || '1'}</span>
                    </div>
                  )}
                </>
              )}
              {!!duration && (
                <div className='tag-classic'>
                  <span>{formatDuration(duration)}</span>
                </div>
              )}
            </div>
            <div className='hl-tags mb-6! max-[640px]:hidden!'>
              {slider.movie.categories.map((category) => (
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
              className='description line-clamp-3'
              dangerouslySetInnerHTML={{
                __html: sanitizeText(slider.movie.description)
              }}
            />
            <div className='touch'>
              <ButtonPlay
                href={watchLink}
                title={`Xem phim ${slider.movie.title} - ${slider.movie.originalTitle}`}
              />

              <div className='touch-group transition-all duration-200 ease-linear hover:border-white!'>
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
                <ButtonInfo
                  href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
                  title={`Xem chi tiết phim ${slider.movie.title} - ${slider.movie.originalTitle}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
