import type {
  ApiResponse,
  MoviePersonSearchType,
  PersonResType
} from '@/types';
import { Container } from '@/components/layout';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {
  generateSlug,
  getIdFromSlug,
  sanitizeText,
  stripHtml,
  truncate
} from '@/utils';
import { getQueryClient } from '@/components/providers/query-provider';
import { JsonLd, BreadcrumbListJsonLd } from '@/components/seo';
import { moviePersonApiRequest, personApiRequest } from '@/api-requests';
import { Person } from '@/app/person/[slug]/_components';
import {
  AppConstants,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  PERSON_KIND_ACTOR,
  queryKeys
} from '@/constants';
import { envConfig } from '@/config';
import type { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  const persons = await personApiRequest.getList({
    size: DEFAULT_PAGE_SIZE
  });
  return persons.data.content.map((person) => ({
    slug: `${generateSlug(person.name)}.${person?.id}`
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const id = getIdFromSlug(slug);

  const res = await personApiRequest.getById(id);
  const title = res.data
    ? `Diễn viên ${res.data.otherName || res.data.name}`
    : 'Không tìm thấy diễn viên';
  const description = truncate(
    stripHtml(res.data?.bio ?? 'Thông tin diễn viên'),
    160
  );

  const previousImages = (await parent).openGraph?.images || [];
  const images = res.data?.avatarPath
    ? [
        {
          url: `${AppConstants.contentRootUrl}${res.data?.avatarPath}`,
          width: 1200,
          height: 630,
          alt: title
        },
        ...previousImages
      ]
    : previousImages;

  return {
    title,
    description,
    metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
    keywords: res.data
      ? [res.data.otherName, 'diễn viên', 'đạo diễn', 'phim moviehub']
      : ['diễn viên', 'người nổi tiếng'],
    openGraph: {
      type: 'profile',
      title,
      description,
      images,
      url: `/person/${id}`
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images
    },
    alternates: {
      canonical: `/person/${id}`
    }
  };
}

type PersonDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ kind?: MoviePersonSearchType['kind'] }>;
};

export default async function PersonDetailPage({
  params,
  searchParams
}: PersonDetailPageProps) {
  const { slug } = await params;
  const id = getIdFromSlug(slug);
  const { kind } = await searchParams;
  const queryClient = getQueryClient();
  const moviePersonFilters: MoviePersonSearchType = {
    personId: id,
    size: MAX_PAGE_SIZE,
    kind: kind || PERSON_KIND_ACTOR
  };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [queryKeys.PERSON, id],
      queryFn: ({ signal }) => personApiRequest.getById(id, signal)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_PERSON_LIST, moviePersonFilters],
      queryFn: ({ signal }) =>
        moviePersonApiRequest.getList(moviePersonFilters, signal)
    })
  ]);

  const personRes = queryClient.getQueryData<ApiResponse<PersonResType>>([
    queryKeys.PERSON,
    id
  ]);
  const person = personRes?.data;
  const jsonLd = person
    ? {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: person.name,
        alternateName: person.otherName,
        image: person.avatarPath
          ? `${AppConstants.contentRootUrl}${person.avatarPath}`
          : undefined,
        description: sanitizeText(person.bio || ''),
        birthDate: person.dateOfBirth,
        nationality: person.country,
        jobTitle: person.kinds?.includes(2) ? 'Director' : 'Actor',
        url: `${envConfig.NEXT_PUBLIC_URL}/person/${person.id}`
      }
    : null;

  const breadcrumbLd = person
    ? {
        items: [
          { name: 'Trang chủ', item: envConfig.NEXT_PUBLIC_URL },
          {
            name: 'Diễn viên',
            item: `${envConfig.NEXT_PUBLIC_URL}/person`
          },
          {
            name: person.otherName || person.name,
            item: `${envConfig.NEXT_PUBLIC_URL}/person/${person.id}`
          }
        ]
      }
    : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {jsonLd && <JsonLd data={jsonLd} />}
      {breadcrumbLd && <BreadcrumbListJsonLd items={breadcrumbLd.items} />}
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 min-h-page-height relative py-40'>
        <div className='max-1120:flex-col relative mx-auto flex w-full max-w-410 justify-between px-5'>
          <Person />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
