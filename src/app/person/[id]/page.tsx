import { personApiRequest } from '@/api-requests';
import PersonSidebar from '@/app/person/[id]/person-sidebar';
import PersonMovieList from '@/app/person/[id]/person-movie-list';
import { AppConstants } from '@/constants';

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await personApiRequest.getById({ id });
  return {
    title: res.data?.otherName,
    description: res.data?.bio,
    openGraph: {
      images: [`${AppConstants.contentRootUrl}${res.data?.avatarPath}`]
    }
  };
}

export default async function PersonDetail({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className='relative mx-auto flex w-full max-w-[1640px] items-stretch justify-between gap-0 px-5 py-0'>
      <PersonSidebar id={id} />
      <PersonMovieList id={id} />
    </div>
  );
}
