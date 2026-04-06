'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function SurveyCardSkeleton() {
  return (
    <Skeleton className='bg-gunmetal-blue skeleton relative block h-0 w-full overflow-hidden rounded-md! pb-[150%]' />
  );
}
