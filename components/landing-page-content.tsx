"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteShell } from "@/components/shared/site-shell"
import { Hero } from "@/components/landing/hero"
import { BookingCta } from "@/components/landing/booking-cta"
import { Reveal } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/sections/section-heading"
import { ContentIcon } from "@/components/sections/icon"
import { OdcSteps } from "@/components/sections/odc-steps"
import { OfferTiers } from "@/components/sections/offer-tiers"
import { FiguresBand } from "@/components/sections/figures-band"
import { FaqList } from "@/components/sections/faq-list"
import { Diamond, FlowLines } from "@/components/brand/vhc-mark"
import { useLandingContent } from "@/components/providers/landing-content-provider"
import { localizePath } from "@/lib/i18n"
import { assetPath } from "@/lib/asset-path"

export type InsightCard = {
  slug: string
  title: string
  excerpt: string
  category: string
  readingTime: string
  dateLabel: string
  href: string
}

/**
 * Home page, in the order a decision-maker reads it: promise → "is this my
 * problem?" → what you do → how you do it → how to buy it → proof → who →
 * objections → depth → act.
 */
export function LandingPageContent({ latestPosts = [] }: { latestPosts?: InsightCard[] }) {
  const { content, locale } = useLandingContent()
  const { home, methodPage, common } = content

  return (
    <SiteShell>
      <Hero />

      {/* ── Hook: the symptoms ─────────────────────────────────────────── */}
      <section className="site-container py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow={home.symptoms.eyebrow}
              title={home.symptoms.title}
              description={home.symptoms.description}
            />
          </div>
          <div>
            <ul className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">
              {home.symptoms.items.map((item, index) => (
                <Reveal as="li" key={item.title} delay={index * 80} className="bg-card p-7 lg:p-8">
                  <ContentIcon name={item.icon} className="mb-5 h-7 w-7 text-accent" />
                  <h3 className="mb-2 font-display text-[1.45rem] font-semibold leading-tight text-heading">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-foreground/70">{item.text}</p>
                </Reveal>
              ))}
            </ul>
            <Reveal className="mt-8 flex items-start gap-4 border-l-2 border-gold pl-6">
              <p className="font-display text-[1.4rem] italic leading-snug text-heading">
                {home.symptoms.conclusion}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Two expertises ─────────────────────────────────────────────── */}
      <section className="bg-panel py-20 lg:py-28">
        <div className="site-container">
          <SectionHeading eyebrow={home.expertises.eyebrow} title={home.expertises.title} />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {home.expertises.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 100}>
                <Link
                  href={localizePath(item.href, locale)}
                  prefetch={false}
                  className="group flex h-full flex-col overflow-hidden rounded-sm bg-card shadow-[0_30px_60px_-45px_rgba(15,27,51,0.5)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={assetPath(item.imageSrc)}
                      alt={item.imageAlt}
                      width={1400}
                      height={788}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent" />
                    <h3 className="display-title absolute bottom-6 left-8 text-[2.6rem] text-primary-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex flex-1 flex-col p-8 lg:p-10">
                    <p className="text-[17px] leading-relaxed text-foreground/80">{item.text}</p>
                    <ul className="mt-6 flex-1 space-y-2.5">
                      {item.points.map((point) => (
                        <li key={point} className="flex items-center gap-3 text-[15px] font-semibold text-heading">
                          <Diamond className="h-1.5 w-1.5" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-8 inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em] text-accent">
                      {item.ctaLabel}
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ODC method ─────────────────────────────────────────────────── */}
      <section className="site-container py-20 lg:py-28">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow={home.method.eyebrow} title={home.method.title} description={home.method.description} />
          <Reveal>
            <Link href={localizePath(home.method.ctaHref, locale)} prefetch={false} className="btn btn-outline shrink-0">
              {home.method.ctaLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-16">
          <OdcSteps steps={methodPage.steps} stepLabel={common.stepLabel} />
        </div>
      </section>

      {/* ── Offers ─────────────────────────────────────────────────────── */}
      <section className="bg-panel py-20 lg:py-28">
        <div className="site-container">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading eyebrow={home.offers.eyebrow} title={home.offers.title} description={home.offers.description} />
            <Reveal>
              <Link href={localizePath(home.offers.ctaHref, locale)} prefetch={false} className="btn btn-outline shrink-0">
                {home.offers.ctaLabel}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14">
            <OfferTiers />
          </div>
        </div>
      </section>

      {/* ── Figures ────────────────────────────────────────────────────── */}
      <FiguresBand />

      {/* ── Why us ─────────────────────────────────────────────────────── */}
      <section className="site-container py-20 lg:py-28">
        <SectionHeading eyebrow={home.whyUs.eyebrow} title={home.whyUs.title} align="center" />
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {home.whyUs.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 90} className="text-center">
              <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/60">
                <ContentIcon name={item.icon} className="h-7 w-7 text-accent" />
              </span>
              <h3 className="display-title mb-3 text-[1.75rem] text-heading">{item.title}</h3>
              <p className="mx-auto max-w-[30ch] leading-relaxed text-foreground/70">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Sectors ────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card py-20 lg:py-28">
        <div className="site-container">
          <SectionHeading eyebrow={home.sectors.eyebrow} title={home.sectors.title} />
          <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {home.sectors.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} className="bg-card">
                <Link
                  href={localizePath(item.href, locale)}
                  prefetch={false}
                  className="group flex h-full flex-col p-8 transition-colors hover:bg-panel"
                >
                  <ContentIcon name={item.icon} className="mb-8 h-8 w-8 text-accent" />
                  <h3 className="mb-3 font-display text-[1.5rem] font-semibold leading-tight text-heading">{item.title}</h3>
                  <p className="flex-1 text-[15px] leading-relaxed text-foreground/70">{item.text}</p>
                  <ArrowRight aria-hidden="true" className="mt-6 h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder ────────────────────────────────────────────────────── */}
      <section className="site-container py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div aria-hidden="true" className="absolute -left-4 -top-4 h-full w-full border border-gold/60" />
            <img
              src={assetPath(content.aboutPage.imageSrc)}
              alt={content.aboutPage.imageAlt}
              width={1400}
              height={933}
              loading="lazy"
              decoding="async"
              className="relative aspect-[4/3] w-full rounded-sm object-cover"
            />
          </Reveal>
          <div>
            <SectionHeading eyebrow={home.founder.eyebrow} title={home.founder.name} />
            <Reveal>
              <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.2em] text-accent">{home.founder.role}</p>
              <p className="mt-6 text-[17px] leading-relaxed text-foreground/80">{home.founder.text}</p>
              <Link href={localizePath(home.founder.ctaHref, locale)} prefetch={false} className="btn btn-outline mt-8">
                {home.founder.ctaLabel}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="bg-panel py-20 lg:py-28">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <SectionHeading eyebrow={home.faq.eyebrow} title={home.faq.title} />
          <Reveal>
            <FaqList items={home.faq.items} />
          </Reveal>
        </div>
      </section>

      {/* ── Latest insights ────────────────────────────────────────────── */}
      {latestPosts.length ? (
        <section className="site-container py-20 lg:py-28">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading eyebrow={home.blog.eyebrow} title={home.blog.title} />
            <Reveal>
              <Link href={localizePath(home.blog.ctaHref, locale)} prefetch={false} className="btn btn-outline shrink-0">
                {home.blog.ctaLabel}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {latestPosts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 90}>
                <Link
                  href={post.href}
                  prefetch={false}
                  className="group relative flex h-full flex-col rounded-sm border border-border bg-card p-8 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-gold/60"
                >
                  <span aria-hidden="true" className="absolute left-0 top-0 h-[3px] w-12 bg-gold transition-[width] duration-500 group-hover:w-full" />
                  <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">{post.category}</p>
                  <h3 className="mb-4 font-display text-[1.55rem] font-semibold leading-tight text-heading">{post.title}</h3>
                  <p className="flex-1 text-[15px] leading-relaxed text-foreground/70">{post.excerpt}</p>
                  <p className="mt-6 flex items-center justify-between border-t border-border pt-5 text-[13px] text-muted-foreground">
                    <span>{post.dateLabel} · {post.readingTime}</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Quote band ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-border bg-card py-20">
        <FlowLines animated={false} className="absolute -right-20 -top-16 h-[160%] w-auto text-gold opacity-25" />
        <Reveal className="site-container relative text-center">
          <p className="display-title mx-auto max-w-[24ch] text-[clamp(2rem,1.4rem+2.4vw,3.6rem)] italic text-heading">
            {content.aboutPage.name.text}
          </p>
        </Reveal>
      </section>

      <BookingCta
        locale={locale}
        eyebrow={home.booking.eyebrow}
        title={home.booking.title}
        description={home.booking.description}
        ctaLabel={home.booking.ctaLabel}
        secondaryCtaLabel={home.booking.secondaryCtaLabel}
        secondaryCtaHref={home.booking.secondaryCtaHref}
      />
    </SiteShell>
  )
}
