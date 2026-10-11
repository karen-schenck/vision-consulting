"use client"

import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { useLandingContent } from "@/components/providers/landing-content-provider"
import { Reveal } from "@/components/shared/reveal"
import { localizePath } from "@/lib/i18n"
import { cn } from "@/lib/utils"

/**
 * Vision · Impact · Signature as three tiers. The middle one sits on navy —
 * not because it is "recommended" (the site never claims that) but to give
 * the row a centre of gravity.
 */
export function OfferTiers({ excludeSlug }: { excludeSlug?: string }) {
  const { content, locale } = useLandingContent()
  const { common } = content
  const offers = content.offersPage.offers.filter((offer) => offer.slug !== excludeSlug)

  return (
    <div className={cn("grid gap-5", offers.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2")}>
      {offers.map((offer, index) => {
        const featured = offers.length === 3 && index === 1
        return (
          <Reveal key={offer.slug} delay={index * 90}>
            <Link
              href={localizePath(`/offres/${offer.slug}`, locale)}
              prefetch={false}
              className={cn(
                "group relative flex h-full flex-col rounded-sm border p-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 lg:p-10",
                featured
                  ? "band-navy border-navy shadow-[0_30px_60px_-35px_rgba(15,27,51,0.8)]"
                  : "border-border bg-card hover:border-gold/60 hover:shadow-[0_30px_60px_-40px_rgba(15,27,51,0.45)]"
              )}
            >
              <span aria-hidden="true" className="absolute left-0 top-0 h-[3px] w-16 bg-gold transition-[width] duration-500 group-hover:w-full" />
              <p className={cn("display-title text-[2.75rem] italic", featured ? "text-gold" : "text-accent")}>
                {offer.tier}
              </p>
              <h3
                className={cn(
                  "mt-2 text-[12px] font-bold uppercase tracking-[0.2em]",
                  featured ? "text-primary-foreground" : "text-heading"
                )}
              >
                {offer.title}
              </h3>
              <p className={cn("mt-6 flex-1 leading-relaxed", featured ? "text-primary-foreground/80" : "text-foreground/75")}>
                {offer.summary}
              </p>
              <div
                className={cn(
                  "mt-8 flex items-center justify-between border-t pt-5 text-sm",
                  featured ? "border-white/15" : "border-border"
                )}
              >
                <span className={cn("inline-flex items-center gap-2", featured ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                  {offer.duration}
                </span>
                <span className={cn("inline-flex items-center gap-1.5 font-semibold", featured ? "text-gold" : "text-heading")}>
                  {common.learnMoreLabel}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        )
      })}
    </div>
  )
}
