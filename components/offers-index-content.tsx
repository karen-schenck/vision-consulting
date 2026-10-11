"use client"

import { SiteShell } from "@/components/shared/site-shell"
import { PageHeader } from "@/components/shared/page-header"
import { Reveal } from "@/components/shared/reveal"
import { BookingCta } from "@/components/landing/booking-cta"
import { OfferTiers } from "@/components/sections/offer-tiers"
import { Diamond } from "@/components/brand/vhc-mark"
import { useLandingContent } from "@/components/providers/landing-content-provider"

/** Offer overview: the tiers, then a side-by-side comparison table. */
export function OffersIndexContent() {
  const { content, locale } = useLandingContent()
  const page = content.offersPage
  const { common, home } = content

  const rows: Array<{ label: string; values: string[] }> = [
    { label: common.objectiveLabel, values: page.offers.map((offer) => offer.objective) },
    { label: common.durationLabel, values: page.offers.map((offer) => offer.duration) },
  ]

  return (
    <SiteShell>
      <PageHeader eyebrow={page.badge} title={page.title} intro={page.intro} breadcrumbs={[{ label: page.badge }]} />

      <section className="site-container py-20 lg:py-24">
        <OfferTiers />
      </section>

      <section className="site-container pb-8">
        <Reveal className="overflow-x-auto rounded-sm border border-border bg-card">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="w-[16%] p-6" />
                {page.offers.map((offer) => (
                  <th key={offer.slug} scope="col" className="p-6 align-bottom">
                    <span className="display-title block text-[2rem] italic text-accent">{offer.tier}</span>
                    <span className="mt-1 block text-[12px] font-bold uppercase tracking-[0.18em] text-heading">
                      {offer.title}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <th scope="row" className="p-6 align-top text-[12px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    {row.label}
                  </th>
                  {row.values.map((value, index) => (
                    <td key={index} className="p-6 align-top text-[15px] leading-relaxed text-foreground/80">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="p-6 align-top text-[12px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {common.deliverablesLabel}
                </th>
                {page.offers.map((offer) => (
                  <td key={offer.slug} className="p-6 align-top">
                    <ul className="space-y-2.5">
                      {offer.deliverables.map((item) => (
                        <li key={item} className="flex gap-3 text-[14px] leading-relaxed text-foreground/80">
                          <Diamond className="mt-[0.45rem] h-1.5 w-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
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
