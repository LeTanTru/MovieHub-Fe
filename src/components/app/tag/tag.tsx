import { cn } from '@/lib';
import Link from 'next/link';

export const TagWrapper = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-start gap-2.5',
        className
      )}
    >
      {children}
    </div>
  );
};

export const TagIMDb = ({ value }: { value: string | number }) => {
  return (
    <div className='border-light-golden-yellow before:text-light-golden-yellow inline-flex shrink-0 items-center rounded-[0.33rem] border border-solid bg-transparent px-[0.4rem] py-0 text-xs leading-6 text-white before:relative before:pr-1 before:text-[10px] before:font-medium before:content-["IMDb"]'>
      <span>{value}</span>
    </div>
  );
};

export const TagAgeRating = ({
  value,
  className
}: {
  value: string | number;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center overflow-hidden rounded bg-white px-2 py-0 text-xs leading-6.5 font-medium text-black',
        className
      )}
    >
      <span>
        <strong>{value}</strong>
      </span>
    </div>
  );
};

export const TagNormal = ({
  value,
  className
}: {
  value: string | number;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'bg-transparent-white inline-flex h-6.5 items-center rounded border border-solid border-white px-2 py-0 text-xs text-white',
        className
      )}
    >
      <span>{value}</span>
    </div>
  );
};

export const TagCategory = ({
  text,
  className
}: {
  text: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'relative inline-flex h-auto items-center rounded bg-transparent p-0 text-xs text-white',
        className
      )}
    >
      {text}
    </div>
  );
};

export const TagCategoryLink = ({
  href,
  text
}: {
  href: string;
  text: string;
}) => {
  return (
    <Link
      href={href}
      className='bg-transparent-white hover:text-light-golden-yellow transition-color inline-flex h-6.5 items-center rounded px-0 px-2 text-xs text-white duration-200 ease-linear'
    >
      {text}
    </Link>
  );
};
