'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Calendar, ChevronDown } from 'lucide-react';

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

function getAuthorBadge(author: BlogCard['author']) {
  if (author.avatarLabel) {
    return author.avatarLabel;
  }

  return author.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function BlogPostGrid({
  posts,
  readArticleLabel,
  loadMoreLabel,
}: {
  posts: BlogCard[];
  readArticleLabel: string;
  loadMoreLabel: string;
}) {
  const [visibleCount, setVisibleCount] = useState(6);
  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visiblePosts.map((post) => (
          <article
            key={post.slug}
            className="group relative flex flex-col overflow-hidden rounded-sm bg-panel transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-32px_rgba(15,27,51,0.65)]"
          >
            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="flex flex-1 flex-col p-6">
              {/* Meta row */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-shell px-3 py-1 text-xs font-medium text-accent">
                  {post.category}
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.publishedAtLabel}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="mb-3 font-display text-lg leading-snug text-heading transition-colors group-hover:text-accent">
                <Link href={post.href} className="after:absolute after:inset-0">
                  {post.title}
                </Link>
              </h3>

              {/* Excerpt */}
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>

              {/* Footer */}
              <div className="mt-auto flex flex-col items-start gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-shell text-xs font-semibold text-heading">
                    {getAuthorBadge(post.author)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{post.author.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-sm font-medium text-accent transition-all group-hover:gap-2">
                  {readArticleLabel}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + 6)}
            className="btn btn-outline"
          >
            <span>{loadMoreLabel}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
