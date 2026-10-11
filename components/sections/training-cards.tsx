"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLandingContent } from "@/components/providers/landing-content-provider"
import { Reveal } from "@/components/shared/reveal"
import { localizePath } from "@/lib/i18n"

/** Catalogue cards for the training courses, with their format facts. */
export function TrainingCards({ excludeSlug }: { excludeSlug?: string }) {
  const { content, locale } = useLandingContent()
  const trainings = content.trainingsPage.trainings.filter((training) => training.slug !== excludeSlug)

  return (
    <div className={trainings.length === 3 ? "grid gap-5 lg:grid-cols-3" : "grid gap-5 md:grid-cols-2"}>
      {trainings.map((training, index) => (
        <Reveal key={training.slug} delay={index * 90}>
          <Link
            href={localizePath(`/formations/${training.slug}`, locale)}
            prefetch={false}
            className="group flex h-full flex-col rounded-sm border border-border bg-card p-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_30px_60px_-40px_rgba(15,27,51,0.45)] lg:p-10"
          >
            <p className="section-eyebrow mb-6">{training.sector}</p>
            <h3 className="display-title text-[1.9rem] text-heading">{training.title}</h3>
            <p className="mt-3 font-display text-lg italic text-accent">{training.subtitle}</p>
            <p className="mt-5 flex-1 leading-relaxed text-foreground/75">{training.summary}</p>
            <dl className="mt-8 grid gap-2 border-t border-border pt-5 text-sm">
              {training.facts.map((fact) => (
                <div key={fact.label} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{fact.label}</dt>
                  <dd className="text-right font-semibold text-heading">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-heading">
              {content.common.learnMoreLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  )
}
