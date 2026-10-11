import { BlogIndexContent } from '@/components/blog/blog-index-content';
import { DefaultLocaleContentProvider } from '@/components/default-locale-content-provider';
import {
  buildBlogIndexMetadata,
  buildBlogIndexStructuredData,
  formatBlogDate,
  getAllBlogPosts,
  getBlogPostPath,
  getBlogUi,
} from '@/lib/blog';
import { DEFAULT_LOCALE } from '@/lib/i18n';

export const dynamic = 'force-static';

export function generateMetadata() {
  return buildBlogIndexMetadata(DEFAULT_LOCALE);
}

export default function BlogPage() {
  const posts = getAllBlogPosts(DEFAULT_LOCALE);
  const [featuredPost, ...restPosts] = posts;
  const structuredData = buildBlogIndexStructuredData(DEFAULT_LOCALE);
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
      <DefaultLocaleContentProvider>
        <BlogIndexContent
          ui={getBlogUi(DEFAULT_LOCALE)}
          featuredPost={featuredPost}
          featuredPostHref={getBlogPostPath(DEFAULT_LOCALE, featuredPost.slug)}
          featuredPublishedAtLabel={formatBlogDate(DEFAULT_LOCALE, featuredPost.publishedAt)}
          postCount={posts.length}
          categoryCount={categoryCount}
          latestUpdatedAtLabel={formatBlogDate(DEFAULT_LOCALE, latestUpdatedPost.updatedAt)}
          postCards={restPosts.map((post) => ({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            category: post.category,
            readingTime: post.readingTime,
            keywords: post.keywords,
            publishedAtLabel: formatBlogDate(DEFAULT_LOCALE, post.publishedAt),
            href: getBlogPostPath(DEFAULT_LOCALE, post.slug),
            author: post.author,
          }))}
          structuredData={structuredData}
        />
      </DefaultLocaleContentProvider>
    </>
  );
}
