import { Button } from '@/components/form';
import { cn } from '@/lib';

export default function ButtonSkipIntro({
  skipIntro,
  className,
  handleToggleSkipIntro
}: {
  skipIntro: boolean;
  className?: string;
  handleToggleSkipIntro: () => void;
}) {
  return (
    <Button
      variant='ghost'
      className={cn(
        'dark:hover:text-golden-glow group flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear dark:hover:bg-white/10',
        className
      )}
      onClick={handleToggleSkipIntro}
    >
      Bỏ qua giới thiệu
      <span
        className={cn(
          'group-hover:border-golden-glow w-8 cursor-pointer rounded border border-solid border-white p-1 text-center text-[10px] leading-none transition-all duration-200 ease-linear',
          {
            'border-golden-glow text-golden-glow opacity-100': skipIntro,
            'opacity-50 group-hover:opacity-100': !skipIntro
          }
        )}
      >
        {skipIntro ? 'ON' : 'OFF'}
      </span>
    </Button>
  );
}
