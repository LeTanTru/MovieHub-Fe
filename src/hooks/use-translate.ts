'use client';

import { useTranslations } from 'next-intl';

export default function useTranslate() {
  const t = useTranslations();

  const formatMessage = (key: string) => t(key);

  const formatKeys = <T extends Record<string, any>>(
    items: T[],
    keys: (keyof T)[]
  ): T[] => {
    return items.map((item) => {
      const newItem = { ...item };
      keys.forEach((key) => {
        const value = item[key];
        if (typeof value === 'string') {
          newItem[key] = t(value as string) as T[typeof key];
        }
      });
      return newItem;
    });
  };

  return {
    formatMessage,
    formatKeys
  };
}
