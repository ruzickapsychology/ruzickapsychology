"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { HEADER_SENTINEL_ID } from "@/components/ui/header-sentinel";
import { ArrowUpRight } from "@/components/ui/icons";
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

  const wordmark = light ? "text-light" : "text-fg";
  const link = light
    ? "text-light/90 hover:text-light"
    : "text-body hover:text-accent";
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
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color] duration-500"
      style={navBackground}
    >
      <Container
        size="xl"
        className="relative z-20 flex items-center justify-between gap-6 py-4"
      >
        <Link
          href="/"
          className={`font-heading text-[18px] tracking-tight transition-colors duration-300 ${wordmark}`}
        >
          {siteSettings?.name}
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 sm:flex"
        >
          {MAIN_NAV.map((item) => {
            const href = item.href as string;
            const active = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`mono-label relative transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-current after:transition-transform after:duration-300 ${
                  active
                    ? `after:w-full after:scale-x-100 ${light ? "text-light" : "text-accent"}`
                    : `after:w-full after:scale-x-0 hover:after:scale-x-100 ${link}`
                }`}
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
          className={`mono-label inline-flex h-6 min-w-12 items-center justify-end sm:hidden ${wordmark}`}
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
          className={`${styles.panel} fixed inset-0 z-10 overflow-y-auto backdrop-blur-2xl sm:hidden ${
            menuOpen ? styles.panelOpen : styles.panelClosing
          }`}
          style={navBackground}
        >
          <Container
            size="xl"
            className="flex min-h-dvh flex-col justify-center py-28"
          >
            <nav
              aria-label="Mobile primary navigation"
              className="flex flex-col items-start gap-5"
            >
              {mobilePrimaryLinks.map((item) => {
                const href = item.href as string;
                const active =
                  pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMobileMenu}
                    className={`${styles.item} heading-module transition-colors ${
                      light
                        ? active
                          ? "text-light"
                          : "text-light/85 hover:text-light"
                        : active
                          ? "text-accent"
                          : "text-fg hover:text-accent"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <nav
              aria-label="Mobile secondary navigation"
              className={`${styles.secondary} mt-12 flex flex-col items-start gap-4 border-t pt-8 ${
                light ? "border-light/30" : "border-fg/20"
              }`}
            >
              {mobileUtilityLinks.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMobileMenu}
                    className={`${styles.item} mono-label tracking-[0.08em] transition-colors ${
                      light
                        ? active
                          ? "text-light"
                          : "text-light/75 hover:text-light"
                        : active
                          ? "text-accent"
                          : "text-body hover:text-accent"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {siteSettings?.portalUrl ? (
                <a
                  href={siteSettings.portalUrl}
                  onClick={closeMobileMenu}
                  className={`${styles.item} mono-label inline-flex items-center gap-1.5 tracking-[0.08em] transition-colors ${
                    light
                      ? "text-light/75 hover:text-light"
                      : "text-body hover:text-accent"
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
