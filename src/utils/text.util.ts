import { logger } from '@/logger';

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

export const getLastWord = (text: string): string => {
  const words = text.trim().split(/\s+/);
  return words[words.length - 1] || '';
};

export const getColorList = (colorStr: string): string[] => {
  try {
    const colors = JSON.parse(colorStr);
    if (Array.isArray(colors)) {
      return colors;
    }
    logger.warn('Parsed color is not an array:', colors);
    return [];
  } catch (error) {
    logger.error('Failed to parse color string:', error);
    return [];
  }
};
