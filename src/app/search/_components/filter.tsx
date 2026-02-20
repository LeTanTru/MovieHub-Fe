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
import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowRight, FaFilter } from 'react-icons/fa6';

type SearchKeys = keyof MovieSearchType;

export default function Filter({
  filters,
  showFilter,
  handleApplyFilters,
  handleClearFilters,
  handleFilterChange,
  handleShowFilter
}: {
  filters: { label: SearchKeys; value: string | number }[];
  showFilter: boolean;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  handleFilterChange: ({
    label,
    value
  }: {
    label: SearchKeys;
    value: string | number;
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
          value: ageRating.value
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
      value: Array.from({ length: 27 }, (_, i) => {
        const year = 2026 - i;
        return { label: year.toString(), value: year };
      })
    },
    {
      label: 'Loại phim',
      key: 'type',
      value: [
        { label: 'Tất cả', value: 'all' },
        { label: 'Phim lẻ', value: MOVIE_TYPE_SINGLE },
        { label: 'Phim bộ', value: MOVIE_TYPE_SERIES }
      ]
    }
  ];

  return (
    <div className='tab-list mb-8' role='tablist'>
      <div className='tab-content' role='tab-content'>
        <div className='block'>
          <div className='mb-8'>
            <div
              className='inline-flex h-7.5 cursor-pointer items-center gap-2 rounded bg-[#191b24] pr-3 pl-2 font-medium text-white'
              onClick={handleShowFilter}
            >
              <FaFilter className='size-5' />
              <span>Bộ lọc</span>
            </div>
            <AnimatePresence>
              {showFilter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    duration: showFilter ? 0.2 : 0,
                    ease: showFilter ? 'easeOut' : undefined
                  }}
                  className='-mt-3.75 mb-12 rounded border border-solid border-white/10 pt-4'
                >
                  {searchConditions.map((condition) => (
                    <div
                      key={condition.key}
                      className='flex items-start justify-between gap-8 border-b border-dashed border-white/10 px-4 py-2'
                    >
                      <div className='w-30 shrink-0 py-1.25 text-right text-white'>
                        {condition.label}
                      </div>
                      <div className='flex grow flex-wrap justify-start gap-2'>
                        {condition.value.map((value) => (
                          <div
                            key={value.value}
                            className={cn(
                              'hover:text-light-golden-yellow cursor-pointer rounded border border-solid border-transparent px-2.5 py-1.25 transition-all duration-200 ease-linear',
                              {
                                'border-light-golden-yellow text-light-golden-yellow':
                                  filters.some(
                                    (item) =>
                                      item.label === condition.key &&
                                      item.value === value.value
                                  )
                              }
                            )}
                            onClick={() =>
                              handleFilterChange({
                                label: condition.key,
                                value: value.value
                              })
                            }
                          >
                            {value.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className='flex items-start justify-between gap-8 px-4 py-6'>
                    <div className='w-30'></div>
                    <div className='flex grow items-center gap-4'>
                      <Button
                        variant='primary'
                        className='bg-light-golden-yellow hover:bg-light-golden-yellow/80 min-h-10 rounded-full'
                        onClick={handleApplyFilters}
                      >
                        Lọc kết quả
                        <FaArrowRight />
                      </Button>
                      <Button
                        type='button'
                        className='min-h-10 rounded-full px-5 hover:opacity-80'
                        variant='outline'
                        onClick={handleClearFilters}
                      >
                        Đóng
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
