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
    logger.error('[PARSE_JSON_ERROR]', error);
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
    logger.error('[PARSE_COLOR_ERROR]', error);
    return [];
  }
};

export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallthrough nếu bị từ chối permission
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText =
      'position:fixed;top:-9999px;left:-9999px;opacity:0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
};
