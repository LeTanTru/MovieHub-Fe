export default function PlaylistItemSkeleton() {
  return (
    <div className='flex items-center gap-2'>
      <div className='skeleton h-4 w-4 rounded-sm! bg-gray-500!' />
      <div className='skeleton h-4 w-32 grow rounded bg-gray-500!' />
    </div>
  );
}
