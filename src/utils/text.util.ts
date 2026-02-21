import { logger } from '@/logger';

export const stripHtml = (html: string) => {
  if (!html) return '';

  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
};

export const removeAccents = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export const parseJSON = <T>(str: string): T => {
  try {
    return JSON.parse(str) as T;
  } catch (error) {
    logger.error('Failed to parse JSON:', error);
    return {} as T;
  }
};
