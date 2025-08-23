import PersonList from '@/app/person/_components/person-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diễn viên',
  description: 'Trang danh sách diễn viên MovieHub'
};

export default async function PersonPage() {
  return (
    <>
      <div className='mb-5 max-[989px]:mb-2.5'>
        <h3 className='m-0 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)] max-[1600px]:text-2xl'>
          Diễn viên
        </h3>
      </div>
      <PersonList />
    </>
  );
}
