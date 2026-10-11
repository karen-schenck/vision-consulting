import { DeferredCookieConsent } from '@/components/deferred-cookie-consent';
import { LandingContentProvider } from '@/components/providers/landing-content-provider';
import { DEFAULT_LOCALE, getSiteContent, type SiteContent } from '@/lib/i18n';

const googleAnalyticsId = process.env.NEXT_PUBLIC_G_ANALYTICS;

export function DefaultLocaleContentProvider({
  children,
  content = getSiteContent(DEFAULT_LOCALE),
}: {
  children: React.ReactNode;
  content?: SiteContent;
}) {
  return (
    <LandingContentProvider locale={DEFAULT_LOCALE} content={content}>
      {children}
      <DeferredCookieConsent gaId={googleAnalyticsId} />
    </LandingContentProvider>
  );
}
