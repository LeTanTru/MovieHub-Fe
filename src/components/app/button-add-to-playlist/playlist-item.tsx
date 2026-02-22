import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib';
import { PlaylistResType } from '@/types';

export default function PlaylistItem({
  playlist,
  checked,
  disabled = false,
  onToggle
}: {
  playlist: PlaylistResType;
  checked: boolean;
  disabled?: boolean;
  onToggle: (playlistId: string) => void;
}) {
  const handleToggle = () => {
    if (disabled) {
      return;
    }
    onToggle(playlist.id);
  };

  return (
    <label
      className={cn(`flex items-center gap-2 text-black`, {
        'opacity-60': disabled,
        'transtion-opacity duration-200 ease-linear hover:opacity-80': !disabled
      })}
      aria-disabled={disabled}
      htmlFor={playlist.id}
    >
      <Checkbox
        id={playlist.id}
        className='mb-0! cursor-pointer border-black transition-colors duration-200 ease-linear focus-visible:ring-0 data-[state=checked]:border-transparent data-[state=checked]:bg-blue-700! data-[state=checked]:text-white'
        checked={checked}
        disabled={disabled}
        aria-labelledby={`playlist-label-${playlist.id}`}
        onCheckedChange={handleToggle}
      />
      <span
        className={cn('w-full grow cursor-pointer select-none', {
          'cursor-not-allowed': disabled
        })}
        aria-labelledby={`playlist-label-${playlist.id}`}
      >
        {playlist.name}
      </span>
    </label>
  );
}
