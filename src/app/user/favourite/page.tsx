import { Sidebar } from '@/app/user/_components';
import { FavouriteList } from '@/app/user/favourite/_components';
import { Container } from '@/components/layout';

export default function FavouritePage() {
  return (
    <Container className='min-h-[calc(100dvh-400px)] py-40'>
      <div className='relative z-3 mx-auto flex max-w-410 items-start justify-between gap-10 px-5'>
        <Sidebar />
        <div className='grow'>
          <FavouriteList />
        </div>
      </div>
    </Container>
  );
}
