"use client"

import Link from "next/link"
import { ArrowRight, CalendarDays, Mail, Phone } from "lucide-react"
import { useLandingContent } from "@/components/providers/landing-content-provider"
import { Diamond, FlowLines } from "@/components/brand/vhc-mark"
import { Reveal } from "@/components/shared/reveal"
import { localizePath, type Locale } from "@/lib/i18n"

/**
 * The closing invitation shared by every page: an ink-navy panel with the
 * discovery-call booking as the main action, the contact form as the
 * alternative, and both direct lines underneath so it never dead-ends.
 */
export function BookingCta({
  locale,
  eyebrow,
  title,
  description,
  ctaLabel,
  secondaryCtaLabel,
  secondaryCtaHref = "/contact",
}: {
  locale: Locale
  eyebrow?: string
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
}) {
  const { content } = useLandingContent()
  const { phone, email } = content.footer.practicalInfo

  return (
    <section id="contact" className="site-container py-16 lg:py-24">
      <Reveal className="band-navy relative overflow-hidden rounded-sm px-6 py-16 sm:px-12 lg:px-20 lg:py-20">
        <FlowLines className="absolute -right-20 -top-10 h-[130%] w-auto text-gold opacity-35" />

        <div className="relative max-w-[46rem]">
          {eyebrow ? <p className="section-eyebrow mb-5">{eyebrow}</p> : null}
          <h2 className="display-title mb-5 text-[clamp(2rem,1.4rem+2vw,3.25rem)] text-primary-foreground">
            {title}
          </h2>
          <p className="mb-10 max-w-[38rem] text-base leading-relaxed text-primary-foreground/75 sm:text-lg">
            {description}
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={content.common.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              <CalendarDays aria-hidden="true" className="h-4 w-4" />
              {ctaLabel ?? content.common.bookCallLabel}
            </a>
            <Link
              href={localizePath(secondaryCtaHref, locale)}
              prefetch={false}
              className="btn btn-ghost-light"
            >
              {secondaryCtaLabel ?? content.common.contactLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-gold/25 pt-8 text-sm">
            <a
              href={`tel:+33${phone.replace(/\s/g, "").replace(/^(\+33|0)/, "")}`}
              className="inline-flex items-center gap-2.5 text-primary-foreground/80 transition-colors hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5 text-gold" strokeWidth={1.6} />
              {phone}
            </a>
            <Diamond className="hidden h-1.5 w-1.5 sm:inline-block" />
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2.5 break-all text-primary-foreground/80 transition-colors hover:text-gold"
            >
              <Mail className="h-3.5 w-3.5 text-gold" strokeWidth={1.6} />
              {email}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
