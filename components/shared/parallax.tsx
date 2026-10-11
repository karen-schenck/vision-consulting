"use client"

import { assetPath } from "@/lib/asset-path"

import { useEffect, useRef, type CSSProperties } from "react"

type Layer = {
  el: HTMLElement
  speed: number
  visible: boolean
}

/**
 * One rAF ticker and one scroll listener for every parallax layer on the page,
 * rather than a listener per element. Layers outside the viewport are skipped,
 * so a long page only ever measures the two or three bands actually on screen.
 */
const layers = new Set<Layer>()
let frame = 0
let listening = false

function apply() {
  frame = 0
  const viewport = window.innerHeight || 1
  const middle = viewport / 2

  layers.forEach((layer) => {
    if (!layer.visible) return
    const rect = layer.el.getBoundingClientRect()
    // Where the layer's centre sits on its way across the viewport:
    // +1 just below the fold, 0 dead centre, -1 just above it.
    const progress = (rect.top + rect.height / 2 - middle) / viewport
    const clamped = Math.max(-1.5, Math.min(1.5, progress))
    const offset = clamped * layer.speed * viewport
    layer.el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`
  })
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(apply)
}

function listen() {
  if (listening) return
  listening = true
  window.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule)
}

function stopListening() {
  if (!listening || layers.size) return
  listening = false
  window.removeEventListener("scroll", schedule)
  window.removeEventListener("resize", schedule)
  if (frame) {
    cancelAnimationFrame(frame)
    frame = 0
  }
}

/**
 * Drifts an element against the scroll. `speed` is the fraction of a viewport
 * height the layer lags behind over its full travel: positive values move
 * slower than the page (they read as further away), negative values move
 * faster (they read as closer). Keep decorative layers under ~0.25 and content
 * layers under ~0.1 — past that it stops feeling like depth and starts feeling
 * like lag.
 *
 * Anything clipped by an `overflow-hidden` parent must be oversized beyond the
 * frame by more than its travel, or the drift will expose an edge.
 */
export function useParallax<T extends HTMLElement>(speed: number) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !speed) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const layer: Layer = { el, speed, visible: false }
    layers.add(layer)
    listen()

    const observer = new IntersectionObserver(
      ([entry]) => {
        layer.visible = entry.isIntersecting
        // Only promote a layer while it is actually moving.
        el.style.willChange = entry.isIntersecting ? "transform" : ""
        if (entry.isIntersecting) schedule()
      },
      { rootMargin: "25% 0px 25% 0px" }
    )
    observer.observe(el)
    schedule()

    return () => {
      observer.disconnect()
      layers.delete(layer)
      el.style.transform = ""
      el.style.willChange = ""
      stopListening()
    }
  }, [speed])

  return ref
}

/**
 * Wrapper form of {@link useParallax}. Keep it a layer of its own — never the
 * same element as a `Reveal`, whose entrance animation also drives `transform`.
 */
export function Parallax({
  speed = 0.12,
  className = "",
  style,
  children,
}: {
  speed?: number
  className?: string
  style?: CSSProperties
  children: React.ReactNode
}) {
  const ref = useParallax<HTMLDivElement>(speed)

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}

/**
 * A background image that drifts inside its frame. The layer is deliberately
 * taller than the frame it fills so the drift never uncovers an edge; the
 * parent must clip (`overflow-hidden`) and establish a stacking context.
 */
export function ParallaxImage({
  src,
  speed = 0.1,
  className = "",
  overshoot = "22%",
}: {
  src: string
  speed?: number
  className?: string
  overshoot?: string
}) {
  const ref = useParallax<HTMLDivElement>(speed)

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`absolute inset-x-0 bg-secondary bg-cover bg-center ${className}`}
      style={{
        top: `-${overshoot}`,
        bottom: `-${overshoot}`,
        backgroundImage: `url(${assetPath(src)})`,
      }}
    />
  )
}
