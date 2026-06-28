'use client';

import { useAuth } from '@/hooks';

export function SurveyInfo() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className='sticky top-4'>
      <h1 className='max-1536:text-2xl max-1536:leading-8 max-640:text-xl max-480:leading-7 max-860:mb-3 max-860:text-3xl max-640:mb-2 mb-4 text-3xl leading-10 font-semibold'>
        {profile.fullName.split(' ').at(-1)}, hãy chọn những phim mà bạn thích
        nhé!
      </h1>
      <p className='max-640:leading-7 max-640:text-sm text-justify text-base leading-8'>
        Việc này sẽ giúp chúng tôi hiểu hơn về sở thích của bạn và đưa ra những
        gợi ý phù hợp hơn trong tương lai.&nbsp;
        <span className='text-golden-glow font-semibold'>
          Hãy chọn những bộ phim bạn đã xem và yêu thích.
        </span>
      </p>
    </div>
  );
}
