import {
  categoryApiRequest,
  collectionApiRequest,
  movieApiRequest,
  personApiRequest
} from '@/api-requests';
import { envConfig } from '@/config';
import { MAX_PAGE_SIZE, countries } from '@/constants';
import { generateSlug } from '@/utils';
import type { MetadataRoute } from 'next';

const fetchAllPaginated = async <T>(
  fetchFn: (params: { page: number; size: number }) => Promise<{
    data: { content: T[]; totalPages: number };
  }>,
  pageSize: number = MAX_PAGE_SIZE
): Promise<T[]> => {
  const firstPage = await fetchFn({ page: 0, size: pageSize });
  const allItems = [...firstPage.data.content];
  const totalPages = firstPage.data.totalPages;

  const remainingPages = Array.from(
    { length: totalPages - 1 },
    (_, i) => i + 1
  );

  const results = await Promise.allSettled(
    remainingPages.map((page) => fetchFn({ page, size: pageSize }))
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value.data.content);
    }
  }

  return allItems;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = envConfig.NEXT_PUBLIC_URL;
  const now = new Date();

  const [moviesRes, categoriesRes, topicsRes, personsRes] =
    await Promise.allSettled([
      fetchAllPaginated((params) => movieApiRequest.getList(params)),
      fetchAllPaginated((params) => categoryApiRequest.getList(params)),
      fetchAllPaginated((params) => collectionApiRequest.getTopicList(params)),
      fetchAllPaginated((params) => personApiRequest.getList(params))
    ]);

  const movies = moviesRes.status === 'fulfilled' ? moviesRes.value : [];
  const categories =
    categoriesRes.status === 'fulfilled' ? categoriesRes.value : [];
  const topics = topicsRes.status === 'fulfilled' ? topicsRes.value : [];
  const persons = personsRes.status === 'fulfilled' ? personsRes.value : [];

  const movieUrls = movies.map((movie) => ({
    url: `${baseUrl}/movie/${movie.slug}.${movie.id}`,
    lastModified: movie.modifiedDate || movie.createdDate || now,
    changeFrequency: 'daily' as const,
    priority: 0.9
  }));

  const watchUrls = movies.map((movie) => ({
    url: `${baseUrl}/watch/${movie.slug}.${movie.id}`,
    lastModified: movie.modifiedDate || movie.createdDate || now,
    changeFrequency: 'daily' as const,
    priority: 0.8
  }));

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}.${category.id}`,
    lastModified: category.modifiedDate || category.createdDate || now,
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));

  const topicUrls = topics.map((topic) => ({
    url: `${baseUrl}/topic/${generateSlug(topic.name)}.${topic.id}`,
    lastModified: topic.modifiedDate || topic.createdDate || now,
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  const personUrls = persons.map((person) => ({
    url: `${baseUrl}/person/${person.id}`,
    lastModified: person.modifiedDate || person.createdDate || now,
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  const countryUrls = countries.map((country) => ({
    url: `${baseUrl}/country/${generateSlug(country.label)}.${country.value}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1
    },
    {
      url: `${baseUrl}/movie/single`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.6
    },
    {
      url: `${baseUrl}/movie/series`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.6
    },
    {
      url: `${baseUrl}/topic`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `${baseUrl}/person`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.6
    },
    ...movieUrls,
    ...watchUrls,
    ...categoryUrls,
    ...topicUrls,
    ...personUrls,
    ...countryUrls
  ];
}
