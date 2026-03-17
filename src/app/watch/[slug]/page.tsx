import {
  commentApiRequest,
  movieApiRequest,
  moviePersonApiRequest,
  reviewApiRequest
} from '@/api-requests';
import { Watch } from '@/app/watch/[slug]/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import envConfig from '@/config';
import {
  AppConstants,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_START,
  queryKeys
} from '@/constants';
import {
  ApiResponseList,
  CommentResType,
  CommentSearchType,
  MoviePersonSearchType,
  ReviewResType,
  ReviewSearchType
} from '@/types';
import { getIdFromSlug, sanitizeText } from '@/utils';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  const movies = await movieApiRequest.getList({
    size: DEFAULT_PAGE_SIZE
  });
  return movies.data.content.map((movie) => ({
    slug: `${movie.slug}.${movie.id}`
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const id = getIdFromSlug(slug);

  const res = await movieApiRequest.getById(id);
  const previousImages = (await parent).openGraph?.images || [];
  const images = res.data?.posterUrl
    ? [`${AppConstants.contentRootUrl}${res.data.posterUrl}`, ...previousImages]
    : previousImages;

  return {
    title: res.data
      ? `Xem phim ${res.data?.title} - ${res.data?.originalTitle}`
      : 'Không tìm thấy phim',
    description: sanitizeText(res.data?.description || 'Thông tin phim'),
    openGraph: {
      title: res.data
        ? `Xem phim ${res.data?.title} - ${res.data?.originalTitle}`
        : 'Không tìm thấy phim',
      description: sanitizeText(res.data?.description || 'Thông tin phim'),
      images
    },
    twitter: {
      card: 'summary_large_image',
      title: res.data
        ? `Phim ${res.data?.title} - ${res.data?.originalTitle}`
        : 'Không tìm thấy phim',
      description: sanitizeText(res.data?.description || 'Thông tin phim'),
      images
    },
    alternates: {
      canonical: `${envConfig.NEXT_PUBLIC_URL}/movie/${slug}`
    }
  };
}

export default async function WatchPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = getIdFromSlug(slug);

  const moviePersonFilters: MoviePersonSearchType = {
    movieId: id
  };

  const commentFilters: CommentSearchType = {
    movieId: id,
    size: DEFAULT_PAGE_SIZE
  };

  const reviewFilters: ReviewSearchType = {
    movieId: id,
    size: DEFAULT_PAGE_SIZE
  };

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE, id],
      queryFn: () => movieApiRequest.getById(id)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_PERSON_LIST, moviePersonFilters],
      queryFn: () => moviePersonApiRequest.getList(moviePersonFilters)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_SUGGESTION_LIST, id],
      queryFn: () => movieApiRequest.getSuggestionList(id)
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: [queryKeys.COMMENT_LIST, commentFilters],
      queryFn: ({ pageParam }) =>
        commentApiRequest.getList({
          movieId: id,
          page: pageParam,
          size: DEFAULT_PAGE_SIZE
        }),
      initialPageParam: DEFAULT_PAGE_START,
      getNextPageParam: (
        lastPage: ApiResponseList<CommentResType>,
        pages: ApiResponseList<CommentResType>[]
      ) => (pages.length < lastPage.data.totalPages ? pages.length : undefined)
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: [queryKeys.REVIEW_LIST, reviewFilters],
      queryFn: ({ pageParam }) =>
        reviewApiRequest.getList({
          movieId: id,
          page: pageParam,
          size: DEFAULT_PAGE_SIZE
        }),
      initialPageParam: DEFAULT_PAGE_START,
      getNextPageParam: (
        lastPage: ApiResponseList<ReviewResType>,
        pages: ApiResponseList<ReviewResType>[]
      ) => (pages.length < lastPage.data.totalPages ? pages.length : undefined)
    })
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
        <Watch id={id} />
      </Container>
    </HydrationBoundary>
  );
}
