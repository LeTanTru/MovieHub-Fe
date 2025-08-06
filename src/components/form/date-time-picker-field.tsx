'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format, Locale } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Control, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/form';
import { vi } from 'date-fns/locale';

type Props = {
  control: Control<any>;
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  format?: string;
  labelClassName?: string;
};

export default function DateTimePickerField({
  control,
  name,
  label,
  description,
  required,
  format: dateFormat = 'dd/MM/yyyy HH:mm:ss',
  labelClassName
}: Props) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const seconds = Array.from({ length: 60 }, (_, i) => i);
  const [isOpen, setIsOpen] = React.useState(false);
  const calendarLocale: Locale = vi;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const date = field.value ? new Date(field.value) : undefined;

        const handleDateSelect = (selected: Date | undefined) => {
          if (selected) {
            const updated = new Date(field.value ?? selected);
            updated.setFullYear(
              selected.getFullYear(),
              selected.getMonth(),
              selected.getDate()
            );
            field.onChange(updated);
          }
        };

        const handleTimeChange = (
          type: 'hour' | 'minute' | 'second',
          val: number
        ) => {
          const current = new Date(field.value ?? new Date());
          if (type === 'hour') current.setHours(val);
          if (type === 'minute') current.setMinutes(val);
          if (type === 'second') current.setSeconds(val);
          field.onChange(current);
        };

        const getSelectedTime = () => {
          const d = new Date(field.value ?? new Date());
          return {
            hour: d.getHours(),
            minute: d.getMinutes(),
            second: d.getSeconds()
          };
        };

        const { hour, minute, second } = getSelectedTime();

        return (
          <FormItem>
            {label && (
              <FormLabel className={cn('ml-1 gap-1.5', labelClassName)}>
                {label}
                {required && <span className='text-destructive'>*</span>}
              </FormLabel>
            )}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    <span suppressHydrationWarning>
                      {field.value
                        ? format(new Date(field.value), dateFormat)
                        : dateFormat}
                    </span>
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <div className='sm:flex'>
                  <Calendar
                    locale={calendarLocale}
                    mode='single'
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                  <div className='flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0'>
                    {/* Hour */}
                    <ScrollArea className='w-64 sm:w-auto'>
                      <div className='flex p-2 sm:flex-col'>
                        {hours.map((h) => (
                          <Button
                            key={h}
                            size='icon'
                            variant={hour === h ? 'default' : 'ghost'}
                            className='aspect-square shrink-0 sm:w-full'
                            onClick={() => handleTimeChange('hour', h)}
                          >
                            {String(h).padStart(2, '0')}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar
                        orientation='horizontal'
                        className='sm:hidden'
                      />
                    </ScrollArea>
                    {/* Minute */}
                    <ScrollArea className='w-64 sm:w-auto'>
                      <div className='flex p-2 sm:flex-col'>
                        {minutes.map((m) => (
                          <Button
                            key={m}
                            size='icon'
                            variant={minute === m ? 'default' : 'ghost'}
                            className='aspect-square shrink-0 sm:w-full'
                            onClick={() => handleTimeChange('minute', m)}
                          >
                            {String(m).padStart(2, '0')}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar
                        orientation='horizontal'
                        className='sm:hidden'
                      />
                    </ScrollArea>
                    {/* Second */}
                    <ScrollArea className='w-64 sm:w-auto'>
                      <div className='flex p-2 sm:flex-col'>
                        {seconds.map((s) => (
                          <Button
                            key={s}
                            size='icon'
                            variant={second === s ? 'default' : 'ghost'}
                            className='aspect-square shrink-0 sm:w-full'
                            onClick={() => handleTimeChange('second', s)}
                          >
                            {String(s).padStart(2, '0')}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar
                        orientation='horizontal'
                        className='sm:hidden'
                      />
                    </ScrollArea>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
}
