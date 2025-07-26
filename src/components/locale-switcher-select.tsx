'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { useRouter, usePathname } from '@/i18n/navigation';
import { CheckIcon, GlobeIcon } from 'lucide-react';

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
};

export default function LocaleSwitcherSelect({ defaultValue, items }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const onChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  return (
    <div className='relative'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='h-10 w-10 rounded-full'
          >
            <GlobeIcon className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:text-white' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {items.map((item) => (
            <DropdownMenuItem
              key={item.value}
              className='flex cursor-default items-center px-3 py-2 text-base dark:data-[highlighted]:bg-slate-800'
              onClick={() => onChange(item.value)}
            >
              <div className='mr-2 w-[1rem]'>
                {item.value === defaultValue && (
                  <CheckIcon className='light:text-gray-700 h-5 w-5 dark:text-slate-100' />
                )}
              </div>
              <span className='light:text-gray-700 dark:text-slate-100'>
                {item.label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
