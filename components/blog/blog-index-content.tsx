'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Calendar, Tag, ChevronRight, Sparkles } from 'lucide-react';
import { SiteShell } from '@/components/shared/site-shell';
import { BlogPostGrid } from '@/components/blog/blog-post-grid';
import type { BlogPost, BlogUi } from '@/lib/blog';

type BlogCard = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  keywords: string[];
  publishedAtLabel: string;
  href: string;
  author: {
    name: string;
    role: string;
    avatarLabel?: string;
  };
};

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

export function BlogIndexContent({
  ui,
  featuredPost,
  featuredPostHref,
  featuredPublishedAtLabel,
  postCards,
  structuredData: _structuredData,
  postCount,
  categoryCount,
  latestUpdatedAtLabel,
}: {
  ui: BlogUi;
  featuredPost: BlogPost;
  featuredPostHref: string;
  featuredPublishedAtLabel: string;
  postCards: BlogCard[];
  structuredData: unknown;
  postCount: number;
  categoryCount: number;
  latestUpdatedAtLabel: string;
}) {
  const archiveStats = [
    { label: ui.allPostsLabel, value: String(postCount).padStart(2, '0'), icon: Sparkles },
    { label: ui.topicsLabel, value: String(categoryCount).padStart(2, '0'), icon: Tag },
    { label: ui.updatedLabel, value: latestUpdatedAtLabel, icon: Calendar },
  ];

  return (
    <SiteShell>

      {/* Hero Section */}
      <section className="site-container pt-10 lg:pt-14">
        <div className="w-full">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-foreground">{ui.homeLabel}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{ui.badge}</span>
          </nav>

          {/* Page Header */}
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              {ui.badge}
            </p>

            <h1 className="font-display text-4xl leading-tight text-heading sm:text-5xl lg:text-6xl">
              {ui.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground lg:text-xl">
              {ui.description}
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-6 border-t border-border pt-8 lg:gap-12">
            {archiveStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-panel">
                  <stat.icon className="h-4 w-4 text-heading" />
                </div>
                <div>
                  <div className="text-xl font-semibold text-foreground">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="site-container py-14 lg:py-20">
        <div className="w-full">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-widest text-accent">
              {ui.featuredLabel}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <article className="group relative overflow-hidden rounded-[var(--radius-panel)] bg-panel">
            <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
              {/* Content Side */}
              <div className="flex flex-col justify-between p-8 lg:p-12">
                <div>
                  {/* Meta */}
                  <div className="mb-6 flex flex-wrap items-center gap-4">
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      {featuredPost.category}
                    </span>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {featuredPublishedAtLabel}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {featuredPost.readingTime}
                      </span>
                    </div>
                  </div>

                  {/* Title & Excerpt */}
                  <h2 className="mb-4 font-display text-3xl leading-tight text-heading lg:text-4xl">
                    {featuredPost.title}
                  </h2>
                  <p className="mb-8 text-base leading-relaxed text-muted-foreground lg:text-lg">
                    {featuredPost.excerpt}
                  </p>

                  {/* Keywords */}
                  <div className="mb-8 flex flex-wrap gap-2">
                    {featuredPost.keywords.slice(0, 4).map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-shell px-3 py-1 text-xs text-muted-foreground"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Author & CTA */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-panel-strong text-sm font-semibold text-heading">
                      {getAuthorBadge(featuredPost.author.name, featuredPost.author.avatarLabel)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{featuredPost.author.name}</p>
                      <p className="text-xs text-muted-foreground">{featuredPost.author.role}</p>
                    </div>
                  </div>

                  <Link
                    href={featuredPostHref}
                    className="btn btn-primary px-5 py-3"
                  >
                    <span>{ui.readArticleLabel}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Key Takeaways Side */}
              <div className="bg-panel-strong p-8 lg:p-12">
                <div className="mb-6 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-medium uppercase tracking-wider text-accent">
                    {ui.takeawaysLabel}
                  </h3>
                </div>
                <ul className="space-y-4">
                  {featuredPost.keyTakeaways.map((item, index) => (
                    <li key={item} className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-shell text-xs font-semibold text-heading">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* All Articles Grid */}
      <section className="site-container pb-14 lg:pb-20">
        <div className="w-full">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {ui.allPostsLabel}
              </span>
              <h2 className="mt-2 font-display text-2xl text-heading lg:text-3xl">
                {ui.archiveHeadline}
              </h2>
            </div>
          </div>

          <BlogPostGrid
            posts={postCards}
            readArticleLabel={ui.readArticleLabel}
            loadMoreLabel={ui.loadMoreLabel}
          />
        </div>
      </section>

    </SiteShell>
  );
}
