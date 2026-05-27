import { envConfig } from '@/config';
import { AppConstants, VIDEO_LIBRARY_SOURCE_TYPE_EXTERNAL } from '@/constants';
import { route } from '@/routes';
import { removeAccents } from '@/utils/text.util';

export const renderListPageUrl = (path: string, queryString: string) => {
  if (queryString) {
    return `${path}?${queryString}`;
  }
  return path;
};

export const generatePath = (
  template: string,
  params: Record<string, string | number>
) => {
  return template.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    if (params[key] === undefined) {
      throw new Error(`Missing parameter "${key}" for path "${template}"`);
    }
    return encodeURIComponent(params[key]);
  });
};

export const renderVideoUrl = (
  hostname: string,
  url: string,
  sourceType: number
) => {
  if (!hostname || !url) return '';

  if (sourceType === VIDEO_LIBRARY_SOURCE_TYPE_EXTERNAL) return url;

  if (hostname.startsWith('https'))
    return `${hostname}/v1/file/download-video-resource${url}`;

  return `https://${hostname}/v1/file/download-video-resource${url}`;
};

export const renderImageUrl = (url: string | undefined | null) => {
  if (!url) return '';
  return url.startsWith('https') ? url : `${AppConstants.contentRootUrl}${url}`;
};

export const renderVttUrl = (
  hostname: string,
  url: string,
  sourceType: number
) => {
  if (!hostname || !url) return '';

  if (sourceType === VIDEO_LIBRARY_SOURCE_TYPE_EXTERNAL) return url;

  if (hostname.startsWith('https'))
    return `${hostname}/v1/file/public-download${url}`;

  return `https://${hostname}/v1/file/public-download${url}`;
};

export const renderFileUrl = (
  url: string,
  isPublic: boolean = false,
  queryString?: string
) => {
  if (!url) return '';
  const baseUrl = isPublic
    ? AppConstants.publicContentUrl
    : AppConstants.contentRootUrl;

  const finalUrl = url.startsWith('https') ? url : `${baseUrl}${url}`;
  return queryString ? `${finalUrl}?${queryString}` : finalUrl;
};

export const getIdFromSlug = (slug: string) => {
  return slug.split('.')[1];
};

export const generateSlug = (str: string) => {
  return removeAccents(str).toLowerCase().split(' ').join('-');
};

export const getSafeRedirectPath = (
  path: string | null | undefined,
  baseUrl: string,
  fallbackPath: string
) => {
  if (!path?.startsWith('/') || path.startsWith('//')) {
    return fallbackPath;
  }

  try {
    const url = new URL(path, baseUrl);
    const baseOrigin = new URL(baseUrl).origin;
    return url.origin === baseOrigin ? path : fallbackPath;
  } catch {
    return fallbackPath;
  }
};

export const buildAuthPathWithRedirect = (
  pathname: string,
  redirect?: string | null
) => {
  const safeRedirect = getSafeRedirectPath(
    redirect,
    envConfig.NEXT_PUBLIC_URL,
    ''
  );

  if (!safeRedirect) {
    return pathname;
  }

  const params = new URLSearchParams({ redirect: safeRedirect });
  return `${pathname}?${params.toString()}`;
};

export const buildLoginRedirectPath = (
  pathname?: string,
  queryString?: string
) => {
  const currentPathname =
    pathname ??
    (typeof window === 'undefined'
      ? route.home.path
      : `${window.location.pathname}${window.location.search}`);

  const redirectPath = queryString
    ? `${currentPathname}${queryString.startsWith('?') ? '' : '?'}${queryString}`
    : currentPathname;

  const params = new URLSearchParams({ redirect: redirectPath });
  return `${route.login.path}?${params.toString()}`;
};
