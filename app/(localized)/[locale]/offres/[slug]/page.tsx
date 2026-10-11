import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { OfferDetailContent } from '@/components/offer-detail-content';
import { LocalizedContentProvider } from '@/components/localized-content-provider';
import { JsonLd } from '@/components/shared/json-ld';
import { getSiteContent, isLocale, NON_DEFAULT_LOCALES, type Locale } from '@/lib/i18n';
import { buildSubpageMetadata } from '@/lib/seo';
import { offerSchema } from '@/lib/page-schema';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.flatMap((locale) =>
    getSiteContent(locale).offersPage.offers.map((item) => ({ locale, slug: item.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = getSiteContent(locale).offersPage.offers.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return buildSubpageMetadata(locale, `/offres/${slug}`, item.metadata.title, item.metadata.description);
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  if (!getSiteContent(locale).offersPage.offers.some((entry) => entry.slug === slug)) notFound();

  return (
    <>
      <JsonLd data={offerSchema(locale as Locale, slug)} />
      <LocalizedContentProvider locale={locale as Locale}>
        <OfferDetailContent slug={slug} />
      </LocalizedContentProvider>
    </>
  );
}
