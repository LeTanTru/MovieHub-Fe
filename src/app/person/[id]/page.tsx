import { personApiRequest } from '@/api-requests';
import PersonSidebar from '@/app/person/[id]/person-sidebar';
import PersonMovieList from '@/app/person/[id]/person-movie-list';
import { AppConstants } from '@/constants';
import { stripHtml } from '@/utils';
import type { Metadata, ResolvingMetadata } from 'next';
import { cache } from 'react';
import { logger } from '@/logger';

export const getPersonDetail = cache(
  async (id: number) => await personApiRequest.getById({ id })
);

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);

  try {
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
        canonical: `/person/${id}`
      }
    };
  } catch (error) {
    logger.error('🚀 ~ generateMetadata ~ error:', error);
    return {
      title: 'Thông tin diễn viên',
      description: 'Trang chi tiết diễn viên',
      openGraph: {
        title: 'Thông tin diễn viên',
        description: 'Trang chi tiết diễn viên'
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Thông tin diễn viên',
        description: 'Trang chi tiết diễn viên'
      }
    };
  }
}

export default async function PersonDetail({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  return (
    <div className='relative mx-auto flex w-full max-w-[1640px] items-stretch justify-between gap-0 px-5 py-0'>
      <PersonSidebar id={numericId} />
      <PersonMovieList id={numericId} />
    </div>
  );
}
