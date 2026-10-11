"use client"

import { useLandingContent } from "@/components/providers/landing-content-provider"
import { FlowLines } from "@/components/brand/vhc-mark"
import { Reveal } from "@/components/shared/reveal"

/** The three sourced figures from the original Méthode page, on navy. */
export function FiguresBand({ title, eyebrow }: { title?: string; eyebrow?: string }) {
  const { content } = useLandingContent()
  const { figures } = content.home

  return (
    <section className="band-ink relative overflow-hidden">
      <FlowLines animated={false} className="absolute -left-24 top-0 h-full w-auto text-gold opacity-20" />
      <div className="site-container relative py-20 lg:py-28">
        <Reveal className="max-w-[52rem]">
          <p className="section-eyebrow mb-5">{eyebrow ?? figures.eyebrow}</p>
          <h2 className="display-title text-[clamp(1.9rem,1.3rem+2vw,3rem)] text-primary-foreground">
            {title ?? figures.title}
          </h2>
        </Reveal>

        <dl className="mt-14 grid gap-px overflow-hidden rounded-sm bg-gold/25 md:grid-cols-3">
          {figures.items.map((item, index) => (
            <Reveal key={item.value} delay={index * 100} className="bg-ink p-8 lg:p-10">
              <dt className="display-title text-[clamp(2.6rem,2rem+2vw,3.75rem)] text-gold">{item.value}</dt>
              <dd className="mt-4 leading-relaxed text-primary-foreground/75">{item.text}</dd>
            </Reveal>
          ))}
        </dl>
        <p className="mt-6 text-[12px] tracking-wide text-primary-foreground/50">{figures.sources}</p>
      </div>
    </section>
  )
}
