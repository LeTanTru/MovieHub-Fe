'use client';

import { useAuth } from '@/hooks';

export function SurveyInfo() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className=''>
      <h1 className='mb-4 text-4xl leading-12 font-semibold'>
        {profile.fullName.split(' ').at(-1)}, hãy chọn những phim mà bạn thích
        nhé!
      </h1>
      <p className='text-base leading-10'>
        Việc này sẽ giúp chúng tôi hiểu hơn về sở thích của bạn và đưa ra những
        gợi ý phù hợp hơn trong tương lai.&nbsp;
        <span className='text-golden-glow font-semibold'>
          Hãy chọn những bộ phim bạn đã xem và yêu thích.
        </span>
      </p>
    </div>
  );
}
