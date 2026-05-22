import { cn } from '@/lib';

type MovieTabHeadingProps = {
  title: string;
  className?: string;
};

export function MovieTabHeading({ title, className }: MovieTabHeadingProps) {
  return (
    <h3
      className={cn(
        'max-1120:mb-4 max-640:text-lg max-480:text-base max-640:mb-3 mb-6 text-xl font-semibold',
        className
      )}
    >
      {title}
    </h3>
  );
}
