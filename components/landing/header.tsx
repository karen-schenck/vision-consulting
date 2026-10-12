"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import Link from "next/link"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronRight, Menu } from "lucide-react"
import { useLandingContent } from "@/components/providers/landing-content-provider"
import { VhcLogo } from "@/components/brand/vhc-mark"
import { localizePath } from "@/lib/i18n"
import { cn } from "@/lib/utils"

/**
 * Native anchor for in-page hash targets — the one-pager's nav is mostly
 * hashes, and a client-side <Link> would swallow the scroll.
 */
function NavLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string
  className?: string
  onClick?: () => void
  children: React.ReactNode
}) {
  if (href.includes("#")) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} prefetch={false} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}

const LocaleSwitcher = dynamic(
  () =>
    import("@/components/landing/locale-switcher").then(
      (mod) => mod.LocaleSwitcher
    ),
  {
    ssr: false,
    loading: () => (
      <div aria-hidden="true" className="h-8 min-w-16 rounded-sm border border-white/20" />
    ),
  }
)

type NavItem = {
  label: string
  href?: string
  children?: Array<{
    label: string
    href: string
  }>
}

/**
 * Ink-navy bar that sticks to the top of the viewport: VHC lockup on the left,
 * section nav in the middle, the gold "talk to us" action on the right. It
 * shares the hero's navy so the top of every page reads as one block.
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMobileGroup, setActiveMobileGroup] = useState<NavItem | null>(null)
  const { content, locale } = useLandingContent()
  const navItems = content.header.navLinks as NavItem[]
  const ctaHref = localizePath(content.header.ctaHref, locale)

  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-ink/95 text-primary-foreground backdrop-blur-md">
      <div className="site-container flex h-[4.5rem] items-center justify-between gap-6">
        <Link
          href={localizePath("/", locale)}
          prefetch={false}
          aria-label={content.header.brand.name}
          className="flex shrink-0 items-center"
        >
          <VhcLogo className="hidden sm:inline-flex lg:hidden xl:inline-flex" />
          <VhcLogo className="sm:hidden lg:inline-flex xl:hidden" compact />
        </Link>

        <NavigationMenu viewport={false} className="hidden lg:flex lg:flex-none">
          <NavigationMenuList className="gap-1">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.label}>
                {item.children?.length ? (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="group inline-flex h-9 items-center rounded-sm bg-transparent px-2 xl:px-3 text-[13px] font-semibold tracking-[0.02em] text-primary-foreground/80 outline-none transition-colors hover:text-gold focus:text-gold focus-visible:ring-2 focus-visible:ring-gold/60 data-[state=open]:text-gold"
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden="true"
                          className="ml-1 size-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" sideOffset={10} className="w-80 rounded-sm border-t-2 border-t-gold p-1.5">
                      <DropdownMenuGroup className="flex flex-col gap-0.5">
                        {item.children.map((child) => (
                          <DropdownMenuItem
                            key={child.label}
                            asChild
                            className="p-0 focus:bg-panel focus:text-foreground"
                          >
                            <Link
                              href={localizePath(child.href, locale)}
                              prefetch={false}
                              className="rounded-sm px-3 py-2.5 text-[13px] text-foreground/85 transition-colors hover:bg-panel hover:text-accent"
                            >
                              {child.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : item.href ? (
                  <NavigationMenuLink asChild>
                    <NavLink
                      href={localizePath(item.href, locale)}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "h-9 rounded-sm bg-transparent px-2 xl:px-3 text-[13px] font-semibold tracking-[0.02em] text-primary-foreground/80 hover:bg-transparent hover:text-gold focus:bg-transparent focus:text-gold data-[active=true]:bg-transparent data-[active=true]:text-gold"
                      )}
                    >
                      {item.label}
                    </NavLink>
                  </NavigationMenuLink>
                ) : null}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher />
          <Link href={ctaHref} prefetch={false} className="btn btn-gold whitespace-nowrap px-4 py-3 xl:px-5">
            {content.header.ctaLabel}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher />
          <Drawer
            direction="left"
            open={mobileMenuOpen}
            onOpenChange={(open) => {
              setMobileMenuOpen(open)
              if (!open) setActiveMobileGroup(null)
            }}
          >
            <DrawerTrigger
              aria-label={content.header.mobileMenu.openAriaLabel}
              className="rounded-sm p-2 transition-colors hover:bg-white/10"
            >
              <Menu className="h-5 w-5 text-primary-foreground" />
            </DrawerTrigger>
            <DrawerContent className="max-w-sm">
              <DrawerHeader className="border-b border-border">
                <DrawerTitle>
                  <VhcLogo tone="dark" />
                  <span className="sr-only">{content.header.brand.name}</span>
                </DrawerTitle>
                <DrawerDescription className="sr-only">
                  Navigation
                </DrawerDescription>
              </DrawerHeader>
              <nav className="flex flex-col p-4">
                {navItems.map((item) =>
                  item.children?.length ? (
                    <button
                      key={item.label}
                      type="button"
                      className="flex items-center justify-between border-b border-border py-3.5 text-left text-sm font-medium text-foreground/80"
                      onClick={() => {
                        setActiveMobileGroup(item)
                        setMobileMenuOpen(false)
                      }}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : item.href ? (
                    <NavLink
                      key={item.label}
                      href={localizePath(item.href, locale)}
                      className="border-b border-border py-3.5 text-sm font-medium text-foreground/80"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ) : null
                )}
                <Link
                  href={ctaHref}
                  prefetch={false}
                  className="btn btn-primary mt-6 w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {content.header.ctaLabel}
                </Link>
              </nav>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <Drawer
        direction="right"
        open={Boolean(activeMobileGroup)}
        onOpenChange={(open) => {
          if (!open) setActiveMobileGroup(null)
        }}
      >
        <DrawerContent className="max-w-sm">
          <DrawerHeader className="border-b border-border">
            <DrawerTitle className="font-display text-lg text-heading">
              {activeMobileGroup?.label}
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              {activeMobileGroup?.label}
            </DrawerDescription>
          </DrawerHeader>
          <nav className="flex flex-col p-4">
            {activeMobileGroup?.children?.map((child) => (
              <NavLink
                key={child.label}
                href={localizePath(child.href, locale)}
                className="border-b border-border py-3.5 text-sm text-foreground/80"
                onClick={() => {
                  setActiveMobileGroup(null)
                  setMobileMenuOpen(false)
                }}
              >
                {child.label}
              </NavLink>
            ))}
          </nav>
        </DrawerContent>
      </Drawer>
    </header>
  )
}
