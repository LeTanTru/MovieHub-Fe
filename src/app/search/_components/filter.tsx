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
import { cn } from '@/lib';
import { useCategoryListQuery } from '@/queries';
import { MovieSearchType } from '@/types';
import { AnimatePresence, m } from 'framer-motion';
import { FaArrowRight, FaFilter } from 'react-icons/fa6';

type SearchKeys = keyof MovieSearchType;

// Function to check if a filter key is for multi-select fields
const isMultiSelectField = (key: SearchKeys): boolean => {
  return key === 'categoryIds';
};

// Helper function to get selected values for a filter key
const getSelectedValues = (
  filters: { key: SearchKeys; value: string | number | string[] }[],
  key: SearchKeys
): (string | number | string[])[] => {
  const filter = filters.find((item) => item.key === key);
  if (!filter) return [];

  if (isMultiSelectField(key) && Array.isArray(filter.value)) {
    return filter.value;
  }

  return filter.value ? [filter.value] : [];
};

// Helper function to check if a specific value is selected for a filter key
const isValueSelected = (
  filters: { key: SearchKeys; value: string | number | string[] }[],
  key: SearchKeys,
  value: string | number
): boolean => {
  const filter = filters.find((item) => item.key === key);
  if (!filter) return false;

  if (isMultiSelectField(key) && Array.isArray(filter.value)) {
    return filter.value.includes(String(value));
  }

  return filter.value === value;
};

export default function Filter({
  filters,
  showFilter,
  isAllFiltersDefault,
  handleApplyFilters,
  handleClearFilters,
  handleCloseFilters,
  handleFilterChange,
  handleShowFilter
}: {
  filters: { key: SearchKeys; value: string | number | string[] }[];
  showFilter: boolean;
  isAllFiltersDefault: boolean;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  handleCloseFilters: () => void;
  handleFilterChange: ({
    key,
    value
  }: {
    key: SearchKeys;
    value: string | number | string[];
  }) => void;
  handleShowFilter: () => void;
}) {
  const { data: categoryListData } = useCategoryListQuery({
    params: {
      size: MAX_PAGE_SIZE
    },
    enabled: true
  });

  const categoryList =
    categoryListData?.data?.content
      ?.map((category) => ({
        label: category.name,
        value: category.id
      }))
      .sort((a, b) => a.label.localeCompare(b.label)) || [];

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
          <div
            className='bg-black-denim max-640:px-0 inline-flex h-7.5 cursor-pointer items-center gap-2 rounded pr-3 pl-2 font-medium text-white'
            onClick={handleShowFilter}
          >
            <FaFilter className='size-5' />
            <span>Bộ lọc</span>
          </div>
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
                  <div
                    key={condition.key}
                    className='max-800:gap-4 max-640:px-0 flex items-start justify-between gap-8 border-b border-dashed border-white/10 px-4 py-2'
                  >
                    <div className='max-800:w-20 max-640:text-center w-30 shrink-0 py-1.25 text-right text-white'>
                      {condition.label}
                    </div>
                    <div className='flex grow flex-wrap justify-start gap-2'>
                      {condition.value.map((value) => {
                        // Determine if the current value is selected based on filters state
                        const isSelected = isValueSelected(
                          filters,
                          condition.key,
                          value.value
                        );

                        const handleClick = () => {
                          // Handle multi-select logic for categoryIds, and single-select for others
                          if (isMultiSelectField(condition.key)) {
                            // Get current selected values for this filter key from filters state
                            const currentValues = getSelectedValues(
                              filters,
                              condition.key
                            ) as string[];

                            // Toggle the clicked value in the current selected values
                            const valueStr = String(value.value);
                            let newValues: string[];

                            // If "all" is clicked, toggle between selecting all or none
                            if (valueStr === 'all') {
                              // If "all" is currently selected, deselect all. Otherwise, select all.
                              newValues = isSelected ? [] : ['all'];
                              handleFilterChange({
                                key: condition.key,
                                value: newValues
                              });
                            } else {
                              // For other values, toggle the specific value and ensure "all" is deselected if any specific value is selected
                              if (isSelected) {
                                // If currently selected, remove it from the array
                                newValues = currentValues.filter(
                                  (v) => String(v) !== valueStr
                                );
                              } else {
                                // If not currently selected, add it to the array
                                newValues = [...currentValues, valueStr];
                              }
                              // If any specific value is selected, ensure "all" is not selected. If no specific values are selected, select "all".
                              handleFilterChange({
                                key: condition.key,
                                value:
                                  newValues.length > 0
                                    ? newValues.filter((v) => v !== 'all')
                                    : ['all']
                              });
                            }
                          } else {
                            // For single-select fields, simply set the selected value
                            handleFilterChange({
                              key: condition.key,
                              value: value.value
                            });
                          }
                        };

                        return (
                          <div
                            key={value.value}
                            className={cn(
                              'hover:text-golden-glow cursor-pointer rounded border border-solid border-transparent px-2.5 py-1.25 transition-all duration-200 ease-linear',
                              {
                                'border-golden-glow text-golden-glow':
                                  isSelected
                              }
                            )}
                            onClick={handleClick}
                          >
                            {value.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className='max-640:gap-0 max-640:px-2 max-640:py-4 flex items-start justify-between gap-8 px-4 py-6'>
                  <div className='max-800:w-20 w-30'></div>
                  <div className='max-640:gap-2 flex grow items-center gap-4'>
                    <Button
                      variant='primary'
                      className='dark:bg-golden-glow dark:hover:bg-golden-glow/80 max-640:text-[13px] min-h-10 rounded-full'
                      onClick={handleApplyFilters}
                    >
                      Lọc kết quả
                      <FaArrowRight />
                    </Button>
                    <Button
                      type='button'
                      className='max-640:text-[13px] min-h-10 rounded-full px-5 dark:hover:opacity-80 dark:disabled:opacity-50'
                      variant='outline'
                      disabled={isAllFiltersDefault}
                      onClick={handleClearFilters}
                    >
                      Xóa bộ lọc
                    </Button>
                    <Button
                      type='button'
                      className='max-640:text-[13px] min-h-10 rounded-full px-5 dark:hover:opacity-80'
                      variant='outline'
                      onClick={handleCloseFilters}
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
