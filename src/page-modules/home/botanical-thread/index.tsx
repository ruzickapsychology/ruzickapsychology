"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./styles.module.css";

/** A decorative, page-length drawing; never changes reading or tab order. */
export function BotanicalThread({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const drawing = useRef<SVGSVGElement>(null);
  const stem = useRef<SVGPathElement>(null);
  const flower = useRef<SVGGElement>(null);

  useEffect(() => {
    const element = root.current;
    const svg = drawing.current;
    const path = stem.current;
    const bloom = flower.current;
    if (!element || !svg || !path || !bloom) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let length = 0;
    const update = () => {
      frame = 0;
      const bounds = element.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, (innerHeight * 0.86 - bounds.top) / bounds.height),
      );
      path.style.strokeDashoffset = `${motion.matches ? 0 : length * (1 - progress)}`;
      bloom.style.opacity = motion.matches
        ? "1"
        : `${Math.min(1, Math.max(0, (progress - 0.88) / 0.1))}`;
    };
    const queueUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      const { width: w, height: h } = element.getBoundingClientRect();
      const mobile = w < 768;
      const x = mobile ? 6 : Math.max(24, (w - 1280) / 4);
      const spread = mobile ? 3 : Math.min(22, x - 8);
      const end = h - 100;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      path.setAttribute(
        "d",
        `M ${x} 0 C ${x - spread} ${h * 0.12}, ${x + spread} ${h * 0.2}, ${x} ${h * 0.3} C ${x - spread} ${h * 0.38}, ${x - spread} ${h * 0.45}, ${x} ${h * 0.5} C ${x + spread * 2} ${h * 0.48}, ${x + spread * 2} ${h * 0.44}, ${x} ${h * 0.5} C ${x - spread} ${h * 0.56}, ${x + spread} ${h * 0.68}, ${x} ${h * 0.76} C ${x - spread} ${h * 0.85}, ${x} ${end + 48}, ${w * 0.21} ${end + 48} C ${w * 0.36} ${end + 48}, ${w * 0.5} ${end + 60}, ${w * 0.5} ${end}`,
      );
      bloom.setAttribute("transform", `translate(${w / 2} ${end})`);
      length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      element.dataset.drawn = "true";
      update();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("scroll", queueUpdate, { passive: true });
    motion.addEventListener("change", queueUpdate);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", queueUpdate);
      motion.removeEventListener("change", queueUpdate);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={root} className={styles.root} data-slot="botanical-thread">
      {children}
      <div className={styles.finish} aria-hidden="true" />
      <svg
        ref={drawing}
        className={styles.drawing}
        viewBox="0 0 1440 2000"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          ref={stem}
          className={styles.stem}
          d="M 24 0 C 8 600 40 1000 24 1400 S 60 1948 300 1948 S 720 1960 720 1900"
        />
        <g
          ref={flower}
          transform="translate(720 1900)"
          className={styles.flower}
        >
          <FlowerDrawing />
        </g>
      </svg>
      <svg
        className={styles.fallback}
        viewBox="-50 -150 100 150"
        aria-hidden="true"
        focusable="false"
      >
        <FlowerDrawing />
      </svg>
    </div>
  );
}

function FlowerDrawing() {
  return (
    <>
      <path d="M 0 0 C -3 -21 4 -65 0 -93 M -1 -13 C -11 -35 -34 -35 -43 -40 C -39 -19 -19 -16 -1 -13 M 1 -28 C 16 -49 32 -47 43 -53 C 40 -34 20 -31 1 -28" />
      <path
        transform="translate(0 -28)"
        d="M 0 -66 C -10 -82 -13 -102 -4 -111 C 1 -116 9 -111 10 -105 C 12 -93 5 -79 0 -66 C 13 -86 22 -100 31 -94 C 44 -85 26 -73 0 -66 C 23 -72 44 -73 45 -60 C 43 -46 24 -53 0 -66 C 19 -51 30 -34 19 -30 C 8 -26 2 -46 0 -66 C -1 -45 -8 -29 -19 -34 C -29 -41 -14 -55 0 -66 C -22 -51 -42 -48 -44 -62 C -43 -76 -21 -73 0 -66 C -24 -77 -34 -88 -24 -98 C -12 -106 -6 -82 0 -66 Z"
      />
      <ellipse cx="0" cy="-94" rx="5" ry="6" />
    </>
  );
}
