"use client"

import { SiteShell } from "@/components/shared/site-shell"
import { PageHeader } from "@/components/shared/page-header"
import { Reveal } from "@/components/shared/reveal"
import { BookingCta } from "@/components/landing/booking-cta"
import { OdcSteps } from "@/components/sections/odc-steps"
import { FiguresBand } from "@/components/sections/figures-band"
import { useLandingContent } from "@/components/providers/landing-content-provider"

export function MethodPageContent() {
  const { content, locale } = useLandingContent()
  const page = content.methodPage
  const { common, home } = content

  return (
    <SiteShell>
      <PageHeader eyebrow={page.badge} title={page.title} intro={page.intro} breadcrumbs={[{ label: page.badge }]} />

      <section className="site-container py-20 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {page.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 100}>
              <p className="text-[17px] leading-relaxed text-foreground/80">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="my-20 text-center">
          <p className="display-title text-[clamp(2.4rem,1.6rem+3vw,4.5rem)] tracking-[0.04em] text-heading">
            {page.steps.map((step, index) => (
              <span key={step.title}>
                {index > 0 ? <span className="mx-3 text-gold sm:mx-6">·</span> : null}
                {step.title}
              </span>
            ))}
          </p>
        </Reveal>

        <OdcSteps steps={page.steps} stepLabel={common.stepLabel} showPoints />
      </section>

      <FiguresBand eyebrow={page.figuresTitle} title={page.figuresIntro} />

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
