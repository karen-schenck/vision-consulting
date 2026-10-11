"use client"

import { useEffect, useRef, useState } from "react"
import { Diamond } from "@/components/brand/vhc-mark"
import { cn } from "@/lib/utils"

type Step = { letter: string; title: string; summary: string; points?: string[] }

/**
 * Observer → Décoder → Consolider as three columns strung on one gold line.
 * The line fills left to right when the diagram scrolls into view; on narrow
 * screens it becomes a vertical rail.
 */
export function OdcSteps({
  steps,
  stepLabel,
  showPoints = false,
  tone = "dark",
}: {
  steps: Step[]
  stepLabel: string
  showPoints?: boolean
  tone?: "dark" | "light"
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || !("IntersectionObserver" in window)) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const light = tone === "light"

  return (
    <div ref={ref} data-in-view={inView ? "" : undefined} className="relative">
      {/* Horizontal rail (desktop) */}
      <div aria-hidden="true" className="absolute left-0 right-0 top-[2.75rem] hidden h-px md:block">
        <div className={cn("absolute inset-0", light ? "bg-white/15" : "bg-border")} />
        <div className="odc-track absolute inset-0 bg-gold" />
      </div>

      <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
        {steps.map((step, index) => (
          <li key={step.title} className="relative min-h-16 pl-[5.5rem] md:min-h-0 md:pl-0">
            {/* Vertical rail (mobile) */}
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute left-8 top-16 h-[calc(100%-1.5rem)] w-px bg-gold/50 md:hidden"
              />
            ) : null}

            <div
              className={cn(
                "absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-full border md:relative md:h-[5.5rem] md:w-[5.5rem]",
                light ? "border-gold/60 bg-ink" : "border-gold bg-background"
              )}
            >
              <span className={cn("display-title text-[2rem] md:text-[2.6rem]", light ? "text-gold" : "text-heading")}>
                {step.letter}
              </span>
            </div>

            <p className={cn("mb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.2em] md:mt-8 md:pt-0", light ? "text-gold/80" : "text-accent")}>
              {stepLabel} {index + 1}
            </p>
            <h3 className={cn("display-title mb-3 text-[1.7rem] md:text-[1.9rem]", light ? "text-primary-foreground" : "text-heading")}>
              {step.title}
            </h3>
            <p className={cn("max-w-[30ch] leading-relaxed", light ? "text-primary-foreground/75" : "text-foreground/75")}>
              {step.summary}
            </p>

            {showPoints && step.points?.length ? (
              <ul className="mt-6 space-y-3">
                {step.points.map((point) => (
                  <li key={point} className={cn("flex gap-3 text-sm leading-relaxed", light ? "text-primary-foreground/80" : "text-foreground/80")}>
                    <Diamond className="mt-[0.45rem] h-1.5 w-1.5 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
