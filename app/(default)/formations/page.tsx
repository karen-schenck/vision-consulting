import type { Metadata } from 'next';
import { TrainingsIndexContent } from '@/components/trainings-index-content';
import { DefaultLocaleContentProvider } from '@/components/default-locale-content-provider';
import { JsonLd } from '@/components/shared/json-ld';
import { DEFAULT_LOCALE, getSiteContent } from '@/lib/i18n';
import { buildSubpageMetadata } from '@/lib/seo';
import { trainingsIndexSchema } from '@/lib/page-schema';

const content = getSiteContent(DEFAULT_LOCALE);

export const dynamic = 'force-static';

export const metadata: Metadata = buildSubpageMetadata(
  DEFAULT_LOCALE,
  '/formations',
  content.trainingsPage.metadata.title,
  content.trainingsPage.metadata.description
);

export default function Page() {
  return (
    <>
      <JsonLd data={trainingsIndexSchema(DEFAULT_LOCALE)} />
      <DefaultLocaleContentProvider content={content}>
        <TrainingsIndexContent />
      </DefaultLocaleContentProvider>
    </>
  );
}
