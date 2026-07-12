'use client';

import { AnimatePresence, m } from 'framer-motion';
import { BaseForm } from '@/components/form/base-form';
import { cn } from '@/lib';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef, type FormEvent } from 'react';
import { InputField } from '@/components/form';
import type { SearchType } from '@/types';
import { NoData } from '@/components/no-data';
import { route } from '@/routes';
import { Search, X } from 'lucide-react';
import { searchSchema } from '@/schemaValidations';
import { useMovieListQuery } from '@/queries';
import {
  useClickOutside,
  useDisclosure,
  useNavigate,
  useQueryParams
} from '@/hooks';
import { useSearchStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { usePathname } from 'next/navigation';
import { VerticalBarLoading } from '@/components/loading';
import { MovieItem } from './movie-item';

type SearchFormProps = {
  className?: string;
  formClassName?: string;
};

const defaultValues: SearchType = {
  keyword: ''
};

export function SearchForm({ className, formClassName }: SearchFormProps) {
  const navigate = useNavigate();
  const pathname = usePathname();

  const isSearchPage = pathname === route.search.path;

  const {
    opened: showMovieList,
    open: openMovieList,
    close: closeMovieList
  } = useDisclosure();

  const { searchParams, setQueryParam, serializeParams } = useQueryParams<{
    keyword: string;
  }>();

  const { keyword, setKeyword } = useSearchStore(
    useShallow((s) => ({
      keyword: s.keyword,
      setKeyword: s.setKeyword
    }))
  );

  const movieListRef = useClickOutside<HTMLDivElement>(() => {
    closeMovieList();
    setKeyword('');
  });

  const { data: movieListData, isLoading } = useMovieListQuery({
    params: { keyword },
    enabled: !!keyword && !isSearchPage
  });

  const movieList = movieListData?.content || [];

  const initialValues = useMemo<SearchType>(
    () => ({
      keyword: searchParams.keyword ?? defaultValues.keyword
    }),
    [searchParams.keyword]
  );

  useEffect(() => {
    setKeyword(searchParams.keyword ?? '');
  }, [searchParams.keyword, setKeyword]);

  const latestSearchSync = useRef({
    isSearchPage,
    setKeyword,
    setQueryParam
  });

  useEffect(() => {
    latestSearchSync.current = {
      isSearchPage,
      setKeyword,
      setQueryParam
    };
  }, [isSearchPage, setKeyword, setQueryParam]);

  const handleKeywordChange = useMemo(
    () =>
      debounce((value: string) => {
        const { isSearchPage, setKeyword, setQueryParam } =
          latestSearchSync.current;
        setKeyword(value);
        if (isSearchPage) setQueryParam('keyword', value);
      }, 300),
    []
  );

  useEffect(() => {
    return () => handleKeywordChange.cancel();
  }, [handleKeywordChange]);

  const handleOnChange = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.name !== 'keyword') return;
    handleKeywordChange(target.value);
  };

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
        initialValues={initialValues}
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
                    <X
                      size={16}
                      className='cursor-pointer text-white transition-colors duration-200 ease-linear hover:text-white/50'
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleKeywordChange.cancel();
                        setKeyword('');
                        form.reset({ keyword: '' });
                        if (isSearchPage) setQueryParam('keyword', null);
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
                  <VerticalBarLoading className='mx-auto' />
                </div>
              ) : movieList.length === 0 ? (
                <NoData
                  className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
                  imageClassName='size-30 max-640:size-20'
                  content={
                    <>
                      Không có phim nào tương ứng với từ khóa&nbsp;
                      <b>{keyword}</b>
                      <br />
                      Bạn thử tìm kiếm từ khóa khác nhé 😊
                    </>
                  }
                />
              ) : (
                movieList.map((movie) => (
                  <MovieItem
                    key={movie.id}
                    movie={movie}
                    onClick={() => setKeyword('')}
                  />
                ))
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
