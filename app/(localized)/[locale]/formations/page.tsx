import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TrainingsIndexContent } from '@/components/trainings-index-content';
import { LocalizedContentProvider } from '@/components/localized-content-provider';
import { JsonLd } from '@/components/shared/json-ld';
import { getSiteContent, isLocale, NON_DEFAULT_LOCALES, type Locale } from '@/lib/i18n';
import { buildSubpageMetadata } from '@/lib/seo';
import { trainingsIndexSchema } from '@/lib/page-schema';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getSiteContent(locale);
  return buildSubpageMetadata(
    locale,
    '/formations',
    content.trainingsPage.metadata.title,
    content.trainingsPage.metadata.description
  );
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getSiteContent(locale);

  return (
    <>
      <JsonLd data={trainingsIndexSchema(locale as Locale)} />
      <LocalizedContentProvider locale={locale as Locale}>
        <TrainingsIndexContent />
      </LocalizedContentProvider>
    </>
  );
}
