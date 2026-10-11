"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Script from "next/script"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useLandingContent } from "@/components/providers/landing-content-provider"
import { localizePath } from "@/lib/i18n"

type ConsentPreferences = {
  analytics: boolean
  marketing: boolean
  updatedAt: number
}

const defaultPreferences: ConsentPreferences = {
  analytics: true,
  marketing: false,
  updatedAt: 0,
}

function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script
        id={`google-analytics-${gaId}`}
        strategy="afterInteractive"
      >{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `}</Script>
    </>
  )
}

export function CookieConsent({ gaId }: { gaId?: string }) {
  const { content, locale } = useLandingContent()
  const { cookieConsent } = content
  const STORAGE_KEY = cookieConsent.storageKey

  const [ready, setReady] = useState(false)
  const [hasStoredConsent, setHasStoredConsent] = useState(false)
  const [open, setOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] =
    useState<ConsentPreferences>(defaultPreferences)

  useEffect(() => {
    let openTimeoutId: number | undefined
    let loadListenerAttached = false

    const interactionEvents = ["pointerdown", "keydown", "scroll"] as const

    const openBanner = () => {
      setOpen(true)
    }

    const clearInteractionListeners = () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleFirstInteraction)
      })
    }

    const scheduleBanner = (delayMs: number) => {
      if (openTimeoutId) return
      openTimeoutId = window.setTimeout(openBanner, delayMs)
    }

    const handleFirstInteraction = () => {
      clearInteractionListeners()
      scheduleBanner(250)
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)

      if (stored) {
        const parsed = JSON.parse(stored) as ConsentPreferences

        setPreferences({
          analytics: !!parsed.analytics,
          marketing: !!parsed.marketing,
          updatedAt: parsed.updatedAt ?? Date.now(),
        })
        setHasStoredConsent(true)
      } else {
        if (document.readyState === "complete") {
          scheduleBanner(4000)
        } else {
          window.addEventListener("load", handlePageLoad, { once: true })
          loadListenerAttached = true
        }

        interactionEvents.forEach((eventName) => {
          window.addEventListener(eventName, handleFirstInteraction, {
            passive: true,
          })
        })
      }
    } catch {
      scheduleBanner(4000)
    } finally {
      setReady(true)
    }

    return () => {
      clearInteractionListeners()
      if (openTimeoutId) {
        window.clearTimeout(openTimeoutId)
      }
      if (loadListenerAttached) {
        window.removeEventListener("load", handlePageLoad)
      }
    }

    function handlePageLoad() {
      scheduleBanner(4000)
    }
  }, [STORAGE_KEY])

  const persist = (next: ConsentPreferences) => {
    setPreferences(next)
    setHasStoredConsent(true)
    setOpen(false)
    setShowDetails(false)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const handleAcceptAll = () =>
    persist({
      analytics: true,
      marketing: true,
      updatedAt: Date.now(),
    })

  const handleSave = () =>
    persist({
      ...preferences,
      updatedAt: Date.now(),
    })

  const analyticsEnabled =
    ready && hasStoredConsent && preferences.analytics && !!gaId

  if (!ready) return null

  return (
    <>
      {analyticsEnabled && <GoogleAnalytics gaId={gaId!} />}

      {open && (
        <section
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
          className="fixed bottom-3 right-3 z-40 w-[calc(100vw-1.5rem)] max-w-sm rounded-sm border border-t-2 border-border border-t-gold bg-background p-3 shadow-2xl sm:bottom-6 sm:right-6 sm:max-h-[calc(100vh-3rem)] sm:max-w-md sm:overflow-y-auto sm:p-5"
        >
          <div className="space-y-2 text-left sm:space-y-3">
            <div className="inline-flex flex-wrap items-center gap-2 text-xs font-medium text-primary">
              <Badge
                variant="outline"
                className="border-primary/50 bg-primary/10 text-primary"
              >
                {cookieConsent.badge}
              </Badge>

              <span className="hidden text-muted-foreground sm:inline">
                {cookieConsent.badgeDescription}
              </span>
            </div>

            <h2
              id="cookie-consent-title"
              className="text-base font-semibold leading-none tracking-tight sm:text-xl"
            >
              {cookieConsent.title}
            </h2>

            <p
              id="cookie-consent-description"
              className="text-xs leading-relaxed text-muted-foreground sm:text-sm"
            >
              {cookieConsent.description}
            </p>
          </div>

          {!showDetails && (
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                className="min-w-0 flex-1 dark:hover:border-primary/60 dark:hover:bg-primary/10 dark:hover:text-primary"
                onClick={() => setShowDetails(true)}
              >
                {cookieConsent.buttons.selectPreferences}
              </Button>

              <Button
                variant="default"
                className="min-w-0 flex-1"
                onClick={handleAcceptAll}
              >
                {cookieConsent.buttons.acceptAll}
              </Button>
            </div>
          )}

          {showDetails && (
            <>
              <div className="mt-4 space-y-3">
                <PreferenceToggle
                  title={cookieConsent.toggles.essential.title}
                  description={cookieConsent.toggles.essential.description}
                  lockedBadge={cookieConsent.toggles.essential.alwaysOnLabel}
                  requiredLabel={cookieConsent.toggles.essential.requiredLabel}
                  locked
                />

                <PreferenceToggle
                  title={cookieConsent.toggles.analytics.title}
                  description={cookieConsent.toggles.analytics.description}
                  ariaLabelPrefix={cookieConsent.toggles.ariaLabelPrefix}
                  value={preferences.analytics}
                  onChange={(checked) =>
                    setPreferences((prev) => ({
                      ...prev,
                      analytics: checked,
                    }))
                  }
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-1 text-xs text-muted-foreground">
                <p>{cookieConsent.footer.localStorageCopy}</p>

                <p>
                  {cookieConsent.footer.readMoreCopy}{" "}
                  <Link
                    href={localizePath("/privacy", locale)}
                    prefetch={false}
                    className="text-primary underline underline-offset-4"
                  >
                    {cookieConsent.footer.privacyPolicyLabel}
                  </Link>
                  .
                </p>
              </div>

              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={handleSave}
                >
                  {cookieConsent.buttons.saveSelection}
                </Button>

                <Button
                  variant="default"
                  className="w-full sm:w-auto"
                  onClick={handleAcceptAll}
                >
                  {cookieConsent.buttons.acceptAll}
                </Button>
              </div>
            </>
          )}
        </section>
      )}
    </>
  )
}

type PreferenceToggleProps = {
  title: string
  description: string
  value?: boolean
  badge?: string
  locked?: boolean
  lockedBadge?: string
  requiredLabel?: string
  ariaLabelPrefix?: string
  onChange?: (checked: boolean) => void
}

function PreferenceToggle({
  title,
  description,
  value,
  badge,
  locked,
  lockedBadge,
  requiredLabel,
  ariaLabelPrefix,
  onChange,
}: PreferenceToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-background/90 px-4 py-3 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{title}</span>

          {badge ? (
            <Badge variant="secondary" className="text-[11px]">
              {badge}
            </Badge>
          ) : null}

          {locked ? (
            <Badge variant="outline" className="text-[11px]">
              {lockedBadge}
            </Badge>
          ) : null}
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {locked ? (
        <span className="text-xs font-medium text-muted-foreground">
          {requiredLabel}
        </span>
      ) : (
        <Switch
          checked={!!value}
          onCheckedChange={(checked) => onChange?.(checked)}
          aria-label={`${ariaLabelPrefix || "Toggle"} ${title} cookies`}
        />
      )}
    </div>
  )
}
