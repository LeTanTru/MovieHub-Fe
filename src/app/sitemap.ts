import {
  categoryApiRequest,
  collectionApiRequest,
  movieApiRequest,
  personApiRequest
} from '@/api-requests';
import envConfig from '@/config';
import { DEFAULT_PAGE_SIZE, countries } from '@/constants';
import { generateSlug } from '@/utils';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = envConfig.NEXT_PUBLIC_URL;
  const now = new Date();

  const [moviesRes, categoriesRes, topicsRes, personsRes] =
    await Promise.allSettled([
      movieApiRequest.getList({ size: DEFAULT_PAGE_SIZE }),
      categoryApiRequest.getList({ size: DEFAULT_PAGE_SIZE }),
      collectionApiRequest.getTopicList({ size: DEFAULT_PAGE_SIZE }),
      personApiRequest.getList({ size: DEFAULT_PAGE_SIZE })
    ]);

  const movieUrls =
    moviesRes.status === 'fulfilled'
      ? moviesRes.value.data.content.map((movie) => ({
          url: `${baseUrl}/movie/${movie.slug}.${movie.id}`,
          lastModified: movie.modifiedDate || movie.createdDate || now,
          changeFrequency: 'daily' as const,
          priority: 0.9
        }))
      : [];

  const categoryUrls =
    categoriesRes.status === 'fulfilled'
      ? categoriesRes.value.data.content.map((category) => ({
          url: `${baseUrl}/category/${category.slug}.${category.id}`,
          lastModified: category.modifiedDate || category.createdDate || now,
          changeFrequency: 'weekly' as const,
          priority: 0.8
        }))
      : [];

  const topicUrls =
    topicsRes.status === 'fulfilled'
      ? topicsRes.value.data.content.map((topic) => ({
          url: `${baseUrl}/topic/${generateSlug(topic.name)}.${topic.id}`,
          lastModified: topic.modifiedDate || topic.createdDate || now,
          changeFrequency: 'weekly' as const,
          priority: 0.7
        }))
      : [];

  const personUrls =
    personsRes.status === 'fulfilled'
      ? personsRes.value.data.content.map((person) => ({
          url: `${baseUrl}/person/${person.id}`,
          lastModified: person.modifiedDate || person.createdDate || now,
          changeFrequency: 'weekly' as const,
          priority: 0.7
        }))
      : [];

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
      priority: 0.8
    },
    {
      url: `${baseUrl}/movie/series`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8
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
    {
      url: `${baseUrl}/survey`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5
    },
    ...movieUrls,
    ...categoryUrls,
    ...topicUrls,
    ...personUrls,
    ...countryUrls
  ];
}
