"use client"

import { useState } from "react"
import { CalendarDays, CheckCircle2, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react"
import { useLandingContent } from "@/components/providers/landing-content-provider"
import { PageHeader } from "@/components/shared/page-header"
import { Reveal } from "@/components/shared/reveal"

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_API_KEY_WEB3FORMS

type Status = "idle" | "sending" | "success" | "error"

const fieldClass =
  "w-full rounded-sm border border-input bg-background px-4 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/25"
const labelClass = "mb-2 block text-[12px] font-bold uppercase tracking-[0.14em] text-heading"

/**
 * Contact page: a qualifying form (who, what about, context) on the left,
 * the discovery-call booking and direct lines on the right. The form posts to
 * Web3Forms so the static export needs no server; without a key it falls back
 * to the visitor's mail client so a request is never lost.
 */
export function ContactContent() {
  const { content } = useLandingContent()
  const { contactPage, footer, common } = content
  const { form } = contactPage
  const info = footer.practicalInfo
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const data = new FormData(formElement)
    if (data.get("botcheck")) return

    if (!WEB3FORMS_KEY) {
      const body = [
        `${form.nameLabel}: ${data.get("name")}`,
        `${form.companyLabel}: ${data.get("company") || "-"}`,
        `${form.emailLabel}: ${data.get("email")}`,
        `${form.phoneLabel}: ${data.get("phone")}`,
        "",
        String(data.get("message") || ""),
      ].join("\n")
      window.location.href = `mailto:${info.email}?subject=${encodeURIComponent(String(data.get("subject")))}&body=${encodeURIComponent(body)}`
      return
    }

    setStatus("sending")
    data.append("access_key", WEB3FORMS_KEY)
    data.append("from_name", "visionhumanconsulting.com")
    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data })
      const result = await response.json()
      if (result.success) {
        setStatus("success")
        formElement.reset()
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={contactPage.badge}
        title={contactPage.title}
        intro={contactPage.intro}
        breadcrumbs={[{ label: contactPage.badge }]}
      />

      <section className="site-container py-16 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <Reveal className="rounded-sm border border-border bg-card p-6 sm:p-10">
            <h2 className="display-title mb-8 text-[2rem] text-heading">{form.title}</h2>

            {status === "success" ? (
              <div role="status" className="flex gap-4 rounded-sm border border-gold/50 bg-panel p-6">
                <CheckCircle2 aria-hidden="true" className="h-6 w-6 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-heading">{form.successTitle}</p>
                  <p className="mt-1 text-foreground/75">{form.successText}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <div>
                  <label htmlFor="name" className={labelClass}>{form.nameLabel} *</label>
                  <input id="name" name="name" required autoComplete="name" className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="company" className={labelClass}>{form.companyLabel}</label>
                  <input id="company" name="company" autoComplete="organization" className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>{form.emailLabel} *</label>
                  <input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>{form.phoneLabel} *</label>
                  <input id="phone" name="phone" type="tel" required autoComplete="tel" className={fieldClass} />
                </div>

                <fieldset className="sm:col-span-2">
                  <legend className={labelClass}>{form.subjectLabel}</legend>
                  <div className="flex flex-wrap gap-2">
                    {form.subjects.map((subject, index) => (
                      <label
                        key={subject}
                        className="cursor-pointer rounded-sm border border-input px-4 py-2.5 text-[14px] text-foreground/80 transition-colors has-[:checked]:border-gold has-[:checked]:bg-gold/10 has-[:checked]:text-heading"
                      >
                        <input type="radio" name="subject" value={subject} defaultChecked={index === 0} className="sr-only" />
                        {subject}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="sm:col-span-2">
                  <label htmlFor="message" className={labelClass}>{form.messageLabel}</label>
                  <textarea id="message" name="message" rows={6} placeholder={form.messagePlaceholder} className={fieldClass} />
                </div>

                {status === "error" ? (
                  <p role="alert" className="text-sm text-destructive sm:col-span-2">
                    {form.errorText}{" "}
                    <a href={`mailto:${info.email}`} className="link-gold font-semibold">{info.email}</a>
                  </p>
                ) : null}

                <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[12px] text-muted-foreground">* {form.requiredHint}</p>
                  <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-60">
                    <Send aria-hidden="true" className="h-4 w-4" />
                    {status === "sending" ? form.sendingLabel : form.submitLabel}
                  </button>
                </div>

                <p className="text-[12px] leading-relaxed text-muted-foreground sm:col-span-2">{form.consent}</p>
              </form>
            )}
          </Reveal>

          <div className="grid content-start gap-6">
            <Reveal delay={80} className="band-navy rounded-sm p-8">
              <CalendarDays aria-hidden="true" className="mb-5 h-7 w-7 text-gold" strokeWidth={1.4} />
              <h2 className="display-title mb-3 text-[1.75rem] text-primary-foreground">{contactPage.booking.title}</h2>
              <p className="mb-7 leading-relaxed text-primary-foreground/75">{contactPage.booking.description}</p>
              <a href={common.calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold w-full">
                {common.bookCallLabel}
              </a>
            </Reveal>

            <Reveal delay={140} className="rounded-sm border border-border bg-card p-8">
              <h2 className="mb-6 text-[12px] font-bold uppercase tracking-[0.18em] text-heading">
                {contactPage.coordinatesTitle}
              </h2>
              <ul className="space-y-5 text-[15px]">
                <li className="flex gap-4">
                  <Mail aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
                  <div>
                    <p className="text-[12px] text-muted-foreground">{contactPage.emailLabel}</p>
                    <a href={`mailto:${info.email}`} className="link-gold break-all font-semibold text-heading">{info.email}</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Phone aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
                  <div>
                    <p className="text-[12px] text-muted-foreground">{contactPage.phoneLabel}</p>
                    <a href={`tel:+33${info.phone.replace(/\s/g, "").replace(/^(\+33|0)/, "")}`} className="link-gold font-semibold text-heading">{info.phone}</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Linkedin aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
                  <div>
                    <p className="text-[12px] text-muted-foreground">{contactPage.linkedinLabel}</p>
                    <a href={info.linkedinUrl} target="_blank" rel="noopener noreferrer" className="link-gold font-semibold text-heading">
                      {contactPage.linkedinHandle}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
                  <div>
                    <p className="text-[12px] text-muted-foreground">{contactPage.addressLabel}</p>
                    <p className="font-semibold text-heading">{info.address}</p>
                  </div>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
