'use client';

import { getIdFromSlug } from '@/utils';
import { useParams } from 'next/navigation';

export const useSlugId = () => {
  const params = useParams<{ slug?: string; id?: string }>();
  const slug = params.slug || params.id || '';
  const id = params.id || getIdFromSlug(slug);
  return { slug, id };
};
