import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function About({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('AboutPage');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <p>{t('backToHome')}</p>
    </div>
  );
}
