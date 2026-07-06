'use client';

import { useId } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib';
import type { OptionType } from '@/types';

type RadioGroupFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  options: OptionType[];
  direction?: 'row' | 'col';
  required?: boolean;
  className?: string;
  radioGroupClassName?: string;
  itemClassName?: string;
  labelClassName?: string;
  formItemClassName?: string;
  disabled?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
};

export function RadioGroupField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  direction = 'col',
  required,
  className,
  radioGroupClassName,
  itemClassName,
  labelClassName,
  formItemClassName,
  disabled,
  value,
  onValueChange
}: RadioGroupFieldProps<T>) {
  const id = useId();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            'relative space-y-3',
            {
              'cursor-not-allowed select-none': disabled
            },
            formItemClassName
          )}
        >
          {label && (
            <FormLabel
              className={cn('ml-2', labelClassName, {
                'cursor-not-allowed opacity-50 select-none': disabled
              })}
            >
              {label}
              {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <RadioGroup
              onValueChange={(nextValue) => {
                field.onChange(nextValue);
                onValueChange?.(nextValue);
              }}
              value={
                value ??
                (field.value === null || field.value === undefined
                  ? ''
                  : String(field.value))
              }
              className={cn(`flex flex-${direction} gap-3`, className)}
            >
              {options.map((option, index) => {
                const optionId = `${id}-${index}`;

                return (
                  <FormItem
                    key={option.value}
                    className={cn(
                      'flex items-center gap-2',
                      radioGroupClassName
                    )}
                  >
                    <FormControl>
                      <RadioGroupItem
                        id={optionId}
                        className={cn(
                          'data-[state=checked]:border-golden-glow data-[state=checked]:[&_svg]:fill-golden-glow data-[state=checked]:[&_svg]:stroke-golden-glow size-4.5 border-slate-400 bg-transparent text-white transition-all duration-200 ease-linear data-[state=checked]:bg-transparent data-[state=checked]:[&_svg]:size-3 data-[state=checked]:[&_svg]:rounded-full',
                          {
                            'cursor-not-allowed opacity-50 select-none':
                              disabled
                          },
                          itemClassName
                        )}
                        value={String(option.value)}
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor={optionId}
                      className='cursor-pointer font-normal'
                    >
                      {option.label}
                    </FormLabel>
                  </FormItem>
                );
              })}
            </RadioGroup>
          </FormControl>
          {fieldState.error && (
            <div className='animate-in fade-in -mb-6 ml-2 flex min-h-6 items-end'>
              <FormMessage className='leading-5.5' />
            </div>
          )}
        </FormItem>
      )}
    />
  );
}
