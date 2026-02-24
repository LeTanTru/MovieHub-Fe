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
import { MetadataType, SidebarResType } from '@/types';
import Link from 'next/link';
import { ButtonPlay } from '@/components/app/button-play';
import { ButtonInfo } from '@/components/app/button-info';
import { useClickAnimation } from '@/hooks';
import { HeartIcon } from '@/assets';
import { cn } from '@/lib';

type SliderItemProps = {
  slider: SidebarResType;
  isGrabbing: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
  handleLike: (targetId: string) => void;
  handleRemoveLike: (favouriteId: string) => void;
  isLiked: boolean;
};

export default function SliderItem({
  slider,
  isGrabbing,
  onPointerDown,
  onPointerUp,
  handleLike,
  handleRemoveLike,
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

    const action = isLiked ? handleRemoveLike : handleLike;
    action(slider.movie.id);
  };

  return (
    <div className='slide-elements'>
      <Link
        className='slide-url'
        href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
      ></Link>
      <div
        className='background-fade'
        style={{
          backgroundImage: `url(${renderImageUrl(slider.webThumbnailUrl)})`
        }}
      ></div>
      <div className='cover-fade'>
        <div className='cover-image'>
          <img
            className='fade-in visible'
            title={`${slider.movie.title} - ${slider.movie.originalTitle}`}
            loading='lazy'
            src={renderImageUrl(slider.webThumbnailUrl)}
            alt={`Slider ${slider.movie.title} - ${slider.movie.originalTitle}`}
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
            <div className='media-title-image'>
              <Link
                title={slider.movie.title}
                href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
                className='hover:text-golden-glow text-4xl font-bold text-white transition-colors duration-200 ease-linear text-shadow-[0_2px_1px_rgba(0,0,0,.3)]'
              >
                {slider.movie.imageTitleUrl ? (
                  <img
                    src={renderImageUrl(slider.movie.imageTitleUrl)}
                    alt={slider.movie.title}
                    className='bg-transparent'
                  />
                ) : (
                  slider.movie.title
                )}
              </Link>
            </div>
            <h3 className='media-title' style={{ display: 'none' }}>
              <Link
                title={slider.movie.title}
                href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
              >
                {slider.movie.title}
              </Link>
            </h3>
            <h3 className='media-alias-title'>
              <Link
                title={slider.movie.originalTitle}
                href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
              >
                {slider.movie.originalTitle}
              </Link>
            </h3>
            <div className='hl-tags'>
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
            <div className='hl-tags mb-4'>
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
              className='description lim-3'
              dangerouslySetInnerHTML={{
                __html: sanitizeText(slider.movie.description)
              }}
            />
            <div className='touch'>
              <ButtonPlay
                href={`${route.watch.path}/${slider.movie.slug}.${slider.movie.id}`}
                title={`Xem phim ${slider.movie.title} - ${slider.movie.originalTitle}`}
              />

              <div className='touch-group transition-all duration-200 ease-linear hover:border-white!'>
                <button className='item group' onClick={handleClick}>
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
