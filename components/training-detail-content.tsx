"use client"

import { Users } from "lucide-react"
import { SiteShell } from "@/components/shared/site-shell"
import { PageHeader } from "@/components/shared/page-header"
import { Reveal } from "@/components/shared/reveal"
import { BookingCta } from "@/components/landing/booking-cta"
import { SectionHeading } from "@/components/sections/section-heading"
import { TrainingCards } from "@/components/sections/training-cards"
import { Diamond } from "@/components/brand/vhc-mark"
import { useLandingContent } from "@/components/providers/landing-content-provider"

export function TrainingDetailContent({ slug }: { slug: string }) {
  const { content, locale } = useLandingContent()
  const { trainingsPage, common, home } = content
  const training = trainingsPage.trainings.find((item) => item.slug === slug)
  if (!training) return null

  return (
    <SiteShell>
      <PageHeader
        eyebrow={training.sector}
        title={training.title}
        intro={training.subtitle}
        breadcrumbs={[{ label: trainingsPage.badge, href: "/formations" }, { label: training.sector }]}
      >
        <dl className="mt-10 grid max-w-[44rem] gap-px overflow-hidden rounded-sm bg-gold/25 sm:grid-cols-3">
          {training.facts.map((fact) => (
            <div key={fact.label} className="bg-ink p-5">
              <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">{fact.label}</dt>
              <dd className="mt-2 text-[15px] text-primary-foreground/90">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <section className="site-container py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <Reveal>
            <p className="font-display text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] font-semibold leading-snug text-heading">
              {training.summary}
            </p>
          </Reveal>
          <Reveal delay={100} className="rounded-sm bg-panel p-8">
            <div className="mb-4 flex items-center gap-3">
              <Users aria-hidden="true" className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-heading">{common.audienceLabel}</h2>
            </div>
            <p className="leading-relaxed text-foreground/80">{training.audience}</p>
          </Reveal>
        </div>
      </section>

      <section className="band-ink py-20 lg:py-24">
        <div className="site-container grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading title={common.objectivesLabel} tone="light" />
            <ul className="mt-10 space-y-5">
              {training.objectives.map((objective, index) => (
                <Reveal as="li" key={objective} delay={index * 70} className="flex gap-4 text-[17px] leading-relaxed text-primary-foreground/85">
                  <Diamond className="mt-2.5 h-1.5 w-1.5 shrink-0" />
                  {objective}
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title={common.programmeLabel} tone="light" />
            <ol className="mt-10 space-y-px overflow-hidden rounded-sm bg-gold/20">
              {training.programme.map((module, index) => (
                <Reveal as="li" key={module.title} delay={index * 70} className="flex gap-6 bg-navy p-6">
                  <span className="display-title text-[2rem] leading-none text-gold">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-[1.35rem] font-semibold text-primary-foreground">{module.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-primary-foreground/70">{module.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="site-container py-20 lg:py-24">
        <SectionHeading title={common.otherTrainingsLabel} />
        <div className="mt-12">
          <TrainingCards excludeSlug={training.slug} />
        </div>
      </section>

      <BookingCta
        locale={locale}
        eyebrow={common.quoteLabel}
        title={trainingsPage.ctaTitle}
        description={home.booking.description}
        secondaryCtaLabel={home.booking.secondaryCtaLabel}
      />
    </SiteShell>
  )
}
