import { MAX_PLAYLIST_COUNT } from '@/constants';

function PlaylistItemSkeleton() {
  return (
    <div className='flex items-center gap-2'>
      <div className='skeleton h-4 w-4 rounded-sm! bg-gray-500!' />
      <div className='skeleton h-4 w-32 grow rounded bg-gray-500!' />
    </div>
  );
}

export default function PlaylistItemListSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      {Array.from({ length: MAX_PLAYLIST_COUNT }).map((_, index) => (
        <PlaylistItemSkeleton key={index} />
      ))}
    </div>
  );
}
