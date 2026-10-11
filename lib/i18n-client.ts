'use client';

import type { Locale } from '@/lib/i18n';

const STORAGE_KEY = 'NEXT_LOCALE';

export function persistPreferredLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Ignore browser persistence errors.
  }

  document.cookie = `${STORAGE_KEY}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}
