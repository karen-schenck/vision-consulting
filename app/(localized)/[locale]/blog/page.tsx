import { notFound } from 'next/navigation';
import { BlogIndexContent } from '@/components/blog/blog-index-content';
import { LocalizedContentProvider } from '@/components/localized-content-provider';
import {
  buildBlogIndexMetadata,
  buildBlogIndexStructuredData,
  formatBlogDate,
  getAllBlogPosts,
  getBlogPostPath,
  getBlogUi,
} from '@/lib/blog';
import { isLocale, NON_DEFAULT_LOCALES } from '@/lib/i18n';

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
  return buildBlogIndexMetadata(locale);
}

export default async function LocaleBlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const posts = getAllBlogPosts(locale);
  const [featuredPost, ...restPosts] = posts;
  const structuredData = buildBlogIndexStructuredData(locale);
  const categoryCount = new Set(posts.map((post) => post.category)).size;
  const latestUpdatedPost = posts.reduce((latest, post) =>
    post.updatedAt > latest.updatedAt ? post : latest
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LocalizedContentProvider locale={locale}>
        <BlogIndexContent
          ui={getBlogUi(locale)}
          featuredPost={featuredPost}
          featuredPostHref={getBlogPostPath(locale, featuredPost.slug)}
          featuredPublishedAtLabel={formatBlogDate(locale, featuredPost.publishedAt)}
          postCount={posts.length}
          categoryCount={categoryCount}
          latestUpdatedAtLabel={formatBlogDate(locale, latestUpdatedPost.updatedAt)}
          postCards={restPosts.map((post) => ({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            category: post.category,
            readingTime: post.readingTime,
            keywords: post.keywords,
            publishedAtLabel: formatBlogDate(locale, post.publishedAt),
            href: getBlogPostPath(locale, post.slug),
            author: post.author,
          }))}
          structuredData={structuredData}
        />
      </LocalizedContentProvider>
    </>
  );
}
