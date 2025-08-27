'use client';

import { useState, useEffect } from 'react';
import './person-card.css';
import PersonCard from '@/app/person/_components/person-card';
import PersonCardSkeleton from '@/app/person/_components/person-card-skeleton';
import Pagination from '@/components/pagination';
import { useSearchParams } from 'next/navigation';
import { usePersonListQuery } from '@/queries';

function useColumns() {
  const [columns, setColumns] = useState<number | null>(null);

  useEffect(() => {
    const updateCols = () => {
      const width = window.innerWidth;
      let cols = 8;
      if (width <= 480) cols = 2;
      else if (width <= 640) cols = 3;
      else if (width <= 990) cols = 4;
      else if (width <= 1600) cols = 6;
      setColumns(cols);
    };

    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  return columns;
}

export default function PersonList() {
  const columns = useColumns();
  const params = useSearchParams();
  const page = params.get('page') ?? 1;

  const skeletonCount = columns ? columns * 3 : 0;
  const res = usePersonListQuery(
    {
      page: +page - 1,
      size: skeletonCount
    },
    !!columns
  );

  const personList = res.data?.data.content;

  return (
    <>
      <div
        className={`grid gap-6 ${columns === 8 ? 'grid-cols-8' : ''} ${columns === 6 ? 'max-1600:grid-cols-6 gap-5 gap-y-8' : ''} ${columns === 4 ? 'max-990:grid-cols-4' : ''} ${columns === 3 ? 'gap-x-2.5 gap-y-6 max-sm:grid-cols-3' : ''} ${columns === 2 ? 'max-480:grid-cols-2' : ''}`}
      >
        {!res.isLoading
          ? personList?.map((person) => (
              <PersonCard person={person} key={person.id} />
            ))
          : Array.from({ length: skeletonCount }, (_, index) => (
              <PersonCardSkeleton key={index} />
            ))}
      </div>
      {!res.isLoading && res.data && (
        <Pagination totalPages={res.data.data.totalPages} />
      )}
    </>
  );
}
