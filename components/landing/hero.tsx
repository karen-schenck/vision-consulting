"use client"

import Link from "next/link"
import { ArrowRight, CalendarDays } from "lucide-react"
import { useLandingContent } from "@/components/providers/landing-content-provider"
import { FlowLines } from "@/components/brand/vhc-mark"
import { Parallax } from "@/components/shared/parallax"
import { localizePath } from "@/lib/i18n"
import { assetPath } from "@/lib/asset-path"

/**
 * Ink-navy opening band. The promise is the H1; the sub-line says who, what
 * and the outcome; the gold action books the discovery call directly. The
 * brand façade photograph sits in a gold-offset frame, and the flowing lines
 * draw themselves in behind the copy. Copy never sits under a live transform.
 */
export function Hero() {
  const { content, locale } = useLandingContent()
  const { hero } = content.home

  return (
    <section id="accueil" className="band-ink relative overflow-hidden">
      <Parallax speed={0.06} className="pointer-events-none absolute inset-0">
        <FlowLines className="absolute -left-10 -top-6 h-[110%] max-h-[60rem] w-auto text-gold opacity-60" lines={13} />
      </Parallax>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(197,166,73,0.12),transparent_55%)]"
      />

      <div className="site-container relative grid items-center gap-14 py-16 lg:min-h-[min(calc(100svh-4.5rem),54rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-20">
        <div>
          <p className="section-eyebrow mb-7 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700">
            {hero.eyebrow}
          </p>

          <h1
            className="display-title max-w-[14ch] text-[clamp(2.9rem,1.6rem+4.6vw,5.6rem)] text-primary-foreground animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700"
            style={{ animationDelay: "120ms" }}
          >
            {hero.title.split(". ").map((part, index, parts) => (
              <span key={part} className={index === parts.length - 1 ? "block italic text-gold" : "block"}>
                {index < parts.length - 1 ? `${part}.` : part}
              </span>
            ))}
          </h1>

          <p
            className="mt-8 max-w-[38rem] text-base leading-relaxed text-primary-foreground/75 md:text-lg animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700"
            style={{ animationDelay: "220ms" }}
          >
            {hero.subtitle}
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700"
            style={{ animationDelay: "320ms" }}
          >
            <a href={content.common.calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              <CalendarDays aria-hidden="true" className="h-4 w-4" />
              {hero.primaryCtaLabel}
            </a>
            <Link href={localizePath(hero.secondaryCtaHref, locale)} prefetch={false} className="btn btn-ghost-light">
              {hero.secondaryCtaLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <dl
            className="mt-14 grid max-w-[36rem] grid-cols-3 gap-6 border-t border-gold/25 pt-8 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700"
            style={{ animationDelay: "420ms" }}
          >
            {hero.trust.map((item) => (
              <div key={item.value}>
                <dt className="display-title text-[clamp(1.4rem,1.1rem+1vw,2rem)] text-gold">{item.value}</dt>
                <dd className="mt-1 text-[12px] uppercase tracking-[0.14em] text-primary-foreground/60">
                  {item.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          className="relative mx-auto w-full max-w-[40rem] animate-in fade-in fill-mode-both duration-1000"
          style={{ animationDelay: "200ms" }}
        >
          <div aria-hidden="true" className="absolute -bottom-4 -right-4 h-full w-full border border-gold/60" />
          <img
            src={assetPath(hero.imageSrc)}
            alt={hero.imageAlt}
            width={1800}
            height={842}
            fetchPriority="high"
            decoding="async"
            className="relative aspect-[4/5] w-full rounded-sm object-cover object-[28%_50%] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] sm:aspect-[5/4] lg:aspect-[4/5]"
          />
        </div>
      </div>
    </section>
  )
}
