import { notFound } from 'next/navigation';
import { LocalizedContentProvider } from '@/components/localized-content-provider';
import { LandingPageContent } from '@/components/landing-page-content';
import { JsonLd } from '@/components/shared/json-ld';
import { buildMetadata, buildStructuredData } from '@/lib/seo';
import { homeFaqSchema } from '@/lib/page-schema';
import { getLatestInsights } from '@/lib/blog';
import { getSiteContent, isLocale, NON_DEFAULT_LOCALES, type Locale } from '@/lib/i18n';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return buildMetadata(locale as Locale, getSiteContent(locale));
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getSiteContent(locale);
  const structuredData = [...buildStructuredData(locale as Locale, content), homeFaqSchema(locale as Locale)];

  return (
    <>
      <JsonLd data={structuredData} />
      <LocalizedContentProvider locale={locale as Locale}>
        <LandingPageContent latestPosts={getLatestInsights(locale as Locale)} />
      </LocalizedContentProvider>
    </>
  );
}
