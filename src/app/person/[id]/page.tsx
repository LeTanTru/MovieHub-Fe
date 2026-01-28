import { stripHtml } from '@/utils';
import type { Metadata, ResolvingMetadata } from 'next';
import envConfig from '@/config';
import { AppConstants } from '@/constants';
import { personApiRequest } from '@/api-requests';
import {
  getPersonDetail,
  PersonMovieList,
  PersonSidebar
} from '@/app/person/[id]/_components';

export async function generateStaticParams() {
  const persons = await personApiRequest.getList();
  return persons.data.content.map((person) => ({
    id: `${person.id}`
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);

  const res = await getPersonDetail(numericId);
  const plainDescription = stripHtml(
    res.data?.bio ?? 'Thông tin diễn viên'
  ).slice(0, 160);
  const previousImages = (await parent).openGraph?.images || [];
  const images = res.data?.avatarPath
    ? [
        `${AppConstants.contentRootUrl}${res.data.avatarPath}`,
        ...previousImages
      ]
    : previousImages;

  return {
    title: `Thông tin diễn viên ${res.data?.otherName}`,
    description: plainDescription,
    openGraph: {
      title: `Thông tin diễn viên ${res.data?.otherName}`,
      description: plainDescription,
      images
    },
    twitter: {
      card: 'summary_large_image',
      title: `Thông tin diễn viên ${res.data?.otherName}`,
      description: plainDescription,
      images
    },
    alternates: {
      canonical: `${envConfig.NEXT_PUBLIC_URL}/person/${id}`
    }
  };
}

export default async function PersonDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const res = await getPersonDetail(numericId);

  return (
    <div className='max-1120:flex-col max-1120:px-0 relative mx-auto flex w-full max-w-410 items-stretch justify-between gap-0 px-5 py-0'>
      <PersonSidebar person={res.data} />
      <PersonMovieList id={numericId} />
    </div>
  );
}
