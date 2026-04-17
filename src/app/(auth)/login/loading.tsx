import { VerticalBarLoading } from '@/components/loading';

export default function Loading() {
  return (
    <div className='max-1600 flex min-h-[90vh] items-center justify-center'>
      <VerticalBarLoading />
    </div>
  );
}
