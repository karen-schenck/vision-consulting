'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import { SiteShell } from '@/components/shared/site-shell';
import { BlogMarkdown } from '@/components/blog/blog-markdown';
import type { BlogPost, BlogUi } from '@/lib/blog';
import { localizePath, type Locale } from '@/lib/i18n';

function getAuthorBadge(name: string, avatarLabel?: string) {
  if (avatarLabel) {
    return avatarLabel;
  }

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getAuthorProfileHref(locale: Locale, pathOrUrl: string) {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  return localizePath(pathOrUrl, locale);
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progressValue = scrollHeight > 0 ? (scrollPosition / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, progressValue)));
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed left-0 right-0 top-[4.5rem] z-40 h-1 bg-border/50">
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function BlogPostContent({
  locale,
  post,
  ui,
  relatedPosts,
  structuredData: _structuredData,
  blogIndexPath,
  relatedPostPaths,
  publishedAtLabel,
  updatedAtLabel,
}: {
  locale: Locale;
  post: BlogPost;
  ui: BlogUi;
  relatedPosts: Array<BlogPost & { publishedAtLabel: string }>;
  structuredData: unknown[];
  blogIndexPath: string;
  relatedPostPaths: Record<string, string>;
  publishedAtLabel: string;
  updatedAtLabel: string;
}) {
  const [activeHeading, setActiveHeading] = useState<string>('');
  const hasMermaidChart = /^```mermaid\s*$/im.test(post.body);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px', threshold: 0 }
    );

    post.headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [post.headings]);

  useEffect(() => {
    if (!hasMermaidChart) {
      return;
    }

    void import('mermaid');
  }, [hasMermaidChart]);

  return (
    <SiteShell>
      <ReadingProgress />

      <article className="site-container py-10 lg:py-14">
        <div className="w-full">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-foreground">{ui.homeLabel}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={blogIndexPath} className="transition-colors hover:text-foreground">{ui.badge}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground line-clamp-1">{post.title}</span>
          </nav>

            <div className="grid gap-12 lg:grid-cols-[minmax(0,48rem)_280px] lg:justify-center xl:gap-16">
              {/* Main Content */}
              <div className="min-w-0">
                {/* Article Header */}
                <header className="mb-12">
                  {/* Category & Meta */}
                  <div className="mb-6 flex flex-wrap items-center gap-4">
                    <span className="rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                      {post.category}
                    </span>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {publishedAtLabel}
                      </span>
                      {post.updatedAt !== post.publishedAt && (
                        <span className="flex items-center gap-1.5">
                          {ui.updatedLabel}: {updatedAtLabel}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {post.readingTime}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="mb-6 font-display text-3xl leading-tight text-heading sm:text-4xl lg:text-5xl">
                    {post.title}
                  </h1>

                  {/* Description */}
                  <p className="mb-8 text-lg leading-relaxed text-muted-foreground lg:text-xl">
                    {post.description}
                  </p>

                  {/* Author Card */}
                  <div className="flex flex-wrap items-center gap-6 rounded-sm bg-panel p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-panel-strong text-lg font-semibold text-heading">
                        {getAuthorBadge(post.author.name, post.author.avatarLabel)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{post.author.name}</p>
                          {post.author.profileHref && (
                            <Link
                              href={getAuthorProfileHref(locale, post.author.profileHref)}
                              className="text-primary transition-colors hover:text-primary/80"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{post.author.role}</p>
                      </div>
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                      {post.author.bio}
                    </p>
                  </div>
                </header>

                {/* Key Takeaways - Mobile */}
                <section className="mb-10 rounded-sm bg-panel-strong p-6 lg:hidden">
                  <div className="mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                      {ui.takeawaysLabel}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {post.keyTakeaways.map((item, index) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-shell text-xs font-semibold text-heading">
                          {index + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Intro */}
                <section className="mb-10 rounded-sm bg-panel p-6 lg:p-8">
                  <p className="text-base leading-8 text-muted-foreground lg:text-lg lg:leading-8">
                    {post.intro}
                  </p>
                </section>

                {/* Article Body */}
                <BlogMarkdown markdown={post.body} />

                {/* Key Takeaways - Bottom */}
                <section className="mt-12 rounded-sm bg-panel-strong p-6 lg:p-8">
                  <div className="mb-6 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">
                      {ui.takeawaysLabel}
                    </h2>
                  </div>
                  <ul className="space-y-4">
                    {post.keyTakeaways.map((item, index) => (
                      <li key={item} className="flex gap-4">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-shell text-sm font-semibold text-heading">
                          {index + 1}
                        </span>
                        <p className="text-base leading-relaxed text-foreground">{item}</p>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* FAQ Section */}
                {post.faq.length > 0 && (
                  <section className="mt-12">
                    <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
                      {ui.faqLabel}
                    </h2>
                    <div className="space-y-4">
                      {post.faq.map((item) => (
                        <details
                          key={item.question}
                          className="group overflow-hidden rounded-sm bg-panel"
                        >
                          <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-lg font-medium text-foreground">
                            <span>{item.question}</span>
                            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                          </summary>
                          <div className="border-t border-border px-5 pb-5 pt-4">
                            <p className="leading-relaxed text-muted-foreground">{item.answer}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                {/* CTA Section */}
                <section className="mt-12 rounded-sm bg-panel-strong p-6 lg:p-8">
                  <h2 className="mb-3 text-2xl font-semibold tracking-tight text-foreground">
                    {post.cta.title}
                  </h2>
                  <p className="mb-6 leading-relaxed text-muted-foreground">
                    {post.cta.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={localizePath(post.cta.primaryHref, locale)}
                      className="btn btn-primary px-5 py-3"
                    >
                      <span>{post.cta.primaryLabel}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href={localizePath(post.cta.secondaryHref, locale)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline px-5 py-3"
                    >
                      <span>{post.cta.secondaryLabel}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </section>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <section className="mt-16">
                    <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
                      {ui.relatedPostsLabel}
                    </h2>
                    <div className="grid gap-5 md:grid-cols-2">
                      {relatedPosts.map((relatedPost) => (
                        <article
                          key={relatedPost.slug}
                          className="group flex flex-col rounded-sm bg-panel p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-32px_rgba(15,27,51,0.65)]"
                        >
                          <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
                              {relatedPost.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {relatedPost.readingTime}
                            </span>
                          </div>
                          <h3 className="mb-3 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                            {relatedPost.title}
                          </h3>
                          <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                          <Link
                            href={relatedPostPaths[relatedPost.slug]}
                            className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3"
                          >
                            <span>{ui.readArticleLabel}</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar - Desktop */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  {/* Author Card */}
                  <div className="rounded-sm bg-panel p-5">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {ui.authorLabel}
                    </h3>
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-panel-strong text-sm font-semibold text-heading">
                        {getAuthorBadge(post.author.name, post.author.avatarLabel)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{post.author.name}</p>
                        <p className="text-sm text-muted-foreground">{post.author.role}</p>
                        {post.author.profileHref && (
                          <Link
                            href={getAuthorProfileHref(locale, post.author.profileHref)}
                            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                          >
                            <span>{ui.authorLabel}</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Table of Contents */}
                  <div className="rounded-sm bg-panel p-5">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {ui.tocLabel}
                    </h3>
                    <nav className="space-y-1">
                      {post.headings.map((section) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className={`block px-3 py-2 text-sm transition-colors ${
                            section.level === 3 ? 'pl-6 text-muted-foreground' : 'font-medium'
                          } ${
                            activeHeading === section.id
                              ? 'border border-accent/40 text-accent'
                              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                          }`}
                        >
                          {section.title}
                        </a>
                      ))}
                    </nav>
                  </div>

                  {/* Key Takeaways */}
                  <div className="rounded-sm bg-panel-strong p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {ui.takeawaysLabel}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {post.keyTakeaways.map((item, index) => (
                        <li key={item} className="flex gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-shell text-xs font-semibold text-heading">
                            {index + 1}
                          </span>
                          <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Back to Blog */}
                  <Link
                    href={blogIndexPath}
                    className="btn btn-outline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{ui.backToBlogLabel}</span>
                  </Link>
                </div>
              </aside>
            </div>
        </div>
      </article>

    </SiteShell>
  );
}
