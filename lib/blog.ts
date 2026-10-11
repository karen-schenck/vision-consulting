import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import blogUi from '@/data/blog-ui.json';
import { extractMarkdownHeadings, type MarkdownHeading } from '@/lib/markdown';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, getSiteContent, type Locale } from '@/lib/i18n';
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';
import {
  buildLanguageAlternates,
  canonicalBase,
  defaultRobots,
  getOpenGraphLocale,
} from '@/lib/seo';

type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogAuthor = {
  name: string;
  role: string;
  bio: string;
  avatarLabel?: string;
  profileHref?: string;
};

type BlogCta = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

type BlogFrontmatter = {
  slug: string;
  category: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  keywords: string[];
  author?: BlogAuthor;
  heroEyebrow: string;
  intro: string;
  keyTakeaways: string[];
  faq: BlogFaq[];
  relatedSlugs: string[];
  cta: BlogCta;
};

type LocalizedBlogFrontmatter = Omit<
  BlogFrontmatter,
  'slug' | 'publishedAt' | 'updatedAt' | 'relatedSlugs'
>;

type BlogMarkdownFrontmatter = BlogFrontmatter & {
  locales?: Partial<Record<Locale, Partial<LocalizedBlogFrontmatter>>>;
};

export type BlogUi = (typeof blogUi)[Locale];

export type BlogPost = BlogFrontmatter & {
  author: BlogAuthor;
  body: string;
  headings: MarkdownHeading[];
};

const BLOGS_DIRECTORY = path.join(process.cwd(), 'data', 'blogs');

const BLOG_INDEX_TITLES: Record<Locale, string> = {
  fr: 'Blog : stratégie, performance commerciale & facteur humain | Vision Human Consulting',
  en: 'Insights on Strategy, Sales Performance & the Human Factor | Vision Human Consulting',
};

const DEFAULT_BLOG_AUTHORS: Record<Locale, BlogAuthor> = {
  fr: {
    name: 'Karen Schenck',
    role: 'Fondatrice de Vision Human Consulting',
    bio: 'Karen Schenck a fondé Vision Human Consulting après plus de vingt ans en stratégie commerciale, marketing, management et expérience client. Elle accompagne dirigeants et équipes commerciales avec la méthode ODC : Observer, Décoder, Consolider.',
    avatarLabel: 'KS',
    profileHref: '/a-propos',
  },
  en: {
    name: 'Karen Schenck',
    role: 'Founder of Vision Human Consulting',
    bio: 'Karen Schenck founded Vision Human Consulting after more than twenty years in commercial strategy, marketing, management and customer experience. She supports leaders and sales teams with the ODC method: Observe, Decode, Consolidate.',
    avatarLabel: 'KS',
    profileHref: '/a-propos',
  },
};

function withTrailingSlash(pathname: string) {
  if (!pathname || pathname === '/') return '/';
  const [pathPart, fragment] = pathname.split('#');
  const normalizedPath = pathPart.endsWith('/') ? pathPart : `${pathPart}/`;
  return fragment ? `${normalizedPath}#${fragment}` : normalizedPath;
}

function withCanonicalBase(pathname: string) {
  const normalizedPathname = withTrailingSlash(pathname);
  return canonicalBase ? `${canonicalBase}${normalizedPathname}` : normalizedPathname;
}

function getLocalizedPath(locale: Locale, pathSuffix = '') {
  return locale === DEFAULT_LOCALE ? pathSuffix || '/' : `/${locale}${pathSuffix}`;
}

function getLocalizedAuthorUrl(locale: Locale, pathOrUrl?: string) {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  return withCanonicalBase(getLocalizedPath(locale, pathOrUrl));
}

function getLocalizedOpenGraphImage(locale: Locale) {
  const image = '/og-vhc.jpg';
  return `${canonicalBase || ''}${image}`;
}

function parseLocaleBodies(body: string) {
  const markerPattern = /<!--\s*locale:(en|fr|it)\s*-->/g;
  const bodies: Partial<Record<Locale, string>> = {};
  const matches = Array.from(body.matchAll(markerPattern));

  if (!matches.length) {
    return { [DEFAULT_LOCALE]: body } satisfies Partial<Record<Locale, string>>;
  }

  // Text before the first marker belongs to the default locale, so a file can
  // start with its French body without an explicit `<!-- locale:fr -->`.
  const leading = body.slice(0, matches[0].index).trim();
  if (leading) {
    bodies[DEFAULT_LOCALE] = leading;
  }

  matches.forEach((match, index) => {
    const locale = match[1];
    const start = (match.index || 0) + match[0].length;
    const end = matches[index + 1]?.index ?? body.length;
    if (locale === 'en' || locale === 'fr') {
      bodies[locale] = body.slice(start, end).trim();
    }
  });

  return bodies;
}

