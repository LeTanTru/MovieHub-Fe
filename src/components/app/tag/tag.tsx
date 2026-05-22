import { cn } from '@/lib';
import Link from 'next/link';

type TagWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export function TagWrapper({ children, className }: TagWrapperProps) {
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
}

type TagIMDbProps = {
  value: string | number;
};

export function TagIMDb({ value }: TagIMDbProps) {
  return (
    <div className='border-golden-glow before:text-golden-glow inline-flex shrink-0 items-center rounded-[0.33rem] border border-solid bg-transparent px-[0.4rem] py-0 text-xs leading-6 text-white before:relative before:pr-1 before:text-[10px] before:font-medium before:content-["IMDb"]'>
      <span>{value}</span>
    </div>
  );
}

type TagAgeRatingProps = {
  value: string | number;
  className?: string;
};

export function TagAgeRating({ value, className }: TagAgeRatingProps) {
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
}

type TagNormalProps = {
  value: string | number;
  className?: string;
};

export function TagNormal({ value, className }: TagNormalProps) {
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
}

type TagCategoryProps = {
  text: string;
  className?: string;
};

export function TagCategory({ text, className }: TagCategoryProps) {
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
}

type TagCategoryLinkProps = {
  href: string;
  text: string;
};

export function TagCategoryLink({ href, text }: TagCategoryLinkProps) {
  return (
    <Link
      href={href}
      className='bg-transparent-white hover:text-golden-glow transition-color inline-flex h-6.5 items-center rounded px-0 px-2 text-xs text-white duration-200 ease-linear'
    >
      {text}
    </Link>
  );
}
