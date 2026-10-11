"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { FlowLines } from "@/components/brand/vhc-mark"
import { useLandingContent } from "@/components/providers/landing-content-provider"
import { localizePath } from "@/lib/i18n"
import { assetPath } from "@/lib/asset-path"

type Crumb = { label: string; href?: string }

/**
 * Opening band of every inner route: ink navy, gold eyebrow, the flowing
 * lines bleeding off the right edge, and an optional photograph. Continues
 * the header's navy so each page opens on the same block as the home hero.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  imageSrc,
  imageAlt,
  children,
}: {
  eyebrow: string
  title: string
  intro?: string
  breadcrumbs?: Crumb[]
  imageSrc?: string
  imageAlt?: string
  children?: React.ReactNode
}) {
  const { content, locale } = useLandingContent()
  const crumbs: Crumb[] = [{ label: content.common.homeLabel, href: "/" }, ...(breadcrumbs ?? [])]

  return (
    <section className="band-ink relative overflow-hidden">
      <FlowLines className="absolute -right-24 top-0 h-[150%] w-auto text-gold opacity-40 lg:-right-10" />

      <div className="site-container relative py-14 lg:py-20">
        <div className={imageSrc ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16" : ""}>
          <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700">
            {breadcrumbs ? (
              <nav aria-label="Breadcrumb" className="mb-8">
                <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-primary-foreground/55">
                  {crumbs.map((crumb, index) => (
                    <li key={crumb.label} className="flex items-center gap-1.5">
                      {index > 0 ? <ChevronRight aria-hidden="true" className="h-3 w-3" /> : null}
                      {crumb.href ? (
                        <Link
                          href={localizePath(crumb.href, locale)}
                          prefetch={false}
                          className="transition-colors hover:text-gold"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span aria-current="page" className="text-primary-foreground/80">
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}
            <p className="section-eyebrow mb-6">{eyebrow}</p>
            <h1 className="display-title max-w-[22ch] text-[clamp(2.4rem,1.6rem+3vw,4.25rem)] text-primary-foreground">
              {title}
            </h1>
            {intro ? (
              <p className="mt-7 max-w-[60ch] text-base leading-relaxed text-primary-foreground/75 md:text-lg">
                {intro}
              </p>
            ) : null}
            {children}
          </div>

          {imageSrc ? (
            <div className="relative animate-in fade-in fill-mode-both duration-1000" style={{ animationDelay: "150ms" }}>
              <div aria-hidden="true" className="absolute -bottom-3 -left-3 h-full w-full border border-gold/50" />
              <img
                src={assetPath(imageSrc)}
                alt={imageAlt ?? ""}
                width={1400}
                height={933}
                fetchPriority="high"
                decoding="async"
                className="relative aspect-[4/3] w-full rounded-sm object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
