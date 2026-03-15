'use client';

import { ageRatings, MOVIE_TYPE_SERIES } from '@/constants';
import { AnimatePresence, m } from 'framer-motion';
import { BaseForm } from '@/components/form/base-form';
import { cn } from '@/lib';
import debounce from 'lodash/debounce';
import { FormEvent } from 'react';
import { InputField } from '@/components/form';
import { MetadataType, MovieResType, SearchType } from '@/types';
import { NoData } from '@/components/no-data';
import { getYearFromDate, parseJSON, renderImageUrl } from '@/utils';
import { route } from '@/routes';
import { Search, XCircle } from 'lucide-react';
import { searchSchema } from '@/schemaValidations';
import { useMovieListQuery } from '@/queries';
import Image from 'next/image';
import Link from 'next/link';
import {
  useClickOutside,
  useDisclosure,
  useNavigate,
  useQueryParams
} from '@/hooks';
import { useSearchStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { usePathname } from 'next/navigation';
import { CircleLoading } from '@/components/loading';

type SearchFormProps = {
  className?: string;
  formClassName?: string;
};

function MovieItem({ movie }: { movie: MovieResType }) {
  const ageRating = ageRatings.find((age) => movie?.ageRating === age.value);
  const isSeries = movie.type === MOVIE_TYPE_SERIES;

  const metadata = parseJSON<MetadataType>(movie.metadata || '{}');

  const latestSeason = metadata?.latestSeason;
  const latestEpisode = metadata?.latestEpisode;
  const releaseYear = getYearFromDate(
    latestSeason?.releaseDate || movie.releaseDate
  );

  return (
    <Link
      key={movie.id}
      href={`${route.movie.path}/${movie.slug}.${movie.id}`}
      className='flex items-center justify-between gap-4 rounded p-2.5 transition-colors duration-200 ease-linear hover:bg-white/5'
    >
      <div className='w-12.5 shrink-0'>
        <div className='bg-gunmetal-blue relative block h-0 w-full rounded pb-[135%]'>
          <Image
            src={renderImageUrl(movie.posterUrl)}
            alt={`${movie.title} - ${movie.originalTitle}`}
            width={50}
            height={70}
            className='absolute inset-0 size-full object-cover'
          />
        </div>
      </div>
      <div className='grow'>
        <h3 className='mb-1 line-clamp-2 leading-normal text-white'>
          {movie.title}
        </h3>
        <div className='mb-1 line-clamp-1 text-xs leading-normal text-neutral-400'>
          {movie.originalTitle}
        </div>
        <div className='flex items-center gap-4'>
          <div
            className='inline text-xs whitespace-nowrap text-neutral-400'
            title={ageRating?.mean}
          >
            <strong>{ageRating?.label}</strong>
          </div>
          <div className='relative inline text-xs whitespace-nowrap text-neutral-400 before:absolute before:top-1/2 before:left-[-10.5px] before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-white/30 before:content-[""]'>
            <strong>{releaseYear}</strong>
          </div>
          <div className='relative inline text-xs whitespace-nowrap text-neutral-400 before:absolute before:top-1/2 before:left-[-10.5px] before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-white/30 before:content-[""]'>
            <strong>Phần {latestSeason?.label}</strong>
          </div>
          {isSeries && (
            <div className='relative inline text-xs whitespace-nowrap text-neutral-400 before:absolute before:top-1/2 before:left-[-10.5px] before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-white/30 before:content-[""]'>
              <strong>Tập {latestEpisode?.label}</strong>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function SearchForm({
  className,
  formClassName
}: SearchFormProps) {
  const navigate = useNavigate();
  const pathname = usePathname();

  const isSearchPage = pathname === route.search.path;

  const {
    opened: showMovieList,
    open: openMovieList,
    close: closeMovieList
  } = useDisclosure();
  const movieListRef = useClickOutside<HTMLDivElement>(closeMovieList);

  const { searchParams, setQueryParam, serializeParams } = useQueryParams<{
    keyword: string;
  }>();
  const { keyword, setKeyword } = useSearchStore(
    useShallow((s) => ({
      keyword: s.keyword,
      setKeyword: s.setKeyword
    }))
  );

  const { data: movieListData, isLoading } = useMovieListQuery({
    params: { keyword },
    enabled: !!keyword && !isSearchPage
  });

  const movieList = movieListData?.data?.content || [];

  const defaultValues: SearchType = {
    keyword: searchParams.keyword || ''
  };

  const handleOnChange = debounce((event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    setKeyword(target.value);
    if (isSearchPage) setQueryParam('keyword', target.value);
  }, 300);

  const onSubmit = (values: SearchType) => {
    if (!values.keyword || values.keyword.trim() === '' || isSearchPage) return;

    navigate.push(
      `${route.search.path}?${serializeParams({
        keyword: values.keyword
      })}`
    );
  };

  const handleToggleMovieList = () => {
    openMovieList();
  };

  return (
    <div
      className={cn('relative block w-full max-w-92', className)}
      ref={movieListRef}
    >
      <BaseForm
        schema={searchSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        className={cn('bg-transparent', formClassName)}
        onChange={handleOnChange}
        onClick={handleToggleMovieList}
      >
        {(form) => (
          <>
            <div className='h-search-form my-0 w-full'>
              <InputField
                formItemClassName='h-search-form'
                className='h-search-form border-none focus-visible:ring-slate-500'
                prefixIcon={<Search size={16} className='text-white' />}
                suffixIcon={
                  keyword ? (
                    <XCircle
                      size={16}
                      className='cursor-pointer text-white'
                      onClick={() => {
                        setKeyword('');
                        form.reset();
                      }}
                    />
                  ) : null
                }
                autoComplete='off'
                control={form.control}
                name='keyword'
                placeholder='Tìm kiếm phim'
              />
            </div>
          </>
        )}
      </BaseForm>
      <AnimatePresence>
        {keyword && !isSearchPage && showMovieList && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='bg-gunmetal-black shadow-gunmetal-blue absolute top-[calc(100%+5px)] left-0 w-full rounded p-4 shadow-[0px_0px_10px_1px]'
          >
            <div className='mb-3 flex items-center justify-between text-neutral-400'>
              Danh sách phim
            </div>
            <div className='scrollbar-none max-h-125 overflow-y-auto'>
              {isLoading ? (
                <div className='py-10'>
                  <CircleLoading />
                </div>
              ) : movieList.length === 0 ? (
                <NoData
                  className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
                  imageClassName='max-640:size-40 max-480:size-30'
                  content={
                    <>
                      Không tìm thấy phim nào
                      <br /> phù hợp với từ khóa của bạn
                    </>
                  }
                />
              ) : (
                movieList.map((movie) => (
                  <MovieItem key={movie.id} movie={movie} />
                ))
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
