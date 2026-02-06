import {
  commentApiRequest,
  movieApiRequest,
  moviePersonApiRequest
} from '@/api-requests';
import reviewApiRequest from '@/api-requests/review.api-request';
import { Movie } from '@/app/movie/[slug]/_components';
import { getQueryClient } from '@/components/providers';
import envConfig from '@/config';
import {
  AppConstants,
  DEFAULT_PAGE_SIZE,
  DEFAULT_TABLE_PAGE_START,
  queryKeys
} from '@/constants';
import {
  CommentSearchType,
  MoviePersonSearchType,
  ReviewSearchType
} from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateStaticParams() {
  const movies = await movieApiRequest.getList({
    params: { size: DEFAULT_PAGE_SIZE }
  });
  return movies.data.content.map((movie) => ({
    slug: `${movie?.slug}.${movie?.id}`
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const id = slug.split('.')[1];

  const res = await movieApiRequest.getById({ id });
  const previousImages = (await parent).openGraph?.images || [];
  const images = res.data?.posterUrl
    ? [`${AppConstants.contentRootUrl}${res.data.posterUrl}`, ...previousImages]
    : previousImages;

  return {
    title: `Phim ${res.data?.title} - ${res.data?.originalTitle}`,
    description: res.data?.description,
    openGraph: {
      title: `Phim ${res.data?.title} - ${res.data?.originalTitle}`,
      description: res.data?.description,
      images
    },
    twitter: {
      card: 'summary_large_image',
      title: `Phim ${res.data?.title} - ${res.data?.originalTitle}`,
      description: res.data?.description,
      images
    },
    alternates: {
      canonical: `${envConfig.NEXT_PUBLIC_URL}/movie/${slug}`
    }
  };
}

export default async function MoviePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = slug.split('.')[1];
  const moviePersonFilters: MoviePersonSearchType = {
    movieId: id
  };

  const commentFilters: CommentSearchType = {
    movieId: id,
    page: DEFAULT_TABLE_PAGE_START,
    size: DEFAULT_PAGE_SIZE
  };

  const reviewFilters: ReviewSearchType = {
    movieId: id,
    page: DEFAULT_TABLE_PAGE_START,
    size: DEFAULT_PAGE_SIZE
  };

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE, id],
    queryFn: () => movieApiRequest.getById({ id })
  });

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE_PERSON_LIST, moviePersonFilters],
    queryFn: () => moviePersonApiRequest.getList({ params: moviePersonFilters })
  });

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE_SUGGESTION_LIST, id],
    queryFn: () => movieApiRequest.getSuggestionList({ id })
  });

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.COMMENT_LIST, commentFilters],
    queryFn: () => commentApiRequest.getList({ params: commentFilters })
  });

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.REVIEW_LIST, reviewFilters],
    queryFn: () => reviewApiRequest.getList({ params: reviewFilters })
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Movie id={id} />
    </HydrationBoundary>
  );
}
