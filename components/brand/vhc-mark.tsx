import { cn } from "@/lib/utils"

/**
 * The logo lockup: the serif VHC monogram, a gold hairline, and the
 * spaced-out wordmark — the same arrangement as the signage on the brand
 * photography. Rendered in live type so it stays crisp and inherits colour.
 */
export function VhcLogo({
  className,
  tone = "light",
  compact = false,
}: {
  className?: string
  tone?: "light" | "dark"
  compact?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "font-display text-[1.9rem] font-semibold leading-none tracking-[0.02em]",
          tone === "light" ? "text-gold" : "text-heading"
        )}
      >
        VHC
      </span>
      {!compact ? (
        <>
          <span aria-hidden="true" className="h-8 w-px bg-gold/70" />
          <span
            className={cn(
              "text-[0.625rem] font-bold uppercase leading-[1.5] tracking-[0.28em]",
              tone === "light" ? "text-primary-foreground/90" : "text-heading/80"
            )}
          >
            Vision Human
            <br />
            Consulting
          </span>
        </>
      ) : null}
    </span>
  )
}

/**
 * The flowing lines of the brand mark: a bundle of strokes that falls from the
 * top-left, bends, and sweeps out to the right. Each stroke draws itself in
 * once (staggered), then keeps swaying gently, each line on its own slow
 * rhythm so the bundle never moves in lockstep. Purely decorative.
 */
export function FlowLines({
  className,
  lines = 11,
  animated = true,
}: {
  className?: string
  lines?: number
  animated?: boolean
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 640 560"
      fill="none"
      preserveAspectRatio="xMinYMin meet"
      className={cn("pointer-events-none", className)}
    >
      <g stroke="currentColor" strokeLinecap="round">
        {Array.from({ length: lines }, (_, i) => {
          const y0 = 8 + i * 9
          const bend = 150 + i * 6
          const yMid = 210 + i * 14
          const yEnd = 300 + i * 22
          const swayDuration = 7 + (i % 5) * 1.3
          return (
            <g
              key={i}
              className={animated ? "flow-sway" : undefined}
              style={
                animated
                  ? { animationDuration: `${swayDuration}s`, animationDelay: `${-i * 0.9}s` }
                  : undefined
              }
            >
              <path
                d={`M0 ${y0} C ${90 + i * 3} ${y0 + 4}, ${bend - 20} ${y0 + 40}, ${bend} ${yMid - 60} S ${
                  bend + 60
                } ${yEnd + 20}, ${320 + i * 6} ${yEnd} S 560 ${yEnd - 30 - i * 4}, 640 ${yEnd - 40 - i * 6}`}
                pathLength={1}
                strokeWidth={1.1}
                vectorEffect="non-scaling-stroke"
                strokeOpacity={0.35 + (i % 4) * 0.15}
                className={animated ? "flow-line" : undefined}
                style={animated ? { animationDelay: `${i * 70}ms` } : undefined}
              />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

/** The logo's gold diamond, used as list bullets and section punctuation. */
export function Diamond({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("diamond", className)} />
}
