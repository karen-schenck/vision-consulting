"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteShell } from "@/components/shared/site-shell"
import { PageHeader } from "@/components/shared/page-header"
import { Reveal } from "@/components/shared/reveal"
import { BookingCta } from "@/components/landing/booking-cta"
import { SectionHeading } from "@/components/sections/section-heading"
import { ContentIcon } from "@/components/sections/icon"
import { OdcSteps } from "@/components/sections/odc-steps"
import { OfferTiers } from "@/components/sections/offer-tiers"
import { useLandingContent } from "@/components/providers/landing-content-provider"
import { localizePath } from "@/lib/i18n"

export function ConsultingPageContent() {
  const { content, locale } = useLandingContent()
  const page = content.consultingPage
  const { home, common, methodPage } = content

  return (
    <SiteShell>
      <PageHeader
        eyebrow={page.badge}
        title={page.title}
        intro={page.intro}
        breadcrumbs={[{ label: page.badge }]}
        imageSrc={page.imageSrc}
        imageAlt={page.imageAlt}
      />

      <section className="site-container py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <SectionHeading title={page.globalReading.title} />
          <Reveal className="space-y-6 text-[17px] leading-relaxed text-foreground/80">
            {page.globalReading.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        </div>

        <div className="mt-20">
          <Reveal>
            <h2 className="display-title mb-10 text-[clamp(1.8rem,1.4rem+1.4vw,2.6rem)] text-heading">
              {page.dimensions.title}
            </h2>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
            {page.dimensions.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} className="bg-card p-7">
                <ContentIcon name={item.icon} className="mb-6 h-7 w-7 text-accent" />
                <h3 className="mb-3 font-display text-[1.35rem] font-semibold leading-tight text-heading">{item.title}</h3>
                <p className="text-[15px] leading-relaxed text-foreground/70">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="band-ink py-20 lg:py-28">
        <div className="site-container">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading title={page.method.title} description={page.method.text} tone="light" />
            <Reveal>
              <Link href={localizePath(page.method.ctaHref, locale)} prefetch={false} className="btn btn-ghost-light shrink-0">
                {page.method.ctaLabel}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-16">
            <OdcSteps steps={methodPage.steps} stepLabel={common.stepLabel} tone="light" />
          </div>
        </div>
      </section>

      <section className="site-container py-20 lg:py-28">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading title={page.levels.title} description={page.levels.text} />
          <Reveal>
            <Link href={localizePath(page.levels.ctaHref, locale)} prefetch={false} className="btn btn-outline shrink-0">
              {page.levels.ctaLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-14">
          <OfferTiers />
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
