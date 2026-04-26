'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import './latest-country-movie-list.css';
import { CollectionResType } from '@/types';
import { LatestCountryMovieItem } from '@/components/app/collection';

type LastestCountryMovieListProps = {
  collectionList: CollectionResType[];
};

export default function LastestCountryMovieList({
  collectionList
}: LastestCountryMovieListProps) {
  return (
    <div className='collection-movie-list latest-country-movie-list fade-in slide-in-from-top-[-30px] animate-in max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5 duration-200'>
      <div className='bg-charade rounded-md'>
        {collectionList.map((collection) => {
          if (!collection.movies) return null;
          return (
            <LatestCountryMovieItem
              key={collection.id}
              collection={collection}
            />
          );
        })}
      </div>
    </div>
  );
}
