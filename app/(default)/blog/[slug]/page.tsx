import { notFound } from 'next/navigation';
import { BlogPostContent } from '@/components/blog/blog-post-content';
import { DefaultLocaleContentProvider } from '@/components/default-locale-content-provider';
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
import { DEFAULT_LOCALE } from '@/lib/i18n';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug, DEFAULT_LOCALE);
  if (!post) notFound();

  return buildBlogPostMetadata(DEFAULT_LOCALE, post);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug, DEFAULT_LOCALE);
  if (!post) notFound();
  const relatedPosts = getRelatedBlogPosts(post, DEFAULT_LOCALE);
  const structuredData = buildBlogPostStructuredData(DEFAULT_LOCALE, post);

  return (
    <>
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <DefaultLocaleContentProvider>
        <BlogPostContent
          locale={DEFAULT_LOCALE}
          post={post}
          ui={getBlogUi(DEFAULT_LOCALE)}
          relatedPosts={relatedPosts.map((relatedPost) => ({
            ...relatedPost,
            publishedAtLabel: formatBlogDate(DEFAULT_LOCALE, relatedPost.publishedAt),
          }))}
          structuredData={structuredData}
          blogIndexPath={getBlogIndexPath(DEFAULT_LOCALE)}
          relatedPostPaths={Object.fromEntries(
            relatedPosts.map((relatedPost) => [relatedPost.slug, getBlogPostPath(DEFAULT_LOCALE, relatedPost.slug)])
          )}
          publishedAtLabel={formatBlogDate(DEFAULT_LOCALE, post.publishedAt)}
          updatedAtLabel={formatBlogDate(DEFAULT_LOCALE, post.updatedAt)}
        />
      </DefaultLocaleContentProvider>
    </>
  );
}
