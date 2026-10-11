import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Lato } from 'next/font/google';
import { notFound } from 'next/navigation';
import HtmlLangSync from '@/components/html-lang-sync';
import { getSiteContent, isLocale, NON_DEFAULT_LOCALES } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';
import '../../globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0F1B33',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

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
  return buildMetadata(locale, getSiteContent(locale));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${cormorant.variable} ${lato.variable} font-sans antialiased bg-background`}>
        <HtmlLangSync />
        {children}
      </body>
    </html>
  );
}
