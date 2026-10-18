"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CtaLink } from "@/components/cta-link";
import {
  getInquiryCtaLabel,
  normalizeAvailabilityStatus,
} from "@/config/availability";
import { Container } from "@/components/container";
import { HEADER_SENTINEL_ID } from "@/components/header-sentinel";
import { ArrowUpRight } from "@/components/arrow-up-right";
import { TrackedExternalLink } from "@/components/tracked-external-link";
import type { SiteSettings } from "@/data/cms";
import { MAIN_NAV } from "@/config/site";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

const TRANSPARENT_PAGES = ["/", "/contact"];
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function normalizePathname(pathname: string | null | undefined) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/$/, "");
}

function isTransparentPage(pathname: string) {
  return TRANSPARENT_PAGES.includes(normalizePathname(pathname));
}

function restorePageInteraction() {
  document.body.style.overflow = "";
  for (const element of document.querySelectorAll<HTMLElement>(
    "main, footer",
  )) {
    element.inert = false;
  }
}

export function SiteHeader({
  siteSettings,
}: {
  siteSettings?: SiteSettings | null;
}) {
  const pathname = usePathname();
  // Keep the server and first client render deterministic. Ordinary routes
  // are solid based on pathname alone; transparent routes update from their
  // scroll position immediately after hydration.
  const [scrolled, setScrolled] = useState(false);
  const [overQuoteBand, setOverQuoteBand] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuOpenFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const routeCanBeTransparent = isTransparentPage(pathname);

    const onScroll = () => {
      const sentinel = document.getElementById(HEADER_SENTINEL_ID);
      const quoteBand = document.getElementById("about-quote-band");
      // No hero on ordinary pages means solid from the top. On transparent
      // pages, async content can render the sentinel after the header mounts.
      // The contact hero contains the entire form, so its bottom sentinel is
      // too late to protect navigation contrast as visitors move through fields.
      const past =
        normalizePathname(pathname) === "/contact"
          ? window.scrollY >= 64
          : sentinel
            ? sentinel.getBoundingClientRect().top <= 64
            : !routeCanBeTransparent;
      const quoteRect = quoteBand?.getBoundingClientRect();

      setScrolled(past);
      setOverQuoteBand(
        quoteRect ? quoteRect.top <= 64 && quoteRect.bottom > 0 : false,
      );
    };
    onScroll();
    const raf = window.requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuVisible ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuVisible]);

  useEffect(() => {
    const desktopViewport = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const closeMenuAtDesktop = (
      event: MediaQueryListEvent | MediaQueryList,
    ) => {
      if (!event.matches) return;
      if (menuOpenFrameRef.current !== null) {
        window.cancelAnimationFrame(menuOpenFrameRef.current);
        menuOpenFrameRef.current = null;
      }
      restorePageInteraction();
      setMenuOpen(false);
      setMenuVisible(false);
    };

    closeMenuAtDesktop(desktopViewport);
    desktopViewport.addEventListener("change", closeMenuAtDesktop);

    return () => {
      if (menuOpenFrameRef.current !== null) {
        window.cancelAnimationFrame(menuOpenFrameRef.current);
      }
      desktopViewport.removeEventListener("change", closeMenuAtDesktop);
    };
  }, []);

  useEffect(() => {
    if (menuOpen || !menuVisible) return;

    const timeout = window.setTimeout(() => {
      setMenuVisible(false);
    }, 560);

    return () => window.clearTimeout(timeout);
  }, [menuOpen, menuVisible]);

  useEffect(() => {
    if (!menuOpen) return;

    const background = [
      document.querySelector<HTMLElement>("main"),
      document.querySelector<HTMLElement>("footer"),
    ].filter((element): element is HTMLElement => element !== null);
    const menuButton = menuButtonRef.current;
    const panelControls = menuPanelRef.current
      ? Array.from(
          menuPanelRef.current.querySelectorAll<HTMLElement>(
            FOCUSABLE_SELECTOR,
          ),
        )
      : [];
    const focusCycle = menuButton
      ? [...panelControls, menuButton]
      : panelControls;

    for (const element of background) element.inert = true;
    panelControls[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        menuButton?.focus();
        return;
      }

      if (event.key !== "Tab" || focusCycle.length === 0) return;

      event.preventDefault();
      const currentIndex = focusCycle.indexOf(
        document.activeElement as HTMLElement,
      );
      const direction = event.shiftKey ? -1 : 1;
      const nextIndex =
        currentIndex === -1
          ? 0
          : (currentIndex + direction + focusCycle.length) % focusCycle.length;

      focusCycle[nextIndex]?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      for (const element of background) element.inert = false;
    };
  }, [menuOpen]);

  const normalizedPathname = normalizePathname(pathname);
  const canBeTransparent = isTransparentPage(normalizedPathname);
  const transparent = canBeTransparent && !scrolled;
  const light = transparent || overQuoteBand;
  const background = transparent
    ? normalizedPathname === "/contact"
      ? "contact"
      : "home"
    : overQuoteBand
      ? "quote"
      : "solid";
  const navBackground = {
    contact: styles.contactOverlay,
    home: styles.homeOverlay,
    quote: styles.quoteOverlay,
    solid: styles.solidOverlay,
  }[background];

  const wordmark = light ? styles.lightText : styles.darkText;
  const navigationLinks = MAIN_NAV.filter((item) => item.href !== "/contact");
  const mobilePrimaryLinks = navigationLinks.filter(
    (item) => item.href !== "/faq",
  );
  const availability = normalizeAvailabilityStatus(
    siteSettings?.availabilityStatus,
  );
  const contactLabel = !siteSettings
    ? "Contact"
    : availability === "closed"
      ? "Current availability"
      : getInquiryCtaLabel(
          availability,
          siteSettings.availabilityMessaging,
          siteSettings.consultationCtaLabel,
        );
  const mobileUtilityLinks = [
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ] as const;
  const openMobileMenu = () => {
    setMenuVisible(true);
    menuOpenFrameRef.current = window.requestAnimationFrame(() => {
      menuOpenFrameRef.current = null;
      if (!window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
        setMenuOpen(true);
      }
    });
  };
  const closeMobileMenu = () => {
    if (menuOpenFrameRef.current !== null) {
      window.cancelAnimationFrame(menuOpenFrameRef.current);
      menuOpenFrameRef.current = null;
    }
    setMenuOpen(false);
  };

  return (
    <header
      data-slot="site-header"
      data-background={background}
      className={cn(styles.root, navBackground)}
    >
      <Container size="xl" className={styles.inner}>
        <Link href="/" className={cn(styles.wordmark, wordmark)}>
          {siteSettings?.name}
        </Link>

        <nav aria-label="Primary navigation" className={styles.desktopNav}>
          {navigationLinks.map((item) => {
            const href = item.href as string;
            const active = pathname === href || pathname.startsWith(`${href}/`);
            const stateClass = active
              ? light
                ? styles.activeLightLink
                : styles.activeDarkLink
              : light
                ? styles.lightLink
                : styles.darkLink;

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  styles.desktopLink,
                  active && styles.activeLink,
                  stateClass,
                )}
              >
                {item.label}
              </Link>
            );
          })}
          {contactLabel ? (
            <CtaLink
              href="/contact"
              event="consultation_cta_click"
              variant={light ? "secondary" : "primary"}
              tone={light ? "inverse" : "default"}
              size="compact"
              aria-current={
                normalizedPathname === "/contact" ? "page" : undefined
              }
            >
              {contactLabel}
            </CtaLink>
          ) : null}
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label={menuVisible ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className={cn(styles.menuButton, wordmark)}
          onClick={menuVisible ? closeMobileMenu : openMobileMenu}
        >
          {menuVisible ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M12 5v14M5 12h14" transform="rotate(45 12 12)" />
            </svg>
          ) : (
            "Menu"
          )}
        </button>
      </Container>

      {menuVisible ? (
        <div
          ref={menuPanelRef}
          id="mobile-navigation"
          role="dialog"
          aria-label="Navigation menu"
          aria-modal="true"
          className={cn(
            styles.panel,
            navBackground,
            menuOpen ? styles.panelOpen : styles.panelClosing,
          )}
        >
          <Container size="xl" className={styles.mobileContainer}>
            <nav
              aria-label="Mobile primary navigation"
              className={styles.primaryNav}
            >
              {mobilePrimaryLinks.map((item) => {
                const href = item.href as string;
                const active =
                  pathname === href || pathname.startsWith(`${href}/`);
                const itemClass = active
                  ? light
                    ? styles.activePrimaryLight
                    : styles.activePrimaryDark
                  : light
                    ? styles.primaryLight
                    : styles.primaryDark;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMobileMenu}
                    className={cn(styles.item, styles.primaryItem, itemClass)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {contactLabel ? (
                <CtaLink
                  href="/contact"
                  event="consultation_cta_click"
                  variant={light ? "secondary" : "primary"}
                  tone={light ? "inverse" : "default"}
                  aria-current={
                    normalizedPathname === "/contact" ? "page" : undefined
                  }
                  onClick={closeMobileMenu}
                  className={styles.item}
                >
                  {contactLabel}
                </CtaLink>
              ) : null}
            </nav>

            <nav
              aria-label="Mobile secondary navigation"
              className={cn(
                styles.secondary,
                light ? styles.secondaryLight : styles.secondaryDark,
              )}
            >
              {mobileUtilityLinks.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                const itemClass = active
                  ? light
                    ? styles.activeUtilityLight
                    : styles.activeUtilityDark
                  : light
                    ? styles.utilityLight
                    : styles.utilityDark;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMobileMenu}
                    className={cn(styles.item, styles.utilityItem, itemClass)}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {siteSettings?.portalUrl ? (
                <TrackedExternalLink
                  href={siteSettings.portalUrl}
                  event="client_portal_click"
                  onClick={closeMobileMenu}
                  className={cn(
                    styles.item,
                    styles.utilityItem,
                    light ? styles.utilityLight : styles.utilityDark,
                  )}
                >
                  Existing Client Portal
                  <ArrowUpRight />
                </TrackedExternalLink>
              ) : null}
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
