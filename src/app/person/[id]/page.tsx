import { personApiRequest } from '@/api-requests';
import PersonSidebar from '@/app/person/[id]/person-sidebar';
import PersonMovieList from '@/app/person/[id]/person-movie-list';
import { AppConstants } from '@/constants';
import { stripHtml } from '@/utils';

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const res = await personApiRequest.getById({ id });
  const plainDescription = stripHtml(
    res.data?.bio ?? 'Trang chi tiết diễn viên'
  ).slice(0, 160);
  return {
    title: res.data?.otherName,
    description: plainDescription,
    openGraph: {
      title: res.data?.otherName,
      description: plainDescription,
      images: [`${AppConstants.contentRootUrl}${res.data?.avatarPath}`]
    }
  };
}

export default async function PersonDetail({
  params
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  return (
    <div className='relative mx-auto flex w-full max-w-[1640px] items-stretch justify-between gap-0 px-5 py-0'>
      <PersonSidebar id={id} />
      <PersonMovieList id={id} />
    </div>
  );
}
