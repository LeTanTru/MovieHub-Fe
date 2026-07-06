'use client';

import { cn } from '@/lib';
import type { MovieSearchType } from '@/types';

type SearchKeys = keyof MovieSearchType;

type FilterOption = {
  label: string;
  value: string | number;
};

type FilterConditionRowProps = {
  label: string;
  filterKey: SearchKeys;
  options: FilterOption[];
  filters: { key: SearchKeys; value: string | number | string[] }[];
  onFilterChange: ({
    key,
    value
  }: {
    key: SearchKeys;
    value: string | number | string[];
  }) => void;
};

const isMultiSelectField = (key: SearchKeys): boolean => {
  return key === 'categoryIds';
};

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

export function FilterConditionRow({
  label,
  filterKey,
  options,
  filters,
  onFilterChange
}: FilterConditionRowProps) {
  return (
    <div className='max-800:gap-3 max-640:px-0 flex items-start justify-between gap-4 border-b border-dashed border-white/10 px-4 py-2'>
      <div className='max-640:w-30 min-w-25 shrink-0 py-1.25 text-center text-white'>
        {label}
      </div>
      <div className='flex grow flex-wrap justify-start gap-2'>
        {options.map((value) => {
          const isSelected = isValueSelected(filters, filterKey, value.value);

          const handleClick = () => {
            if (isMultiSelectField(filterKey)) {
              const currentValues = getSelectedValues(
                filters,
                filterKey
              ) as string[];
              const valueStr = String(value.value);
              let newValues: string[];

              if (valueStr === 'all') {
                newValues = isSelected ? [] : ['all'];
                onFilterChange({
                  key: filterKey,
                  value: newValues
                });
              } else {
                if (isSelected) {
                  newValues = currentValues.filter(
                    (v) => String(v) !== valueStr
                  );
                } else {
                  newValues = [...currentValues, valueStr];
                }
                onFilterChange({
                  key: filterKey,
                  value:
                    newValues.length > 0
                      ? newValues.filter((v) => v !== 'all')
                      : ['all']
                });
              }
            } else {
              onFilterChange({
                key: filterKey,
                value: value.value
              });
            }
          };

          return (
            <button
              type='button'
              key={value.value}
              className={cn(
                'hover:text-golden-glow cursor-pointer rounded border border-solid border-transparent px-2.5 py-1.25 transition-all duration-200 ease-linear',
                {
                  'border-golden-glow text-golden-glow': isSelected
                }
              )}
              onClick={handleClick}
            >
              {value.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
