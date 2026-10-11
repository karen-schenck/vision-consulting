'use client';

import Link from 'next/link';
import { SiteShell } from '@/components/shared/site-shell';
import { PageHeader } from '@/components/shared/page-header';
import { localizePath, type Locale, type SiteContent } from '@/lib/i18n';

type LegalPageContentProps = {
  locale: Locale;
  content: SiteContent;
  page: 'privacyPage' | 'termsPage';
};

export function LegalPageContent({ locale, content, page }: LegalPageContentProps) {
  const pageContent = content[page];

  return (
    <SiteShell>
      <PageHeader
        eyebrow={pageContent.badge}
        title={pageContent.title}
        intro={pageContent.intro}
      />

      <section className="site-container py-14 lg:py-20">
        <div className="mx-auto max-w-3xl rounded-[var(--radius-panel)] bg-panel p-6 sm:p-10 lg:p-12">
          <div className="mb-9 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
            <span>
              {pageContent.lastUpdatedLabel}: {pageContent.lastUpdatedDate}
            </span>
            <Link
              href={localizePath('/', locale)}
              className="text-heading transition-opacity hover:opacity-70"
            >
              {pageContent.backToHomepageLabel}
            </Link>
          </div>

          {page === 'termsPage' ? (
            <div className="space-y-9">
              {content.termsPage.sections.map((section) => (
                <section key={section.title} className="space-y-3">
                  <h2 className="font-display text-xl text-heading sm:text-2xl">{section.title}</h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-7 text-foreground/75 md:text-base">
                      {paragraph}
                    </p>
                  ))}
                  {'bullets' in section && Array.isArray(section.bullets) ? (
                    <ul className="list-disc space-y-2 pl-6 text-sm leading-7 text-foreground/75 md:text-base">
                      {(section.bullets as string[]).map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          ) : (
            <div className="space-y-9">
              {Object.values(content.privacyPage.sections).map((section) => (
                <section key={section.title} className="space-y-3">
                  <h2 className="font-display text-xl text-heading sm:text-2xl">{section.title}</h2>
                  {'intro' in section && section.intro ? (
                    <p className="text-sm leading-7 text-foreground/75 md:text-base">{section.intro}</p>
                  ) : null}
                  {'bullets' in section && Array.isArray(section.bullets) ? (
                    <ul className="list-disc space-y-2 pl-6 text-sm leading-7 text-foreground/75 md:text-base">
                      {(section.bullets as Array<string | { label: string; text: string }>).map((bullet) =>
                        typeof bullet === 'string' ? (
                          <li key={bullet}>{bullet}</li>
                        ) : (
                          <li key={`${bullet.label}-${bullet.text}`}>
                            <strong className="text-foreground">{bullet.label}</strong> {bullet.text}
                          </li>
                        )
                      )}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
