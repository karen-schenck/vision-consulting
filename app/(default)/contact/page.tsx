import type { Metadata } from 'next';
import { ContactPageContent } from '@/components/contact-page-content';
import { DefaultLocaleContentProvider } from '@/components/default-locale-content-provider';
import { DEFAULT_LOCALE, getSiteContent } from '@/lib/i18n';
import { buildSubpageMetadata } from '@/lib/seo';

const content = getSiteContent(DEFAULT_LOCALE);

export const dynamic = 'force-static';

export const metadata: Metadata = {
  ...buildSubpageMetadata(
    DEFAULT_LOCALE,
    '/contact',
    content.contactPage.metadata.title,
    content.contactPage.metadata.description
  ),
};

export default function ContactPage() {
  return (
    <DefaultLocaleContentProvider content={content}>
      <ContactPageContent />
    </DefaultLocaleContentProvider>
  );
}
