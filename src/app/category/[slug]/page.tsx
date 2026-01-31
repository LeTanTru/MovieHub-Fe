import { categoryApiRequest, movieApiRequest } from '@/api-requests';
import CategoryList from './_components/category-list';
import type { Metadata } from 'next';
import { DEFAULT_PAGE_SIZE, queryKeys } from '@/constants';
import { getQueryClient } from '@/components/providers';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { MovieSearchType } from '@/types';

export async function generateStaticParams() {
  const categories = await categoryApiRequest.getList({
    params: { size: DEFAULT_PAGE_SIZE }
  });
  return categories.data.content.map((category) => ({
    slug: `${category?.slug}.${category?.id}`
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = slug.split('.')[1];
  const res = await categoryApiRequest.getById({ id });

  return {
    title: res.data?.name
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<MovieSearchType>;
}) {
  const { slug } = await params;
  const filters = await searchParams;
  const id = slug.split('.')[1];
  const defaultFilters: MovieSearchType = {
    page: 0,
    size: DEFAULT_PAGE_SIZE,
    categoryIds: id,
    ...filters
  };
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.CATEGORY, id],
    queryFn: () => categoryApiRequest.getById({ id })
  });

  await queryClient.prefetchQuery({
    queryKey: [`${queryKeys.MOVIE}-list`, defaultFilters],
    queryFn: () =>
      movieApiRequest.getList({
        params: defaultFilters
      })
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryList id={id} />
    </HydrationBoundary>
  );
}
