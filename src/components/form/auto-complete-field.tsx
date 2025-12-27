'use client';

import * as React from 'react';
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/form';

type AutoCompleteFieldProps<
  TFieldValues extends FieldValues,
  TOption extends Record<string, any>
> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: TOption[];
  description?: string;
  className?: string;
  required?: boolean;
  multiple?: boolean;
  getLabel: (option: TOption) => string | number;
  getValue: (option: TOption) => string | number;
  getPrefix?: (option: TOption) => React.ReactNode;
  allowClear?: boolean;
  searchText?: string;
  notFoundContent?: React.ReactNode;
  labelClassName?: string;
  disabled?: boolean;
  onValueChange?: (value: string | number | (string | number)[]) => void;
};

export default function AutoCompleteField<
  TFieldValues extends FieldValues,
  TOption extends Record<string, any>
>({
  control,
  name,
  label,
  placeholder,
  options,
  description,
  className,
  required,
  multiple = false,
  getLabel,
  getValue,
  getPrefix,
  allowClear,
  searchText,
  notFoundContent,
  labelClassName,
  disabled = false,
  onValueChange
}: AutoCompleteFieldProps<TFieldValues, TOption>) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues: (string | number)[] =
          field.value === undefined
            ? []
            : multiple
              ? Array.isArray(field.value)
                ? field.value
                : []
              : [field.value];

        const toggleValue = (val: string | number) => {
          if (multiple) {
            const next = selectedValues.includes(val)
              ? selectedValues.filter((v) => v !== val)
              : [...selectedValues, val];
            field.onChange(next);
            onValueChange?.(next);
          } else {
            field.onChange(val);
            onValueChange?.(val);
            setOpen(false);
          }
        };

        return (
          <FormItem
            className={cn(className, {
              'cursor-not-allowed opacity-50': disabled
            })}
          >
            {label && (
              <FormLabel className={cn('ml-1 gap-1.5', labelClassName)}>
                {label}
                {required && <span className='text-destructive'>*</span>}
              </FormLabel>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  role='combobox'
                  aria-label='Select'
                  disabled={disabled}
                  className={cn(
                    'focus-visible:border-dodger-blue focus-visible:ring-ring/0 w-full flex-wrap justify-between border-1 py-0 opacity-80 focus-visible:shadow-none focus-visible:ring-[1px]',
                    {
                      'pl-1!': selectedValues.length > 1,
                      'cursor-not-allowed opacity-50': disabled
                    }
                  )}
                >
                  {multiple ? (
                    selectedValues.length > 0 ? (
                      <div className='flex flex-wrap gap-2'>
                        {selectedValues.map((val) => {
                          const opt = options.find((o) => getValue(o) === val);
                          if (!opt) return null;
                          return (
                            <div
                              key={val}
                              className='bg-accent text-accent-foreground flex items-center rounded-lg px-3 py-1 text-sm'
                            >
                              {getPrefix?.(opt) && (
                                <span className='mr-1 font-mono text-xs opacity-70'>
                                  {getPrefix(opt)}
                                </span>
                              )}
                              {getLabel(opt)}
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  field.onChange(
                                    selectedValues.filter((v) => v !== val)
                                  );
                                }}
                                className='hover:text-destructive ml-2 cursor-pointer text-lg leading-none'
                              >
                                <X />
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className='opacity-30'>{placeholder}</span>
                    )
                  ) : selectedValues.length === 1 ? (
                    (() => {
                      const val = selectedValues[0];
                      const opt = options.find((o) => getValue(o) === val);
                      return opt ? (
                        <div className='flex items-center gap-2 truncate'>
                          {getPrefix?.(opt)}
                          <span>{getLabel(opt)}</span>
                        </div>
                      ) : (
                        <span className='opacity-30'>{placeholder}</span>
                      );
                    })()
                  ) : (
                    <span className='opacity-30'>{placeholder}</span>
                  )}

                  {selectedValues.length > 0 && allowClear ? (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange(multiple ? [] : '');
                        setOpen(false);
                      }}
                      className='bg-accent ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full p-2 hover:opacity-80'
                    >
                      <X className='size-3' />
                    </span>
                  ) : (
                    <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  )}
                </Button>
              </PopoverTrigger>

              {description && (
                <FormDescription className='ml-1.5'>
                  {description}
                </FormDescription>
              )}

              <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
                <Command className='bg-background'>
                  <CommandInput placeholder={searchText} />
                  <CommandEmpty>{notFoundContent}</CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => {
                      const val = getValue(opt);
                      return (
                        <CommandItem
                          key={val}
                          onSelect={() => toggleValue(val)}
                          className={cn('cursor-pointer rounded select-none', {
                            'bg-accent text-accent-foreground':
                              selectedValues.includes(val)
                          })}
                        >
                          {getPrefix?.(opt) && (
                            <span className='mr-1 font-mono text-xs opacity-70'>
                              {getPrefix(opt)}
                            </span>
                          )}
                          {getLabel(opt)}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage className={'mb-0 ml-1'} />
          </FormItem>
        );
      }}
    />
  );
}
