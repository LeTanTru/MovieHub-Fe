import {
  commentApiRequest,
  movieApiRequest,
  moviePersonApiRequest,
  reviewApiRequest
} from '@/api-requests';
import { Watch } from '@/app/watch/[slug]/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import { envConfig } from '@/config';
import {
  AppConstants,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_START,
  MAX_PAGE_SIZE,
  queryKeys
} from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  CommentResType,
  CommentSearchType,
  MetadataType,
  MoviePersonSearchType,
  MovieResType,
  ReviewResType,
  ReviewSearchType
} from '@/types';
import { JsonLd, BreadcrumbListJsonLd } from '@/components/seo';
import {
  getIdFromSlug,
  parseJSON,
  sanitizeText,
  stripHtml,
  truncate
} from '@/utils';
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
  const title = res.data
    ? `Xem phim ${res.data?.title} - ${res.data?.originalTitle}`
    : 'Không tìm thấy phim';
  const description = truncate(
    stripHtml(res.data?.description || 'Thông tin phim'),
    160
  );

  const previousImages = (await parent).openGraph?.images || [];
  const images = res.data?.posterUrl
    ? [
        {
          url: `${AppConstants.contentRootUrl}${res.data.posterUrl}`,
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
      ? [
          'xem phim',
          res.data.title,
          res.data.originalTitle || '',
          'phim hay',
          'xem phim trực tuyến'
        ]
      : ['xem phim', 'phim moviehub'],
    openGraph: {
      title,
      description,
      images,
      url: `/watch/${slug}`
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images
    },
    alternates: {
      canonical: `/watch/${slug}`
    }
  };
}

type WatchPageProps = { params: Promise<{ slug: string }> };

export default async function WatchPage({ params }: WatchPageProps) {
  const { slug } = await params;
  const id = getIdFromSlug(slug);

  const moviePersonFilters: MoviePersonSearchType = {
    movieId: id,
    size: MAX_PAGE_SIZE
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
      queryFn: ({ signal }) => movieApiRequest.getById(id, signal)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_PERSON_LIST, moviePersonFilters],
      queryFn: ({ signal }) =>
        moviePersonApiRequest.getList(moviePersonFilters, signal)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_SUGGESTION_LIST, id],
      queryFn: ({ signal }) => movieApiRequest.getSuggestionList(id, signal)
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: [queryKeys.COMMENT_LIST, commentFilters],
      queryFn: ({ pageParam, signal }) =>
        commentApiRequest.getList(
          {
            movieId: id,
            page: pageParam,
            size: DEFAULT_PAGE_SIZE
          },
          signal
        ),
      initialPageParam: DEFAULT_PAGE_START,
      getNextPageParam: (
        lastPage: ApiResponseList<CommentResType>,
        pages: ApiResponseList<CommentResType>[]
      ) => (pages.length < lastPage.data.totalPages ? pages.length : undefined)
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: [queryKeys.REVIEW_LIST, reviewFilters],
      queryFn: ({ pageParam, signal }) =>
        reviewApiRequest.getList(
          {
            movieId: id,
            page: pageParam,
            size: DEFAULT_PAGE_SIZE
          },
          signal
        ),
      initialPageParam: DEFAULT_PAGE_START,
      getNextPageParam: (
        lastPage: ApiResponseList<ReviewResType>,
        pages: ApiResponseList<ReviewResType>[]
      ) => (pages.length < lastPage.data.totalPages ? pages.length : undefined)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MOVIE_NEXT_EPISODE, id],
      queryFn: ({ signal }) => movieApiRequest.getNextEpisode(id, signal)
    })
  ]);

  const movieRes = queryClient.getQueryData<ApiResponse<MovieResType>>([
    queryKeys.MOVIE,
    id
  ]);

  const movie = movieRes?.data;
  const movieMetadata = movie
    ? parseJSON<MetadataType>(movie.metadata || '{}')
    : null;
  const jsonLd = movie
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: movie.title,
        alternateName: movie.originalTitle,
        description: sanitizeText(movie.description || ''),
        thumbnailUrl: movie.posterUrl
          ? `${AppConstants.contentRootUrl}${movie.posterUrl}`
          : `${AppConstants.contentRootUrl}${movie.thumbnailUrl}`,
        uploadDate: movie.releaseDate || movie.createdDate,
        duration: movieMetadata?.duration
          ? `PT${movieMetadata.duration}M`
          : undefined,
        contentUrl: `${envConfig.NEXT_PUBLIC_URL}/watch/${movie.slug}.${movie.id}`,
        embedUrl: `${envConfig.NEXT_PUBLIC_URL}/watch/${movie.slug}.${movie.id}`,
        url: `${envConfig.NEXT_PUBLIC_URL}/watch/${movie.slug}.${movie.id}`,
        ...(movie.averageRating
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: movie.averageRating,
                bestRating: 5,
                worstRating: 1,
                ratingCount: movie.reviewCount || 0
              }
            }
          : {})
      }
    : null;

  const breadcrumbLd = movie
    ? {
        items: [
          { name: 'Trang chủ', item: envConfig.NEXT_PUBLIC_URL },
          {
            name: 'Xem phim',
            item: `${envConfig.NEXT_PUBLIC_URL}/watch/${movie.slug}.${movie.id}`
          },
          {
            name: movie.title,
            item: `${envConfig.NEXT_PUBLIC_URL}/watch/${movie.slug}.${movie.id}`
          }
        ]
      }
    : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {jsonLd && <JsonLd data={jsonLd} />}
      {breadcrumbLd && <BreadcrumbListJsonLd items={breadcrumbLd.items} />}
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 min-h-page-height relative py-40'>
        <Watch id={id} />
      </Container>
    </HydrationBoundary>
  );
}
