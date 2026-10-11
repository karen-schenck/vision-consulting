'use client';

import dynamic from 'next/dynamic';

const CookieConsent = dynamic(
  () => import('@/components/cookie-consent').then((mod) => mod.CookieConsent),
  { ssr: false }
);

export function DeferredCookieConsent({ gaId }: { gaId?: string }) {
  return <CookieConsent gaId={gaId} />;
}
