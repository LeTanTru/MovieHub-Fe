import { PersonCard } from '@/components/app/person-card';
import { NoData } from '@/components/no-data';
import { FAVOURITE_TYPE_PERSON } from '@/constants';
import { cn } from '@/lib';
import type { PersonResType } from '@/types';

type PersonListProps = {
  isLoading: boolean;
  personList: PersonResType[];
  handleDeleteFavourite: (targetId: string) => void;
};

export function PersonList({
  isLoading,
  personList,
  handleDeleteFavourite
}: PersonListProps) {
  return (
    <div
      role='tabpanel'
      id={`favourite-tabpanel-${FAVOURITE_TYPE_PERSON}`}
      aria-labelledby={`favourite-tab-${FAVOURITE_TYPE_PERSON}`}
    >
      {isLoading ? (
        <div
          className={cn(
            'grid w-full grid-cols-8 gap-6',
            'max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-1600:gap-4 max-480:gap-y-4 max-640:gap-y-6 grid w-full grow grid-cols-6 gap-6'
          )}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <PersonCard.Skeleton key={index} />
          ))}
        </div>
      ) : personList.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={
            <>
              Bạn chưa có diễn viên yêu thích nào
              <br />
              Hãy tìm kiếm và thêm diễn viên yêu thích nhé 😊
            </>
          }
        />
      ) : (
        <div className='max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-1600:gap-4 max-480:gap-y-4 max-640:gap-y-6 grid w-full grow grid-cols-6 gap-6'>
          {personList.map((person) => (
            <PersonCard
              person={person}
              key={person.id}
              willNavigate
              onDelete={handleDeleteFavourite}
              deleteMessage='Bạn có chắc chắn muốn xóa diễn viên này ra khỏi danh sách yêu thích không ?'
            />
          ))}
        </div>
      )}
    </div>
  );
}
