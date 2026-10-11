import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Lato } from 'next/font/google';
import HtmlLangSync from '@/components/html-lang-sync';
import { DEFAULT_LOCALE, getSiteContent } from '@/lib/i18n';
import { buildRootMetadata } from '@/lib/seo';
import { assetPath } from '@/lib/asset-path';
import '../globals.css';

const baseMetadata = buildRootMetadata(getSiteContent(DEFAULT_LOCALE));

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

export const metadata: Metadata = {
  ...baseMetadata,
  icons: {
    icon: [{ url: assetPath('/icon-light-32x32.svg') }],
  },
};

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body className={`${cormorant.variable} ${lato.variable} font-sans antialiased bg-background`}>
        <HtmlLangSync />
        {children}
      </body>
    </html>
  );
}
