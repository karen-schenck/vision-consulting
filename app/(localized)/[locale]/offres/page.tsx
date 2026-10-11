import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { OffersIndexContent } from '@/components/offers-index-content';
import { LocalizedContentProvider } from '@/components/localized-content-provider';
import { JsonLd } from '@/components/shared/json-ld';
import { getSiteContent, isLocale, NON_DEFAULT_LOCALES, type Locale } from '@/lib/i18n';
import { buildSubpageMetadata } from '@/lib/seo';
import { offersIndexSchema } from '@/lib/page-schema';

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
    '/offres',
    content.offersPage.metadata.title,
    content.offersPage.metadata.description
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
      <JsonLd data={offersIndexSchema(locale as Locale)} />
      <LocalizedContentProvider locale={locale as Locale}>
        <OffersIndexContent />
      </LocalizedContentProvider>
    </>
  );
}
