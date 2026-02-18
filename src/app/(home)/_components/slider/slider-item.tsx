'use client';

import { getYearFromDate, renderImageUrl, sanitizeText } from '@/utils';
import { route } from '@/routes';
import { ageRatings } from '@/constants';
import { SidebarResType } from '@/types';
import { ButtonLikeHome } from '@/components/app/button-like';
import Link from 'next/link';
import { ButtonPlay } from '@/components/app/button-play';
import { ButtonInfo } from '@/components/app/button-info';

type SliderItemProps = {
  slider: SidebarResType;
  isGrabbing: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
};

export default function SliderItem({
  slider,
  isGrabbing,
  onPointerDown,
  onPointerUp
}: SliderItemProps) {
  console.log('🚀 ~ SliderItem ~ slider:', slider);
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
                className='hover:text-light-golden-yellow text-4xl font-bold text-white transition-colors duration-200 ease-linear text-shadow-[0_2px_1px_rgba(0,0,0,.3)]'
              >
                {slider.movie.title}
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
                <span>{getYearFromDate(slider.movie.releaseDate)}</span>
              </div>
              <div className='tag-classic'>
                <span>Phần 2</span>
              </div>
              <div className='tag-classic'>
                <span>Tập 4</span>
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
                <ButtonLikeHome targetId={slider.movie.id} />
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
