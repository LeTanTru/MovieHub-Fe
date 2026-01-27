import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import type { ComponentProps } from 'react';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-normal disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer transition-all ease-linear duration-200 disabled:pointer-events-auto disabled:cursor-not-allowed focus-visible:ring-0",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/80 disabled:bg-primary/80 disabled:hover:bg-primary/80 dark:bg-primary dark:disabled:bg-primary/60 dark:disabled:hover:bg-primary/60',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/80 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 hover:opacity-80 disabled:bg-destructive/80 disabled:hover:bg-destructive/80 dark:bg-destructive dark:disabled:bg-destructive/80 dark:disabled:hover:bg-destructive/80',
        outline:
          'border border-input bg-transparent disabled:hover:bg-transparent disabled:border-gray-500/80 disabled:hover:border-gray-500/80 dark:border-gray-500 dark:hover:border-gray-500/80 dark:disabled:bg-transparent dark:hover:text-gray-500/80 dark:disabled:text-gray-500/80 dark:disabled:border-gray-500/80',
        secondary:
          'border border-gray-500 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-gray-500/80 hover:border-gray-500/80 disabled:text-gray-500/80 disabled:hover:border-gray-500/80 dark:bg-secondary dark:hover:bg-secondary/80 dark:disabled:bg-secondary/80 dark:disabled:hover:bg-secondary/80 dark:disabled:text-gray-400',
        ghost:
          'hover:bg-transparent hover:text-gray-500/80 disabled:bg-secondary/80 disabled:hover:bg-secondary/80 disabled:text-gray-500/80 disabled:hover:text-gray-500/80 dark:hover:bg-secondary/50 dark:disabled:bg-secondary/50 dark:disabled:hover:bg-secondary/50 dark:hover:text-gray-500/80 dark:disabled:text-gray-500/80',
        link: 'text-primary underline-offset-4 hover:underline',
        primary:
          'bg-main-color text-primary-foreground hover:bg-main-color/80 disabled:bg-main-color/80 disabled:hover:bg-main-color/80 disabled:text-primary-foreground/80 dark:disabled:bg-gray-500/80 dark:disabled:hover:bg-gray-500/80'
      },
      size: {
        default: 'h-9 px-4 has-[>svg]:px-4 py-2',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export default function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2
          className='h-5! w-5! animate-spin stroke-3'
          aria-hidden='true'
        />
      ) : (
        children
      )}
    </Comp>
  );
}
