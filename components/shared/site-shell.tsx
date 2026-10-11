"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

/**
 * Every route renders between the sticky navy header and the navy footer.
 * The wrapper clips (not scrolls) so decorative layers can bleed to the edge
 * without stranding the sticky header.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell min-h-svh">
      <a
        href="#main"
        className="sr-only z-[60] bg-gold px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  )
}
