import type { Metadata } from 'next';
import { OffersIndexContent } from '@/components/offers-index-content';
import { DefaultLocaleContentProvider } from '@/components/default-locale-content-provider';
import { JsonLd } from '@/components/shared/json-ld';
import { DEFAULT_LOCALE, getSiteContent } from '@/lib/i18n';
import { buildSubpageMetadata } from '@/lib/seo';
import { offersIndexSchema } from '@/lib/page-schema';

const content = getSiteContent(DEFAULT_LOCALE);

export const dynamic = 'force-static';

export const metadata: Metadata = buildSubpageMetadata(
  DEFAULT_LOCALE,
  '/offres',
  content.offersPage.metadata.title,
  content.offersPage.metadata.description
);

export default function Page() {
  return (
    <>
      <JsonLd data={offersIndexSchema(DEFAULT_LOCALE)} />
      <DefaultLocaleContentProvider content={content}>
        <OffersIndexContent />
      </DefaultLocaleContentProvider>
    </>
  );
}
