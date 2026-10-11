import { notFound } from 'next/navigation';
import { BlogPostContent } from '@/components/blog/blog-post-content';
import { LocalizedContentProvider } from '@/components/localized-content-provider';
import {
  buildBlogPostMetadata,
  buildBlogPostStructuredData,
  formatBlogDate,
  getAllBlogPosts,
  getBlogIndexPath,
  getBlogPost,
  getBlogPostPath,
  getBlogUi,
  getRelatedBlogPosts,
} from '@/lib/blog';
import { isLocale, NON_DEFAULT_LOCALES, type Locale } from '@/lib/i18n';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.flatMap((locale) =>
    getAllBlogPosts().map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const post = getBlogPost(slug, locale as Locale);
  if (!post) notFound();

  return buildBlogPostMetadata(locale as Locale, post);
}

export default async function LocaleBlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = getBlogPost(slug, locale as Locale);
  if (!post) notFound();
  const relatedPosts = getRelatedBlogPosts(post, locale as Locale);
  const structuredData = buildBlogPostStructuredData(locale as Locale, post);

  return (
    <>
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LocalizedContentProvider locale={locale as Locale}>
        <BlogPostContent
          locale={locale as Locale}
          post={post}
          ui={getBlogUi(locale as Locale)}
          relatedPosts={relatedPosts.map((relatedPost) => ({
            ...relatedPost,
            publishedAtLabel: formatBlogDate(locale as Locale, relatedPost.publishedAt),
          }))}
          structuredData={structuredData}
          blogIndexPath={getBlogIndexPath(locale as Locale)}
          relatedPostPaths={Object.fromEntries(
            relatedPosts.map((relatedPost) => [relatedPost.slug, getBlogPostPath(locale as Locale, relatedPost.slug)])
          )}
          publishedAtLabel={formatBlogDate(locale as Locale, post.publishedAt)}
          updatedAtLabel={formatBlogDate(locale as Locale, post.updatedAt)}
        />
      </LocalizedContentProvider>
    </>
  );
}
