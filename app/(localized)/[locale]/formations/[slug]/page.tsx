import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TrainingDetailContent } from '@/components/training-detail-content';
import { LocalizedContentProvider } from '@/components/localized-content-provider';
import { JsonLd } from '@/components/shared/json-ld';
import { getSiteContent, isLocale, NON_DEFAULT_LOCALES, type Locale } from '@/lib/i18n';
import { buildSubpageMetadata } from '@/lib/seo';
import { trainingSchema } from '@/lib/page-schema';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.flatMap((locale) =>
    getSiteContent(locale).trainingsPage.trainings.map((item) => ({ locale, slug: item.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = getSiteContent(locale).trainingsPage.trainings.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return buildSubpageMetadata(locale, `/formations/${slug}`, item.metadata.title, item.metadata.description);
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  if (!getSiteContent(locale).trainingsPage.trainings.some((entry) => entry.slug === slug)) notFound();

  return (
    <>
      <JsonLd data={trainingSchema(locale as Locale, slug)} />
      <LocalizedContentProvider locale={locale as Locale}>
        <TrainingDetailContent slug={slug} />
      </LocalizedContentProvider>
    </>
  );
}
