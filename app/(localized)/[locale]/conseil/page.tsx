import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ConsultingPageContent } from '@/components/consulting-page-content';
import { LocalizedContentProvider } from '@/components/localized-content-provider';
import { JsonLd } from '@/components/shared/json-ld';
import { getSiteContent, isLocale, NON_DEFAULT_LOCALES, type Locale } from '@/lib/i18n';
import { buildSubpageMetadata } from '@/lib/seo';
import { simplePageSchema } from '@/lib/page-schema';

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
    '/conseil',
    content.consultingPage.metadata.title,
    content.consultingPage.metadata.description
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
      <JsonLd data={simplePageSchema(locale as Locale, content.consultingPage.badge, '/conseil')} />
      <LocalizedContentProvider locale={locale as Locale}>
        <ConsultingPageContent />
      </LocalizedContentProvider>
    </>
  );
}
