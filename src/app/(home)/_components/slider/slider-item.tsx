'use client';

import { useEffect, useRef, useState } from 'react';
import {
  useDeleteFavouriteMutation,
  useFavouriteMutation,
  useFavouriteQuery
} from '@/queries';
import { notify, renderImageUrl, sanitizeText } from '@/utils';
import { route } from '@/routes';
import { ageRatings, FAVOURITE_TYPE_MOVIE } from '@/constants';
import { useAuth } from '@/hooks';
import Link from 'next/link';
import { HeartIcon, InfoIcon, PlayIcon } from '@/assets';
import { AnimatedIconHandle, SidebarResType } from '@/types';
import { logger } from '@/logger';

interface SliderItemProps {
  slider: SidebarResType;
  isGrabbing: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
}

export default function SliderItem({
  slider,
  isGrabbing,
  onPointerDown,
  onPointerUp
}: SliderItemProps) {
  const heartIconRef = useRef<AnimatedIconHandle>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [favouriteId, setFavouriteId] = useState<string>('');
  const { isAuthenticated } = useAuth();

  const { mutateAsync: addFavourite, isPending: addFavouriteLoading } =
    useFavouriteMutation();

  const { mutateAsync: removeFavourite, isPending: removeFavouriteLoading } =
    useDeleteFavouriteMutation();

  const { data: favouriteData } = useFavouriteQuery({
    params: {
      targetId: slider.movie.id,
      type: FAVOURITE_TYPE_MOVIE
    },
    enabled: !!slider.movie.id && isAuthenticated
  });

  useEffect(() => {
    setIsLiked(!!favouriteData?.result && isAuthenticated);
    setFavouriteId(favouriteData?.data?.id ?? '');
  }, [favouriteData, isAuthenticated]);

  const handleLike = async () => {
    heartIconRef.current?.startAnimation();

    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-light-golden-yellow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để thêm phim vào danh sách yêu thích
        </span>
      );
      return;
    }

    if (addFavouriteLoading) return;

    await addFavourite(
      { targetId: slider.movie.id, type: FAVOURITE_TYPE_MOVIE },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success('Thêm phim vào danh sách yêu thích thành công');
            setIsLiked(true);
            setFavouriteId(res.data ?? '');
          } else {
            notify.error('Thêm phim vào danh sách yêu thích thất bại');
          }
        },
        onError: (error) => {
          logger.error('Error while adding favourite', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      }
    );
  };

  const handleRemoveLike = async () => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-light-golden-yellow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để xóa phim khỏi danh sách yêu thích
        </span>
      );
      return;
    }

    if (removeFavouriteLoading) return;

    if (favouriteId) {
      heartIconRef.current?.startAnimation();

      await removeFavourite(favouriteId, {
        onSuccess: (res) => {
          if (res.result) {
            setIsLiked(false);
            notify.success('Xóa phim khỏi danh sách yêu thích thành công');
          } else {
            notify.error('Xóa phim khỏi danh sách yêu thích thất bại');
          }
        },
        onError: (error) => {
          logger.error('Error while removing favourite', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      });
    }
  };

  const handleFavouriteClick = () => {
    if (isLiked) {
      handleRemoveLike();
    } else {
      handleLike();
    }
  };

  return (
    <div className='slide-elements'>
      <a
        className='slide-url'
        href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
      ></a>
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
              <a
                title={slider.movie.title}
                href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
                className='hover:text-light-golden-yellow text-4xl font-bold text-white transition-colors duration-200 ease-linear text-shadow-[0_2px_1px_rgba(0,0,0,.3)]'
              >
                {slider.movie.title}
              </a>
            </div>
            <h3 className='media-title' style={{ display: 'none' }}>
              <a
                title='Thứ Tư'
                href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
              >
                {slider.movie.title}
              </a>
            </h3>
            <h3 className='media-alias-title'>
              <a
                title={slider.movie.originalTitle}
                href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
              >
                {slider.movie.originalTitle}
              </a>
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
                <span>{slider.movie.year}</span>
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
                <a
                  key={category.id}
                  className='tag-topic'
                  href={`${route.category.path}/${category.slug}.${category.id}`}
                >
                  {category.name}
                </a>
              ))}
            </div>
            <div
              className='description lim-3'
              dangerouslySetInnerHTML={{
                __html: sanitizeText(slider.movie.description)
              }}
            />
            <div className='touch'>
              <a
                className='button-play'
                href={`${route.watch.path}/${slider.movie.slug}.${slider.movie.id}`}
              >
                <PlayIcon />
              </a>
              <div className='touch-group transition-all duration-200 ease-linear hover:border-white!'>
                <button className='item group' onClick={handleFavouriteClick}>
                  <div className='inc-icon icon-20'>
                    <HeartIcon
                      ref={heartIconRef}
                      iconClassName={`size-5! transition-all duration-200 ease-linear ${
                        isLiked
                          ? 'text-light-golden-yellow stroke-0'
                          : 'text-white group-hover:text-light-golden-yellow group-hover:stroke-0'
                      }`}
                    />
                  </div>
                </button>
                <a
                  className='item group'
                  href={`${route.movie.path}/${slider.movie.slug}.${slider.movie.id}`}
                >
                  <div className='inc-icon icon-20'>
                    <InfoIcon className='group-hover:fill-light-golden-yellow size-5 fill-white stroke-black' />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
