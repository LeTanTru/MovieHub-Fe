import PersonList from '@/app/person/_components/person-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diễn viên',
  description: 'Trang danh sách diễn viên MovieHub'
};

export default async function PersonPage() {
  return (
    <>
      <div className='max-989:mb-2.5 mb-5'>
        <h3 className='max-1600:text-2xl m-0 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          Diễn viên
        </h3>
      </div>
      <PersonList />
    </>
  );
}
