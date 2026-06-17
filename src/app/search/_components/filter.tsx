'use client';

import { Button } from '@/components/form';
import {
  ageRatings,
  countries,
  languages,
  MAX_PAGE_SIZE,
  MOVIE_TYPE_SERIES,
  MOVIE_TYPE_SINGLE
} from '@/constants';
import { useCategoryListQuery } from '@/queries';
import { MovieSearchType } from '@/types';
import { AnimatePresence, m } from 'framer-motion';
import { FaArrowRight, FaFilter } from 'react-icons/fa6';

import { FilterConditionRow } from './filter-condition-row';

type SearchKeys = keyof MovieSearchType;

type FilterProps = {
  filters: { key: SearchKeys; value: string | number | string[] }[];
  showFilter: boolean;
  isAllFiltersDefault: boolean;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onCloseFilters: () => void;
  onFilterChange: ({
    key,
    value
  }: {
    key: SearchKeys;
    value: string | number | string[];
  }) => void;
  onShowFilter: () => void;
};

export function Filter({
  filters,
  showFilter,
  isAllFiltersDefault,
  onApplyFilters,
  onClearFilters,
  onCloseFilters,
  onFilterChange,
  onShowFilter
}: FilterProps) {
  const { data: categoryListData } = useCategoryListQuery({
    params: {
      size: MAX_PAGE_SIZE
    },
    enabled: true
  });

  const categoryList =
    categoryListData?.content
      ?.map((category) => ({
        label: category.name,
        value: category.id
      }))
      .toSorted((a, b) => a.label.localeCompare(b.label)) || [];

  // Define filter conditions and their options
  const searchConditions: {
    label: string;
    key: SearchKeys;
    value: { label: string; value: string | number }[];
  }[] = [
    {
      label: 'Độ tuổi',
      key: 'ageRating',
      value: [
        { label: 'Tất cả', value: 'all' },
        ...ageRatings.map((ageRating) => ({
          label: `${ageRating.label} (${ageRating.mean})`,
          value: ageRating.value.toString()
        }))
      ]
    },
    ...(categoryList.length > 0
      ? [
          {
            label: 'Thể loại',
            key: 'categoryIds' as SearchKeys,
            value: [{ label: 'Tất cả', value: 'all' }, ...categoryList]
          }
        ]
      : []),
    {
      label: 'Quốc gia',
      key: 'country',
      value: [{ label: 'Tất cả', value: 'all' }, ...countries]
    },
    {
      label: 'Ngôn ngữ',
      key: 'language',
      value: [{ label: 'Tất cả', value: 'all' }, ...languages]
    },
    {
      label: 'Năm phát hành',
      key: 'releaseYear',
      value: [
        { label: 'Tất cả', value: 'all' },
        ...Array.from({ length: 27 }, (_, i) => {
          const year = 2026 - i;
          return { label: year.toString(), value: year.toString() };
        })
      ]
    },
    {
      label: 'Loại phim',
      key: 'type',
      value: [
        { label: 'Tất cả', value: 'all' },
        { label: 'Phim lẻ', value: MOVIE_TYPE_SINGLE.toString() },
        { label: 'Phim bộ', value: MOVIE_TYPE_SERIES.toString() }
      ]
    }
  ];

  return (
    <div className='tab-list max-990:mb-6 max-640:mb-4 mb-8' role='tablist'>
      <div className='tab-content' role='tab-content'>
        <div className='block'>
          <button
            type='button'
            className='max-640:px-0 inline-flex h-7.5 cursor-pointer items-center gap-2 rounded bg-transparent pr-3 pl-2 font-medium text-white'
            onClick={onShowFilter}
          >
            <FaFilter className='size-5' />
            <span>Bộ lọc</span>
          </button>
          <AnimatePresence>
            {showFilter && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  duration: showFilter ? 0.2 : 0,
                  ease: showFilter ? 'easeOut' : undefined
                }}
                className='max-640:-mx-4 max-640:rounded-none max-640:border-x-0 max-640:border-b-0 max-640:pt-2 max-640:text-[13px] -mt-3.75 mb-3 rounded border border-solid border-white/10 pt-4 max-[640px]:mb-1.5'
              >
                {searchConditions.map((condition) => (
                  <FilterConditionRow
                    key={condition.key}
                    label={condition.label}
                    filterKey={condition.key}
                    options={condition.value}
                    filters={filters}
                    onFilterChange={onFilterChange}
                  />
                ))}
                <div className='max-640:gap-0 max-640:px-2 max-640:py-4 flex items-start justify-between gap-8 px-4 py-6'>
                  <div className='max-800:w-20 w-30'></div>
                  <div className='max-640:gap-2 flex grow items-center gap-4'>
                    <Button
                      variant='primary'
                      className='bg-golden-glow hover:bg-golden-glow/80 max-640:text-[13px] min-h-10 rounded-full'
                      onClick={onApplyFilters}
                    >
                      Lọc kết quả
                      <FaArrowRight />
                    </Button>
                    <Button
                      type='button'
                      className='max-640:text-[13px] min-h-10 rounded-full border-gray-200 px-5 text-white hover:border-gray-200/80 hover:text-white/80 hover:opacity-80 disabled:border-gray-200/80 disabled:text-white/80 disabled:opacity-50 disabled:hover:border-gray-200/80 disabled:hover:text-white/80'
                      variant='outline'
                      disabled={isAllFiltersDefault}
                      onClick={onClearFilters}
                    >
                      Xóa bộ lọc
                    </Button>
                    <Button
                      type='button'
                      className='max-640:text-[13px] min-h-10 rounded-full px-5 hover:opacity-80'
                      variant='outline'
                      onClick={onCloseFilters}
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
