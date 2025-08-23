import { AppConstants } from '@/constants';
import route from '@/routes';
import { PersonResType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function PersonCard({ person }: { person: PersonResType }) {
  return (
    <div className='relative overflow-hidden rounded-[10px] p-0'>
      <div className='flex flex-col items-center justify-center gap-0'>
        <Link
          href={`${route.person}/${person.id}`}
          className='image-mask relative m-0 h-0 w-full flex-shrink-0 overflow-hidden rounded-none bg-[#282b3a] pb-[calc(100%_+_40px)]'
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
            className='absolute top-0 right-0 bottom-0 left-0 h-full w-full object-cover transition-all duration-200 ease-linear hover:scale-105'
          />
        </Link>
        <div className='relative z-2 -mt-10 px-2 py-3 max-[640px]:text-[13px]'>
          <h3>{person.otherName}</h3>
        </div>
      </div>
    </div>
  );
}
