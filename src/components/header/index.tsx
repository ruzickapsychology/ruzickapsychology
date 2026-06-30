"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { HEADER_SENTINEL_ID } from "@/components/ui/header-sentinel";
import { ArrowUpRight } from "@/components/ui/arrow-up-right";
import type { SiteSettings } from "@/lib/cms";
import { MAIN_NAV } from "@/lib/site-defaults";
import styles from "./header.module.css";

const TRANSPARENT_PAGES = ["/", "/contact"];

function normalizePathname(pathname: string) {
  return pathname === "/" ? pathname : pathname.replace(/\/$/, "");
}

export function Header({
  siteSettings,
}: {
  siteSettings?: SiteSettings | null;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [overQuoteBand, setOverQuoteBand] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const routeCanBeTransparent = TRANSPARENT_PAGES.includes(
      normalizePathname(pathname),
    );

    const onScroll = () => {
      const sentinel = document.getElementById(HEADER_SENTINEL_ID);
      const quoteBand = document.getElementById("about-quote-band");
      // No hero on ordinary pages means solid from the top. On transparent
      // pages, async content can render the sentinel after the header mounts.
      const past = sentinel
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
    if (menuOpen || !menuVisible) return;

    const timeout = window.setTimeout(() => {
      setMenuVisible(false);
    }, 560);

    return () => window.clearTimeout(timeout);
  }, [menuOpen, menuVisible]);

  const normalizedPathname = normalizePathname(pathname);
  const canBeTransparent = TRANSPARENT_PAGES.includes(normalizedPathname);
  const transparent = canBeTransparent && !scrolled;
  const light = transparent || overQuoteBand;
  const navBackground: CSSProperties = transparent
    ? {
        backgroundColor:
          normalizedPathname === "/contact"
            ? "var(--color-nav-contact-overlay)"
            : "var(--color-nav-home-overlay)",
      }
    : overQuoteBand
      ? { backgroundColor: "var(--color-nav-quote-overlay)" }
      : { backgroundColor: "var(--color-nav-solid-overlay)" };

  const wordmark = light ? styles.lightText : styles.darkText;
  const mobilePrimaryLinks = MAIN_NAV;
  const mobileUtilityLinks = [
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ] as const;
  const openMobileMenu = () => {
    setMenuVisible(true);
    window.requestAnimationFrame(() => setMenuOpen(true));
  };
  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <header className={styles.root} style={navBackground}>
      <Container size="xl" className={styles.inner}>
        <Link href="/" className={`${styles.wordmark} ${wordmark}`}>
          {siteSettings?.name}
        </Link>

        <nav aria-label="Primary navigation" className={styles.desktopNav}>
          {MAIN_NAV.map((item) => {
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
                className={`${styles.desktopLink} ${active ? styles.activeLink : ""} ${stateClass}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={menuVisible ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className={`${styles.menuButton} ${wordmark}`}
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
          id="mobile-navigation"
          className={`${styles.panel} ${
            menuOpen ? styles.panelOpen : styles.panelClosing
          }`}
          style={navBackground}
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
                    className={`${styles.item} ${styles.primaryItem} ${itemClass}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <nav
              aria-label="Mobile secondary navigation"
              className={`${styles.secondary} ${light ? styles.secondaryLight : styles.secondaryDark}`}
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
                    className={`${styles.item} ${styles.utilityItem} ${itemClass}`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {siteSettings?.portalUrl ? (
                <a
                  href={siteSettings.portalUrl}
                  onClick={closeMobileMenu}
                  className={`${styles.item} ${styles.utilityItem} ${
                    light ? styles.utilityLight : styles.utilityDark
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Client Portal
                  <ArrowUpRight />
                </a>
              ) : null}
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
