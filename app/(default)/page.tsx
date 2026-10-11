import { DefaultLocaleContentProvider } from '@/components/default-locale-content-provider';
import { LandingPageContent } from '@/components/landing-page-content';
import { JsonLd } from '@/components/shared/json-ld';
import { buildRootMetadata, buildStructuredData } from '@/lib/seo';
import { homeFaqSchema } from '@/lib/page-schema';
import { getLatestInsights } from '@/lib/blog';
import { DEFAULT_LOCALE, getSiteContent } from '@/lib/i18n';

const content = getSiteContent(DEFAULT_LOCALE);
const structuredData = [...buildStructuredData(DEFAULT_LOCALE, content), homeFaqSchema(DEFAULT_LOCALE)];

export const metadata = buildRootMetadata(content);

export default function LandingPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <DefaultLocaleContentProvider content={content}>
        <LandingPageContent latestPosts={getLatestInsights(DEFAULT_LOCALE)} />
      </DefaultLocaleContentProvider>
    </>
  );
}
