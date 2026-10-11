"use client"

import Link from "next/link"
import { Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { useLandingContent } from "@/components/providers/landing-content-provider"
import { FlowLines, VhcLogo } from "@/components/brand/vhc-mark"
import { localizePath } from "@/lib/i18n"

/**
 * Ink-navy closing band: brand and promise, direct contact lines, two link
 * columns, then the legal row. The flowing gold lines sit faintly behind it.
 */
export function Footer() {
  const { content, locale } = useLandingContent()
  const { footer } = content
  const info = footer.practicalInfo

  return (
    <footer className="band-ink relative overflow-hidden">
      <FlowLines
        animated={false}
        className="absolute -left-16 -top-10 h-[34rem] w-[40rem] text-gold opacity-[0.12]"
      />

      <div className="site-container relative py-16 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href={localizePath("/", locale)}
              prefetch={false}
              aria-label={content.header.brand.name}
              className="inline-flex"
            >
              <VhcLogo />
            </Link>
            <p className="mt-6 font-display text-xl italic text-gold-soft">
              {content.header.brand.tagline}
            </p>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-primary-foreground/65">
              {footer.tagline}
            </p>
          </div>

          <div>
            <h2 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              {info.title}
            </h2>
            <ul className="space-y-3.5 text-[13px] text-primary-foreground/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                <span>{info.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                <a href={`tel:+33${info.phone.replace(/\s/g, "").replace(/^(\+33|0)/, "")}`} className="transition-colors hover:text-gold">
                  {info.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                <a href={`mailto:${info.email}`} className="break-all transition-colors hover:text-gold">
                  {info.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Linkedin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                <a
                  href={info.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold"
                >
                  {info.linkedinLabel}
                </a>
              </li>
            </ul>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h2 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                {column.title}
              </h2>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={localizePath(link.href, locale)}
                      prefetch={false}
                      className="text-[13px] text-primary-foreground/80 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-gold/20 pt-8 sm:flex-row">
          <p className="text-[12px] text-primary-foreground/55">
            © {new Date().getFullYear()} {footer.copyright}
          </p>
          <div className="flex gap-6">
            {footer.legalLinks.map((link) => (
              <Link
                key={link.label}
                href={localizePath(link.href, locale)}
                prefetch={false}
                className="text-[12px] text-primary-foreground/55 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
