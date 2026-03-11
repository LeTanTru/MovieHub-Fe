'use client';

import Filter from './filter';
import MovieList from './movie-list';
import { DEFAULT_PAGE_SIZE, SEARCH_MOVIE_LIST_ID } from '@/constants';
import { useDebounce, useQueryParams } from '@/hooks';
import { useMovieListQuery } from '@/queries';
import { useSearchStore } from '@/store';
import { SearchKeys, SearchParamsType } from '@/types';
import { TextSearch } from 'lucide-react';
import { useEffect, useState } from 'react';
import { animateScroll, scroller } from 'react-scroll';
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
  // Local state for filters to allow user to change them before applying
  const [filters, setFilters] = useState<
    { key: SearchKeys; value: string | number | string[] }[]
  >([
    { key: 'ageRating', value: searchParams.ageRating || 'all' },
    {
      key: 'categoryIds',
      value: searchParams.categoryIds?.split(',') || ['all']
    },
    { key: 'country', value: searchParams.country || 'all' },
    { key: 'language', value: searchParams.language || 'all' },
    { key: 'releaseYear', value: searchParams.releaseYear || 'all' },
    { key: 'type', value: searchParams.type || 'all' },
    { key: 'keyword', value: keyword || searchParams.keyword || '' }
  ]);

  const currentPage = searchParams.page ? Number(searchParams.page) - 1 : 0;

  // Only use searchParams for API queries, not the local filters state
  const queryFilterParams = Object.fromEntries(
    Object.entries(searchParams)
      .filter(([key, value]) => key !== 'page' && !!value)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return [key, value.join(',')];
        }
        return [key, value];
      })
  ) as Partial<SearchParamsType>;

  const {
    data: movieListData,
    refetch: getMovieList,
    isLoading
  } = useMovieListQuery({
    params: {
      ...queryFilterParams,
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
    key,
    value
  }: {
    key: SearchKeys;
    value: string | number | string[];
  }) => {
    // Update local filters state
    setFilters((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === key);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = { key, value };
        return updated;
      }
      return [...prev, { key, value }];
    });
  };

  const handleApplyFilters = () => {
    // Convert filters to URL params format
    const filterParams: Partial<SearchParamsType> = {};

    filters.forEach((item) => {
      if (item.value === 'all' || !item.value) return;

      // Handle categoryIds as array - convert to comma-separated string
      if (item.key === 'categoryIds' && Array.isArray(item.value)) {
        if (item.value.length > 0 && item.value[0] !== 'all') {
          (filterParams as Record<string, any>)[item.key] =
            item.value.join(',');
        }
      } else if (Array.isArray(item.value)) {
        (filterParams as Record<string, any>)[item.key] = item.value.join(',');
      } else {
        (filterParams as Record<string, any>)[item.key] = item.value;
      }
    });

    setQueryParams({
      ...filterParams,
      page: undefined
    } as Partial<SearchParamsType>);

    scroller.scrollTo(SEARCH_MOVIE_LIST_ID, {
      duration: 500,
      smooth: true,
      offset: -200,
      delay: 0,
      isDynamic: true
    });
  };

  const handleCloseFilters = () => {
    animateScroll.scrollToTop({
      smooth: true,
      duration: 0,
      delay: 0
    });
    setTimeout(() => {
      setShowFilter(false);
    }, 500);
  };

  const handleClearFilters = () => {
    // Reset all filters to 'all'
    setFilters([
      { key: 'ageRating', value: 'all' },
      { key: 'categoryIds', value: ['all'] },
      { key: 'country', value: 'all' },
      { key: 'language', value: 'all' },
      { key: 'releaseYear', value: 'all' },
      { key: 'type', value: 'all' },
      { key: 'keyword', value: keyword || '' }
    ]);

    // Clear URL params except keyword
    setQueryParams({
      keyword: keyword || undefined,
      page: undefined
    } as Partial<SearchParamsType>);

    animateScroll.scrollToTop({
      smooth: true,
      duration: 0,
      delay: 0
    });
    setTimeout(() => {
      setShowFilter(false);
    }, 500);
  };

  // Check if all filters are at default state
  const isAllFiltersDefault = filters.every((filter) => {
    if (filter.key === 'categoryIds') {
      return (
        Array.isArray(filter.value) &&
        (filter.value.length === 0 ||
          (filter.value.length === 1 && filter.value[0] === 'all'))
      );
    }
    if (filter.key === 'keyword') {
      return filter.value === '' || filter.value === keyword;
    }
    return filter.value === 'all';
  });

  useEffect(() => {
    setFilters((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === 'keyword');
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          key: 'keyword',
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

  // Fetch when search params change (from filter apply or URL change)
  useEffect(() => {
    getMovieList();
  }, [searchParams, getMovieList]);

  return (
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      <div className='max-1120:mb-5 max-990:mb-4 mb-6'>
        <div className='max-990:text-2xl max-640:text-[22px] max-480:text-xl max-990:gap-2 flex items-center gap-4 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          <TextSearch className='max-990:size-6.5 size-8' />
          {!searchParams.keyword
            ? 'Tìm kiếm phim'
            : `Kết quả tìm kiếm cho "${searchParams.keyword}"`}
        </div>
      </div>
      <Filter
        filters={filters}
        showFilter={showFilter}
        isAllFiltersDefault={isAllFiltersDefault}
        handleApplyFilters={handleApplyFilters}
        handleClearFilters={handleClearFilters}
        handleCloseFilters={handleCloseFilters}
        handleFilterChange={handleFilterChange}
        handleShowFilter={handleShowFilter}
      />
      <MovieList
        isLoading={isLoading}
        movieList={movieList}
        totalPages={totalPages}
        listKey={listKey}
        keyword={searchParams.keyword || ''}
      />
    </div>
  );
}
