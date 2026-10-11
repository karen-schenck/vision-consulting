import type { Metadata } from 'next';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, getSiteContent, type Locale, type SiteContent } from '@/lib/i18n';
import { assetPath } from '@/lib/asset-path';

type Breadcrumb = { name: string; url: string };

const defaultSiteContent = getSiteContent(DEFAULT_LOCALE);
const siteName = defaultSiteContent.seo.schema?.website?.name || defaultSiteContent.header.brand.name;
export const canonicalBase = defaultSiteContent.seo.canonical?.replace(/\/$/, '') || '';
export const defaultRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  } as const,
} satisfies Metadata['robots'];

const localeToOgLocale: Record<Locale, string> = {
  fr: 'fr_FR',
  en: 'en_US',
};

// Asset URLs (images, feeds) must keep their extension as the last segment —
// the trailing slash the page routes want would make them 404.
function isFilePath(pathname: string) {
  return /\.[a-z0-9]+$/i.test(pathname.split('/').pop() ?? '');
}

function withTrailingSlash(path: string) {
  if (!path || path === '/') return '/';
  const [pathname, fragment] = path.split('#');
  const normalizedPathname =
    pathname.endsWith('/') || isFilePath(pathname) ? pathname : `${pathname}/`;
  return fragment ? `${normalizedPathname}#${fragment}` : normalizedPathname;
}

function withCanonicalBase(path: string) {
  const normalizedPath = withTrailingSlash(path);
  return canonicalBase ? `${canonicalBase}${normalizedPath}` : normalizedPath;
}

function normalizeUrl(url: string) {
  if (!url) return canonicalBase;
  if (url.startsWith('http')) return url;
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  return canonicalBase ? `${canonicalBase}${withTrailingSlash(`/${cleanPath}`)}` : withTrailingSlash(`/${cleanPath}`);
}

function getSeoConfig(content: SiteContent) {
  return content.seo;
}

function getCanonicalPath(locale: Locale, pathSuffix = '') {
  return locale === DEFAULT_LOCALE ? pathSuffix || '/' : `/${locale}${pathSuffix}`;
}

export function getCanonicalUrl(locale: Locale, pathSuffix = '') {
  return withCanonicalBase(getCanonicalPath(locale, pathSuffix));
}

export function buildLanguageAlternates(pathSuffix = '') {
  return {
    ...Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [locale, getCanonicalUrl(locale, pathSuffix)])
    ),
    'x-default': withCanonicalBase(pathSuffix || '/'),
  };
}

export function getOpenGraphLocale(locale: Locale) {
  return localeToOgLocale[locale];
}

function buildOgImages(content: SiteContent) {
  return getSeoConfig(content).openGraph?.images?.map((image) => ({
    ...image,
    url: normalizeUrl(image.url),
  }));
}

function buildPreviewImages(_locale: Locale, content: SiteContent) {
  const images = buildOgImages(content) ?? [];
  return images.filter(
    (image, index) => images.findIndex((candidate) => candidate.url === image.url) === index
  );
}

export function buildRootMetadata(content: SiteContent): Metadata {
  const canonical = getCanonicalUrl(DEFAULT_LOCALE);
  const seo = getSeoConfig(content);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    applicationName: siteName,
    metadataBase: canonicalBase ? new URL(canonicalBase) : undefined,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(),
    },
    robots: (seo.robots as Metadata['robots'] | undefined) ?? defaultRobots,
    category: 'business',
    creator: siteName,
    publisher: siteName,
    referrer: 'origin-when-cross-origin',
    icons: {
      icon: [{ url: assetPath('/icon-light-32x32.svg') }],
    },
    openGraph: {
      ...seo.openGraph,
      title: seo.title,
      description: seo.description,
      locale: localeToOgLocale[DEFAULT_LOCALE],
      url: canonical,
      siteName,
      images: buildPreviewImages(DEFAULT_LOCALE, content),
    },
    twitter: {
      ...seo.twitter,
      title: seo.title,
      description: seo.description,
      images: buildPreviewImages(DEFAULT_LOCALE, content).map(({ url, alt }) => ({ url, alt })),
    },
  };
}

export function buildMetadata(locale: Locale, content: SiteContent): Metadata {
  const canonical = getCanonicalUrl(locale);
  const seo = getSeoConfig(content);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    applicationName: siteName,
    metadataBase: canonicalBase ? new URL(canonicalBase) : undefined,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(),
    },
    robots: (seo.robots as Metadata['robots'] | undefined) ?? defaultRobots,
    category: 'business',
    creator: siteName,
    publisher: siteName,
    referrer: 'origin-when-cross-origin',
    icons: {
      icon: [{ url: assetPath('/icon-light-32x32.svg') }],
    },
    openGraph: {
      ...seo.openGraph,
      title: seo.title,
      description: seo.description,
      locale: localeToOgLocale[locale],
      url: canonical,
      siteName,
      images: buildPreviewImages(locale, content),
    },
    twitter: {
      ...seo.twitter,
      title: seo.title,
      description: seo.description,
      images: buildPreviewImages(locale, content).map(({ url, alt }) => ({ url, alt })),
    },
  };
}

export function buildSubpageMetadata(
  locale: Locale,
  pathSuffix: string,
  title: string,
  description: string
): Metadata {
  const canonical = getCanonicalUrl(locale, pathSuffix);
  const content = getSiteContent(locale);
  const seo = getSeoConfig(content);

  return {
    title,
    description,
    keywords: seo.keywords,
    applicationName: siteName,
    metadataBase: canonicalBase ? new URL(canonicalBase) : undefined,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(pathSuffix),
    },
    robots: (seo.robots as Metadata['robots'] | undefined) ?? defaultRobots,
    category: 'business',
    creator: siteName,
    publisher: siteName,
    referrer: 'origin-when-cross-origin',
    openGraph: {
      ...seo.openGraph,
      title,
      description,
      locale: localeToOgLocale[locale],
      url: canonical,
      siteName,
      images: buildPreviewImages(locale, content),
    },
    twitter: {
      ...seo.twitter,
      title,
      description,
      images: buildPreviewImages(locale, content).map(({ url, alt }) => ({ url, alt })),
    },
  };
}

export function buildStructuredData(locale: Locale, content: SiteContent) {
  const pageUrl = getCanonicalUrl(locale);
  const seo = getSeoConfig(content);
  const siteSchema = seo.schema;

  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: seo.title,
    description: seo.description,
    inLanguage: locale,
    isPartOf: `${canonicalBase}/#website`,
  };

  const breadcrumbItems =
    siteSchema?.breadcrumbs?.map((crumb: Breadcrumb, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: normalizeUrl(getCanonicalPath(locale, crumb.url)),
    })) || [];

  const organization =
    siteSchema?.organization && Object.keys(siteSchema.organization).length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': `${canonicalBase}/#organization`,
          ...siteSchema.organization,
          url: normalizeUrl(siteSchema.organization.url),
          logo: normalizeUrl((siteSchema.organization as unknown as Record<string, string>).logo || ''),
          image: normalizeUrl((siteSchema.organization as unknown as Record<string, string>).image || ''),
        }
      : null;

  const website =
    siteSchema?.website && Object.keys(siteSchema.website).length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          ...siteSchema.website,
          url: canonicalBase,
          name: content.header.brand.name,
          inLanguage: locale,
          publisher: {
            '@id': `${canonicalBase}/#organization`,
          },
        }
      : null;

  const breadcrumbList =
    breadcrumbItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems,
        }
      : null;

  return [organization, website, webpage, breadcrumbList].filter(Boolean);
}
