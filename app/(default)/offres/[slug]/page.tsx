import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { OfferDetailContent } from '@/components/offer-detail-content';
import { DefaultLocaleContentProvider } from '@/components/default-locale-content-provider';
import { JsonLd } from '@/components/shared/json-ld';
import { DEFAULT_LOCALE, getSiteContent } from '@/lib/i18n';
import { buildSubpageMetadata } from '@/lib/seo';
import { offerSchema } from '@/lib/page-schema';

const content = getSiteContent(DEFAULT_LOCALE);

export const dynamic = 'force-static';

export function generateStaticParams() {
  return content.offersPage.offers.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = content.offersPage.offers.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return buildSubpageMetadata(DEFAULT_LOCALE, `/offres/${slug}`, item.metadata.title, item.metadata.description);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!content.offersPage.offers.some((entry) => entry.slug === slug)) notFound();

  return (
    <>
      <JsonLd data={offerSchema(DEFAULT_LOCALE, slug)} />
      <DefaultLocaleContentProvider content={content}>
        <OfferDetailContent slug={slug} />
      </DefaultLocaleContentProvider>
    </>
  );
}
