import { DeferredCookieConsent } from '@/components/deferred-cookie-consent';
import { LandingContentProvider } from '@/components/providers/landing-content-provider';
import { getSiteContent, type Locale } from '@/lib/i18n';

const googleAnalyticsId = process.env.NEXT_PUBLIC_G_ANALYTICS;

export function LocalizedContentProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LandingContentProvider locale={locale} content={getSiteContent(locale)}>
      {children}
      <DeferredCookieConsent gaId={googleAnalyticsId} />
    </LandingContentProvider>
  );
}
