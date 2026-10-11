'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n';

export default function HtmlLangSync() {
  const pathname = usePathname();

  useEffect(() => {
    const segment = pathname?.split('/').filter(Boolean)[0];
    const locale = segment && isLocale(segment) ? segment : DEFAULT_LOCALE;
    document.documentElement.lang = locale;
  }, [pathname]);

  return null;
}
