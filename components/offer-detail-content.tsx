"use client"

import { Clock, Target } from "lucide-react"
import { SiteShell } from "@/components/shared/site-shell"
import { PageHeader } from "@/components/shared/page-header"
import { Reveal } from "@/components/shared/reveal"
import { BookingCta } from "@/components/landing/booking-cta"
import { SectionHeading } from "@/components/sections/section-heading"
import { OfferTiers } from "@/components/sections/offer-tiers"
import { Diamond } from "@/components/brand/vhc-mark"
import { useLandingContent } from "@/components/providers/landing-content-provider"

export function OfferDetailContent({ slug }: { slug: string }) {
  const { content, locale } = useLandingContent()
  const { offersPage, common, home } = content
  const offer = offersPage.offers.find((item) => item.slug === slug)
  if (!offer) return null

  return (
    <SiteShell>
      <PageHeader
        eyebrow={`${offer.tier} · ${offer.title}`}
        title={offer.tagline}
        intro={offer.summary}
        breadcrumbs={[{ label: offersPage.badge, href: "/offres" }, { label: offer.title }]}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-sm border border-gold/40 px-4 py-2 text-[13px] text-primary-foreground/85">
            <Clock aria-hidden="true" className="h-4 w-4 text-gold" />
            {common.durationLabel} : {offer.duration}
          </span>
        </div>
      </PageHeader>

      {/* Objective */}
      <section className="site-container py-20 lg:py-24">
        <Reveal className="grid gap-8 rounded-sm border border-border bg-card p-8 md:grid-cols-[auto_1fr] md:items-center lg:p-12">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/60">
            <Target aria-hidden="true" className="h-7 w-7 text-accent" strokeWidth={1.4} />
          </span>
          <div>
            <p className="section-eyebrow mb-3">{common.objectiveLabel}</p>
            <p className="font-display text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] font-semibold leading-snug text-heading">
              {offer.objective}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Signals + deliverables */}
      <section className="site-container grid gap-6 pb-20 lg:grid-cols-2 lg:pb-24">
        <Reveal className="rounded-sm bg-panel p-8 lg:p-12">
          <h2 className="display-title mb-8 text-[2rem] text-heading">{common.signalsLabel}</h2>
          <ul className="space-y-4">
            {offer.signals.map((signal) => (
              <li key={signal} className="flex gap-4 leading-relaxed text-foreground/80">
                <Diamond className="mt-2 h-1.5 w-1.5 shrink-0" />
                {signal}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={100} className="band-navy rounded-sm p-8 lg:p-12">
          <h2 className="display-title mb-8 text-[2rem] text-primary-foreground">{common.deliverablesLabel}</h2>
          <ul className="space-y-4">
            {offer.deliverables.map((item) => (
              <li key={item} className="flex gap-4 leading-relaxed text-primary-foreground/85">
                <Diamond className="mt-2 h-1.5 w-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Process */}
      <section className="border-y border-border bg-card py-20 lg:py-24">
        <div className="site-container">
          <SectionHeading title={common.processLabel} />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {offer.process.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 90} className="relative border-t-2 border-gold pt-8">
                <span className="display-title text-[3.25rem] text-gold/80">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="display-title mt-2 text-[1.75rem] text-heading">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-foreground/75">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="site-container py-20 lg:py-24">
        <SectionHeading title={common.otherOffersLabel} />
        <div className="mt-12">
          <OfferTiers excludeSlug={offer.slug} />
        </div>
      </section>

      <BookingCta
        locale={locale}
        eyebrow={home.booking.eyebrow}
        title={home.booking.title}
        description={home.booking.description}
        secondaryCtaLabel={home.booking.secondaryCtaLabel}
      />
    </SiteShell>
  )
}
