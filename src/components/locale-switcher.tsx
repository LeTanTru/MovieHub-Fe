'use client';

import { useTranslations } from 'next-intl';
import LocaleSwitcherSelect from './locale-switcher-select';
import { useParams } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const params = useParams();
  const localeParams = params.locale ?? defaultLocale;
  return (
    <LocaleSwitcherSelect
      defaultValue={localeParams as string}
      items={[
        {
          value: 'en',
          label: t('en')
        },
        {
          value: 'vi',
          label: t('vi')
        }
      ]}
    />
  );
}
