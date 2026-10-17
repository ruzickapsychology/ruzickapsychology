"use client";

import { useEffect } from "react";

/** Coordinates touch-only motion across all specialty cards on the page. */
export function SpecialtyMotion() {
  useEffect(() => {
    const touch = window.matchMedia("(hover: none)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active: Element | null = null;
    let frame = 0;

    function update() {
      frame = 0;
      let next: Element | null = null;
      let nearest = Infinity;
      if (touch.matches && !reduced.matches && !document.hidden) {
        const headerBottom =
          document
            .querySelector('[data-slot="site-header"]')
            ?.getBoundingClientRect().bottom ?? 0;
        for (const glyph of document.querySelectorAll(
          '[data-slot="specialty-glyph"]',
        )) {
          const rect = glyph.getBoundingClientRect();
          if (rect.top < headerBottom || rect.bottom > window.innerHeight)
            continue;
          const distance = Math.abs(
            (rect.top + rect.bottom) / 2 - window.innerHeight * 0.4,
          );
          if (distance < nearest) {
            nearest = distance;
            next = glyph.closest('[data-slot="specialty-card"]');
          }
        }
      }
      if (next === active) return;
      active?.removeAttribute("data-motion-active");
      next?.setAttribute("data-motion-active", "true");
      active = next;
    }

    function schedule() {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        update();
        return;
      }
      if (!frame) frame = requestAnimationFrame(update);
    }

    const observer = new MutationObserver(schedule);
    observer.observe(document.querySelector("main") ?? document.body, {
      childList: true,
      subtree: true,
    });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    touch.addEventListener("change", schedule);
    reduced.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      touch.removeEventListener("change", schedule);
      reduced.removeEventListener("change", schedule);
      active?.removeAttribute("data-motion-active");
    };
  }, []);
  return null;
}
