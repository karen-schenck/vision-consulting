import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { LocalizedContentProvider } from '@/components/localized-content-provider';
import { LegalPageContent } from '@/components/legal-page-content';
import { getSiteContent, isLocale, NON_DEFAULT_LOCALES, type Locale } from '@/lib/i18n';
import { buildSubpageMetadata } from '@/lib/seo';

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
    locale as Locale,
    '/confidentialite',
    content.privacyPage.metadata.title,
    content.privacyPage.metadata.description
  );
}

export default async function LocaleConfidentialitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getSiteContent(locale);

  return (
    <LocalizedContentProvider locale={locale as Locale}>
      <LegalPageContent locale={locale as Locale} content={content} page="privacyPage" />
    </LocalizedContentProvider>
  );
}
