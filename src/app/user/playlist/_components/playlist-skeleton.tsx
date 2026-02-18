export default function PlaylistCardSkeleton() {
  return (
    <div className='rounded-md border-2 p-4'>
      <h3 className='skeleton mb-4 h-5 w-20 rounded'></h3>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-x-2'>
          <div className='skeleton h-5 w-5 rounded-full'></div>
          <div className='skeleton h-5 w-12 rounded'></div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
