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

  useEffect(() => {
    const onScroll = () => {
      const sentinel = document.getElementById("hero-sentinel");
      // No hero on this page → nav is solid from the top.
      const past = sentinel
        ? sentinel.getBoundingClientRect().top <= 64
        : true;
      setScrolled(past);
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
  const light = transparent && pathname === "/";

  const wordmark = light ? "text-light" : "text-fg";
  const link = light
    ? "text-light/90 hover:text-light"
    : "text-body hover:text-accent";

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color] duration-500"
      style={
        transparent
          ? { backgroundColor: "transparent" }
          : {
              backgroundColor: "var(--color-bg)",
              backgroundImage: "url(/images/bg-texture.jpg)",
              backgroundSize: "760px",
            }
      }
    >
      <Container
        size="xl"
        className="flex items-center justify-between gap-6 py-4"
      >
        <Link
          href="/"
          className={`font-heading text-xl tracking-tight transition-colors duration-300 ${wordmark}`}
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {site.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`mono-label text-[12.5px] transition-colors duration-300 ${link}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="group relative sm:hidden">
          <summary
            className={`mono-label cursor-pointer list-none text-[12.5px] [&::-webkit-details-marker]:hidden ${wordmark}`}
          >
            Menu
          </summary>
          <nav className="absolute right-0 z-10 mt-3 flex w-52 flex-col gap-4 rounded-xl border border-muted bg-surface p-5 shadow-lg">
            {site.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="mono-label text-[12.5px] text-body transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </Container>
    </header>
  );
}
