'use client';

import Filter from './filter';
import MovieList from './movie-list';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useDebounce, useQueryParams } from '@/hooks';
import { useMovieListQuery } from '@/queries';
import { useSearchStore } from '@/store';
import { SearchKeys, SearchParamsType } from '@/types';
import { TextSearch } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

export default function Search() {
  const { keyword } = useSearchStore(
    useShallow((s) => ({
      keyword: s.keyword
    }))
  );
  const debouncedKeyword = useDebounce(keyword, 500);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const { searchParams, setQueryParams } = useQueryParams<SearchParamsType>();
  const [filters, setFilters] = useState<
    { label: SearchKeys; value: string | number }[]
  >([
    { label: 'ageRating', value: searchParams.ageRating || 'all' },
    { label: 'categoryIds', value: searchParams.categoryIds || 'all' },
    { label: 'country', value: searchParams.country || 'all' },
    { label: 'language', value: searchParams.language || 'all' },
    { label: 'releaseYear', value: searchParams.releaseYear || 'all' },
    { label: 'type', value: searchParams.type || 'all' },
    { label: 'keyword', value: keyword || searchParams.keyword || '' }
  ]);

  const currentPage = searchParams.page ? Number(searchParams.page) - 1 : 0;

  const {
    data: movieListData,
    refetch: getMovieList,
    isLoading
  } = useMovieListQuery({
    params: {
      ...Object.fromEntries(
        filters
          .filter((item) => item.value !== 'all')
          .filter((item) => !!item.value)
          .map((item) => [item.label, item.value])
      ),
      page: currentPage,
      size: DEFAULT_PAGE_SIZE
    },
    enabled: false,
    isKeepPreviousData: true
  });

  const movieList = movieListData?.data?.content || [];
  const totalPages = movieListData?.data?.totalPages || 0;

  // Generate a unique key based on actual data to trigger animations only when data changes
  const listKey = `${currentPage}-${movieList[0]?.id || 'empty'}-${movieList.length}`;

  const handleShowFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const handleFilterChange = ({
    label,
    value
  }: {
    label: SearchKeys;
    value: string | number;
  }) => {
    setFilters((prev) => {
      const existingIndex = prev.findIndex((item) => item.label === label);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = { label, value };
        return updated;
      }
      return [...prev, { label, value }];
    });
  };

  const handleApplyFilters = () => {
    const filterParams: Partial<SearchParamsType> = {};

    filters.forEach((item) => {
      if (item.value !== 'all' && item.value) {
        (filterParams as Record<string, any>)[item.label] = item.value;
      }
    });

    setQueryParams({
      ...filterParams,
      page: undefined
    } as Partial<SearchParamsType>);

    getMovieList();
  };

  const handleClearFilters = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setShowFilter(false);
    }, 550);
  };

  useEffect(() => {
    setFilters((prev) => {
      const existingIndex = prev.findIndex((item) => item.label === 'keyword');
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          label: 'keyword',
          value: keyword || searchParams.keyword || ''
        };
        return updated;
      }
      return prev;
    });
  }, [keyword, searchParams.keyword]);

  useEffect(() => {
    if (debouncedKeyword !== undefined && debouncedKeyword !== null) {
      getMovieList();
    }
  }, [debouncedKeyword, getMovieList]);

  useEffect(() => {
    getMovieList();
  }, [currentPage, getMovieList]);

  return (
    <div className='mx-auto w-full max-w-475 px-12.5'>
      <div className='relative mb-5 flex min-h-11 items-center justify-start gap-4'>
        <TextSearch className='size-8' />
        <h3 className='m-0 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,.3)]'>
          {!searchParams.keyword
            ? 'Tìm kiếm phim'
            : `Kết quả tìm kiếm cho "${searchParams.keyword}"`}
        </h3>
      </div>
      <Filter
        filters={filters}
        showFilter={showFilter}
        handleApplyFilters={handleApplyFilters}
        handleClearFilters={handleClearFilters}
        handleFilterChange={handleFilterChange}
        handleShowFilter={handleShowFilter}
      />
      <MovieList
        isLoading={isLoading}
        movieList={movieList}
        totalPages={totalPages}
        listKey={listKey}
      />
    </div>
  );
}
