import './person-list.css';
import { route } from '@/routes';
import { PersonResType } from '@/types';
import { renderImageUrl } from '@/utils';
import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PersonCard({ person }: { person: PersonResType }) {
  return (
    <div className='relative overflow-hidden rounded-lg p-0'>
      <div className='flex flex-col items-center justify-center gap-0'>
        <Link
          href={`${route.person.path}/${person.id}`}
          className='image-mask relative w-full shrink-0 overflow-hidden rounded-none pb-[calc(100%+40px)]'
        >
          {person.avatarPath ? (
            <Image
              alt={person.name}
              className='absolute top-0 right-0 bottom-0 left-0 object-cover transition-all duration-200 ease-linear hover:scale-105'
              fill
              sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
              src={renderImageUrl(person.avatarPath)}
              unoptimized
            />
          ) : (
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              <User className='size-15' />
            </div>
          )}
        </Link>
        <div className='relative z-2 -mt-10 px-2 py-3 max-sm:text-[13px]'>
          <h3>{person.otherName}</h3>
        </div>
      </div>
    </div>
  );
}
