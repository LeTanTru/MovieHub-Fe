import PersonList from '@/app/person/_components/person-list';

export default async function PersonPage() {
  return (
    <>
      <div className='mb-5'>
        <h3 className='m-0 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          Diễn viên
        </h3>
      </div>
      <PersonList />
    </>
  );
}
