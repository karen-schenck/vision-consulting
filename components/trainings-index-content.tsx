"use client"

import { SiteShell } from "@/components/shared/site-shell"
import { PageHeader } from "@/components/shared/page-header"
import { BookingCta } from "@/components/landing/booking-cta"
import { TrainingCards } from "@/components/sections/training-cards"
import { useLandingContent } from "@/components/providers/landing-content-provider"

export function TrainingsIndexContent() {
  const { content, locale } = useLandingContent()
  const page = content.trainingsPage
  const { home } = content

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
        <TrainingCards />
      </section>

      <BookingCta
        locale={locale}
        eyebrow={home.booking.eyebrow}
        title={page.ctaTitle}
        description={home.booking.description}
        secondaryCtaLabel={home.booking.secondaryCtaLabel}
      />
    </SiteShell>
  )
}