function parseBlogMarkdown(fileContent: string) {
  const normalized = fileContent.replace(/\r\n/g, '\n');

  if (!normalized.startsWith('---\n')) {
    throw new Error('Blog markdown file is missing JSON frontmatter.');
  }

  const frontmatterEnd = normalized.indexOf('\n---\n', 4);
  if (frontmatterEnd === -1) {
    throw new Error('Blog markdown file has an unterminated JSON frontmatter block.');
  }

  const frontmatterRaw = normalized.slice(4, frontmatterEnd);
  const body = normalized.slice(frontmatterEnd + 5).trim();

  return {
    frontmatter: JSON.parse(frontmatterRaw) as BlogMarkdownFrontmatter,
    bodies: parseLocaleBodies(body),
  };
}

function mergeLocalizedFrontmatter(
  frontmatter: BlogMarkdownFrontmatter,
  locale: Locale
): BlogFrontmatter {
  const { locales, ...base } = frontmatter;
  const localized = locales?.[locale];

  if (!localized || locale === DEFAULT_LOCALE) {
    return base;
  }

  return {
    ...base,
    ...localized,
    slug: base.slug,
    publishedAt: base.publishedAt,
    updatedAt: base.updatedAt,
    relatedSlugs: base.relatedSlugs,
    cta: {
      ...base.cta,
      ...localized.cta,
    },
  };
}

function createLocalizedPost(
  frontmatter: BlogMarkdownFrontmatter,
  bodies: Partial<Record<Locale, string>>,
  locale: Locale
) {
  const localizedFrontmatter = mergeLocalizedFrontmatter(frontmatter, locale);
  const body = bodies[locale] || bodies[DEFAULT_LOCALE] || '';

  return {
    ...localizedFrontmatter,
    author: {
      ...DEFAULT_BLOG_AUTHORS[locale],
      ...localizedFrontmatter.author,
    },
    body,
    headings: extractMarkdownHeadings(body),
  } satisfies BlogPost;
}

export function loadLocalizedPostsFromDirectory(directory: string) {
  const filenames = fs.readdirSync(directory).filter((filename) => filename.endsWith('.md'));

  return filenames
    .map((filename) => {
      const raw = fs.readFileSync(path.join(directory, filename), 'utf8');
      const { frontmatter, bodies } = parseBlogMarkdown(raw);

      return Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          locale,
          createLocalizedPost(frontmatter, bodies, locale),
        ])
      ) as Record<Locale, BlogPost>;
    })
    .sort((a, b) => b.en.publishedAt.localeCompare(a.en.publishedAt));
}

function loadBlogPosts() {
  return loadLocalizedPostsFromDirectory(BLOGS_DIRECTORY);
}

const BLOG_POSTS_BY_LOCALE = loadBlogPosts();

export function getBlogUi(locale: Locale) {
  return blogUi[locale];
}

export function getAllBlogPosts(locale: Locale = DEFAULT_LOCALE) {
  return BLOG_POSTS_BY_LOCALE.map((post) => post[locale]);
}

