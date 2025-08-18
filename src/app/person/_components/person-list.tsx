'use client';

import { AppConstants } from '@/constants';
import { usePersonQuery } from '@/queries/use-person';
import route from '@/routes';
import Image from 'next/image';
import Link from 'next/link';
import './person-card.css';

export default function PersonList() {
  const personList = usePersonQuery();

  return (
    <div className='grid grid-cols-8 gap-6'>
      {personList?.content.map((person) => (
        <div key={person.id} className='relative'>
          <Link
            href={`${route.person}/${person.id}`}
            className='image-mask relative block h-62.5 rounded-lg'
          >
            <Image
              src={`${AppConstants.contentRootUrl}${person.avatarPath}`}
              alt={person.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes='(max-width: 640px) 100vw,
                    (max-width: 768px) 50vw,
                    (max-width: 1024px) 33vw,
                    25vw'
              className='transition-all duration-200 ease-linear hover:scale-105'
            />
          </Link>
          <div className='absolute bottom-2 left-1/2 -translate-x-1/2 text-center'>
            <h3>{person.otherName}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
