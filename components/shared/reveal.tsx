"use client"

import { useEffect, useRef, useState } from "react"

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: "div" | "span" | "li"
}

/**
 * Fades + lifts content into view the first time it crosses the viewport.
 * Renders visible immediately if IntersectionObserver isn't available or the
 * user prefers reduced motion, so content is never stuck hidden.
 */
export function Reveal({ children, className = "", delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true)
      return
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const Comp = as
  return (
    <Comp
      ref={ref as never}
      className={`${className} ${visible ? "animate-in fade-in slide-in-from-bottom-4 fill-mode-both" : "opacity-0"}`}
      style={visible ? { animationDelay: `${delay}ms`, animationDuration: "700ms" } : undefined}
    >
      {children}
    </Comp>
  )
}