export function getBlogPost(slug: string, locale: Locale = DEFAULT_LOCALE) {
  return getAllBlogPosts(locale).find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(post: BlogPost, locale: Locale = DEFAULT_LOCALE) {
  return post.relatedSlugs
    .map((slug) => getBlogPost(slug, locale))
    .filter((candidate): candidate is BlogPost => Boolean(candidate));
}

export function getBlogIndexPath(locale: Locale) {
  return getLocalizedPath(locale, '/blog');
}

export function getBlogPostPath(locale: Locale, slug: string) {
  return getLocalizedPath(locale, `/blog/${slug}`);
}

export function formatBlogDate(locale: Locale, date: string) {
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    fr: 'fr-FR',
  };

  return new Intl.DateTimeFormat(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function buildBlogIndexMetadata(locale: Locale): Metadata {
  const ui = getBlogUi(locale);
  const brandName = getSiteContent(locale).header.brand.name;
  const keywords = Array.from(new Set(getAllBlogPosts(locale).flatMap((post) => post.keywords)));
  const canonical = withCanonicalBase(getBlogIndexPath(locale));

  return {
    title: BLOG_INDEX_TITLES[locale],
    description: ui.description,
    keywords,
    applicationName: brandName,
    metadataBase: canonicalBase ? new URL(canonicalBase) : undefined,
    alternates: {
      canonical,
      languages: buildLanguageAlternates('/blog'),
    },
    robots: defaultRobots,
    category: 'business',
    creator: brandName,
    publisher: brandName,
    openGraph: {
      title: `${ui.title} | ${brandName}`,
      description: ui.description,
      type: 'website',
      url: canonical,
      siteName: brandName,
      locale: getOpenGraphLocale(locale),
      images: [
        {
          url: getLocalizedOpenGraphImage(locale),
          width: 1200,
          height: 630,
          alt: `${brandName} blog`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ui.title} | ${brandName}`,
      description: ui.description,
      images: [getLocalizedOpenGraphImage(locale)],
    },
  };
}

export function buildBlogPostMetadata(locale: Locale, post: BlogPost): Metadata {
  const brandName = getSiteContent(locale).header.brand.name;
  const canonical = withCanonicalBase(getBlogPostPath(locale, post.slug));

  return {
    title: `${post.seoTitle} | ${brandName}`,
    description: post.description,
    keywords: post.keywords,
    applicationName: brandName,
    metadataBase: canonicalBase ? new URL(canonicalBase) : undefined,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(`/blog/${post.slug}`),
    },
    robots: defaultRobots,
    category: 'business',
    creator: post.author.name,
    publisher: brandName,
    openGraph: {
      title: `${post.seoTitle} | ${brandName}`,
      description: post.description,
      type: 'article',
      url: canonical,
      siteName: brandName,
      locale: getOpenGraphLocale(locale),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [
        {
          url: getLocalizedOpenGraphImage(locale),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.seoTitle} | ${brandName}`,
      description: post.description,
      images: [getLocalizedOpenGraphImage(locale)],
    },
  };
}

export function buildBlogIndexStructuredData(locale: Locale) {
  const items = getAllBlogPosts(locale).map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: withCanonicalBase(getBlogPostPath(locale, post.slug)),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: post.keywords.join(', '),
    author: {
      '@type': 'Person',
      name: post.author.name,
      description: post.author.role,
      url: getLocalizedAuthorUrl(locale, post.author.profileHref),
    },
    publisher: {
      '@id': `${canonicalBase || ''}/#organization`,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${getSiteContent(locale).header.brand.name} | Blog`,
    description: getBlogUi(locale).description,
    url: withCanonicalBase(getBlogIndexPath(locale)),
    blogPost: items,
  };
}

export function buildBlogPostStructuredData(locale: Locale, post: BlogPost) {
  const articleUrl = withCanonicalBase(getBlogPostPath(locale, post.slug));
  const authorUrl = getLocalizedAuthorUrl(locale, post.author.profileHref);

  const article = {
    ...articleSchema({
      title: post.title,
      description: post.description,
      slug: post.slug,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authorName: post.author.name,
      canonicalBase: canonicalBase || '',
    }),
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    keywords: post.keywords.join(', '),
    articleSection: post.category,
    author: {
      '@type': 'Person',
      name: post.author.name,
      description: post.author.role,
      url: authorUrl,
    },
    publisher: {
      '@id': `${canonicalBase || ''}/#organization`,
    },
    image: [getLocalizedOpenGraphImage(locale)],
  };

  const breadcrumb = breadcrumbSchema([
    { name: getBlogUi(locale).homeLabel, url: withCanonicalBase(getLocalizedPath(locale)) },
    { name: getBlogUi(locale).badge, url: withCanonicalBase(getBlogIndexPath(locale)) },
    { name: post.title, url: articleUrl },
  ]);

  const faq = post.faq.length > 0 ? faqSchema(post.faq) : null;

  return [article, breadcrumb, faq].filter(Boolean);
}

/** The few most recent posts, shaped for the home page teaser. */
export function getLatestInsights(locale: Locale, count = 3) {
  return getAllBlogPosts(locale)
    .slice(0, count)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      readingTime: post.readingTime,
      dateLabel: formatBlogDate(locale, post.publishedAt),
      href: withTrailingSlash(getBlogPostPath(locale, post.slug)),
    }));
}
