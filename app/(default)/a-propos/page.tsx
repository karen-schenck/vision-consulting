import type { Metadata } from 'next';
import { AboutPageContent } from '@/components/about-page-content';
import { DefaultLocaleContentProvider } from '@/components/default-locale-content-provider';
import { JsonLd } from '@/components/shared/json-ld';
import { DEFAULT_LOCALE, getSiteContent } from '@/lib/i18n';
import { buildSubpageMetadata } from '@/lib/seo';
import { simplePageSchema } from '@/lib/page-schema';

const content = getSiteContent(DEFAULT_LOCALE);

export const dynamic = 'force-static';

export const metadata: Metadata = buildSubpageMetadata(
  DEFAULT_LOCALE,
  '/a-propos',
  content.aboutPage.metadata.title,
  content.aboutPage.metadata.description
);

export default function Page() {
  return (
    <>
      <JsonLd data={simplePageSchema(DEFAULT_LOCALE, content.aboutPage.badge, '/a-propos')} />
      <DefaultLocaleContentProvider content={content}>
        <AboutPageContent />
      </DefaultLocaleContentProvider>
    </>
  );
}
