"use client"

import { SiteShell } from "@/components/shared/site-shell"
import { PageHeader } from "@/components/shared/page-header"
import { Reveal } from "@/components/shared/reveal"
import { BookingCta } from "@/components/landing/booking-cta"
import { SectionHeading } from "@/components/sections/section-heading"
import { FlowLines } from "@/components/brand/vhc-mark"
import { useLandingContent } from "@/components/providers/landing-content-provider"

export function AboutPageContent() {
  const { content, locale } = useLandingContent()
  const page = content.aboutPage
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
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <SectionHeading eyebrow={page.founder.title} title={page.founder.name} />
            <Reveal>
              <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.2em] text-accent">{home.founder.role}</p>
            </Reveal>
          </div>
          <Reveal className="space-y-6 text-[17px] leading-relaxed text-foreground/80">
            {page.founder.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-panel py-20 lg:py-28">
        <div className="site-container">
          <SectionHeading title={page.values.title} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {page.values.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 80} className="rounded-sm border-t-2 border-gold bg-card p-8 lg:p-10">
                <h3 className="display-title mb-3 text-[1.75rem] text-heading">{item.title}</h3>
                <p className="leading-relaxed text-foreground/75">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="band-ink relative overflow-hidden py-24 lg:py-32">
        <FlowLines className="absolute -left-16 top-0 h-full w-auto text-gold opacity-40" />
        <Reveal className="site-container relative text-center">
          <h2 className="display-title text-[clamp(2.4rem,1.6rem+3vw,4.5rem)] text-gold">{page.name.title}</h2>
          <p className="mx-auto mt-6 max-w-[48ch] text-lg leading-relaxed text-primary-foreground/80">{page.name.text}</p>
        </Reveal>
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
