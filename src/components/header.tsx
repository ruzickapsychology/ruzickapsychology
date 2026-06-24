"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { site } from "@/content/site";

const TRANSPARENT_PAGES = ["/", "/contact"];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [overQuoteBand, setOverQuoteBand] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const sentinel = document.getElementById("hero-sentinel");
      const quoteBand = document.getElementById("about-quote-band");
      // No hero on this page → nav is solid from the top.
      const past = sentinel
        ? sentinel.getBoundingClientRect().top <= 64
        : true;
      const quoteRect = quoteBand?.getBoundingClientRect();

      setScrolled(past);
      setOverQuoteBand(
        quoteRect ? quoteRect.top <= 64 && quoteRect.bottom > 0 : false,
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const canBeTransparent = TRANSPARENT_PAGES.includes(pathname);
  const transparent = canBeTransparent && !scrolled;
  const light = transparent || overQuoteBand;

  const wordmark = light ? "text-light" : "text-fg";
  const link = light
    ? "text-light/90 hover:text-light"
    : "text-body hover:text-accent";

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color] duration-500"
      style={
        transparent
          ? {
              backgroundColor:
                pathname === "/contact"
                  ? "rgb(37 31 18 / 0.25)"
                  : "rgb(18 46 58 / 0.3)",
            }
          : overQuoteBand
            ? { backgroundColor: "rgb(7 24 25 / 0.3)" }
          : { backgroundColor: "rgb(217 211 198 / 0.8)" }
      }
    >
      <Container
        size="xl"
        className="flex items-center justify-between gap-6 py-4"
      >
        <Link
          href="/"
          className={`font-heading text-[18px] tracking-tight transition-colors duration-300 ${wordmark}`}
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {site.nav.map((item) => {
            const href = item.href as string;
            const active =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`mono-label relative transition-colors duration-300 after:absolute after:left-0 after:-bottom-1.5 after:h-px after:bg-current after:transition-transform after:duration-300 ${
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

        <details className="group relative sm:hidden">
          <summary
            className={`mono-label cursor-pointer list-none [&::-webkit-details-marker]:hidden ${wordmark}`}
          >
            Menu
          </summary>
          <nav className="absolute right-0 z-10 mt-3 flex w-52 flex-col gap-4 rounded-xl border border-muted bg-surface p-5 shadow-lg">
            {site.nav.map((item) => {
              const href = item.href as string;
              const active =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`mono-label border-b pb-1 transition-colors ${
                    active
                      ? "border-accent text-accent"
                      : "border-transparent text-body hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </details>
      </Container>
    </header>
  );
}
