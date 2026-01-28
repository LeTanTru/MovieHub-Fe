export default function PersonCardSkeleton() {
  return (
    <div className='overflow-hidden rounded-lg p-0'>
      <div className='flex flex-col items-center justify-center gap-0'>
        <div className='m-0 h-0 w-full shrink-0 animate-pulse overflow-hidden rounded-none bg-[#282b3a] pb-[calc(100%+40px)]'></div>
      </div>
    </div>
  );
}
