'use client';

import { useState, useEffect } from 'react';
import { usePersonQuery } from '@/queries/use-person';
import './person-card.css';
import PersonCard from '@/app/person/_components/person-card';
import PersonCardSkeleton from '@/app/person/_components/person-card-skeleton';
import Pagination from '@/components/pagination';
import { useSearchParams } from 'next/navigation';

export default function PersonList() {
  const defaultColPerRow = 8;
  const [columns, setColumns] = useState<number>(defaultColPerRow);
  const params = useSearchParams();
  const page = params.get('page') ?? 1;

  // Render col per row
  useEffect(() => {
    const updateCols = () => {
      const width = window.innerWidth;
      if (width <= 480) setColumns(2);
      else if (width <= 640) setColumns(3);
      else if (width <= 990) setColumns(4);
      else if (width <= 1600) setColumns(6);
      else setColumns(8);
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  const skeletonCount = columns * 3;
  const res = usePersonQuery({ page: +page - 1, size: skeletonCount });
  const personList = res.data?.data.content;

  return (
    <>
      <div className='grid grid-cols-8 gap-6 max-[1600px]:grid-cols-6 max-[990px]:grid-cols-4 max-[640px]:grid-cols-3 max-[480px]:grid-cols-2'>
        {!res.isLoading
          ? personList?.map((person) => (
              <PersonCard person={person} key={person.id} />
            ))
          : Array.from({ length: skeletonCount }, (_, index) => (
              <PersonCardSkeleton key={index} />
            ))}
      </div>
      {!res.isLoading && <Pagination totalPages={res.data!.data.totalPages} />}
    </>
  );
}
