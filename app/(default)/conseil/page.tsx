import type { Metadata } from 'next';
import { ConsultingPageContent } from '@/components/consulting-page-content';
import { DefaultLocaleContentProvider } from '@/components/default-locale-content-provider';
import { JsonLd } from '@/components/shared/json-ld';
import { DEFAULT_LOCALE, getSiteContent } from '@/lib/i18n';
import { buildSubpageMetadata } from '@/lib/seo';
import { simplePageSchema } from '@/lib/page-schema';

const content = getSiteContent(DEFAULT_LOCALE);

export const dynamic = 'force-static';

export const metadata: Metadata = buildSubpageMetadata(
  DEFAULT_LOCALE,
  '/conseil',
  content.consultingPage.metadata.title,
  content.consultingPage.metadata.description
);

export default function Page() {
  return (
    <>
      <JsonLd data={simplePageSchema(DEFAULT_LOCALE, content.consultingPage.badge, '/conseil')} />
      <DefaultLocaleContentProvider content={content}>
        <ConsultingPageContent />
      </DefaultLocaleContentProvider>
    </>
  );
}
