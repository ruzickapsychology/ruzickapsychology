"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import styles from "./styles.module.css";

/** Slow, overlapping wind rhythms; never a short repeating pendulum loop. */
export function Sunlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const simulation = useRef<{ phase: number; elapsed: number } | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    simulation.current ??= { phase: Math.random() * Math.PI * 2, elapsed: 0 };
    const state = simulation.current;
    const { phase } = state;
    let visible = false;
    let frame = 0;
    let lastTime = 0;

    // Unequal rhythms create gentle gusts and lulls, without abrupt
    // random keyframes. Only transform changes; the light and opacity stay still.
    const wind = (t: number) =>
      Math.sin(t * 0.46 + phase) * 0.5 +
      Math.sin(t * 0.19 + phase * 1.7) * 0.32 +
      Math.sin(t * 0.083 + phase * 2.3) * 0.18;
    const initial = wind(0);
    const tick = (now: number) => {
      if (lastTime && now - lastTime < 32) {
        frame = requestAnimationFrame(tick);
        return;
      }
      state.elapsed += lastTime ? Math.min(now - lastTime, 64) / 1000 : 0;
      lastTime = now;
      const { elapsed } = state;
      const breeze = (wind(elapsed) - initial) * Math.min(elapsed / 1.5, 1);
      const lift = (Math.sin(elapsed * 0.127 + phase) - Math.sin(phase)) * 3;
      element.style.setProperty("--wind-x", `${(breeze * 10).toFixed(3)}px`);
      element.style.setProperty("--wind-y", `${lift.toFixed(3)}px`);
      element.style.setProperty(
        "--wind-angle",
        `${(breeze * 2.2).toFixed(4)}deg`,
      );
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      lastTime = 0;
      const playing =
        visible && !document.hidden && !preference.matches && !paused;
      element.dataset.motion = playing ? "playing" : "paused";
      if (playing) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
    };
  }, [paused]);

  return (
    <>
      <div
        ref={ref}
        className={styles.root}
        aria-hidden="true"
        data-slot="sunlight"
      >
        <div className={styles.window} />
        <svg
          className={styles.branch}
          viewBox="-80 -100 800 960"
          fill="currentColor"
          focusable="false"
        >
          <g>
            <path
              d="M602 765C484 654 464 514 393 404S305 213 290-20M445 495C408 438 352 408 272 375M376 369C410 309 454 260 518 217M322 228C268 198 226 145 206 76M477 593C520 533 548 475 552 403M287 57C339 26 362 2 379-29"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path d="M294 80C236 70 220 22 236-31C286-18 310 20 294 80Z" />
            <path d="M305 142C311 85 349 55 401 65C384 113 355 140 305 142Z" />
            <path d="M319 208C267 204 245 175 239 122C293 122 319 155 319 208Z" />
            <path d="M348 291C351 237 383 203 431 199C428 253 396 283 348 291Z" />
            <path d="M374 366C319 351 292 308 301 260C349 279 377 316 374 366Z" />
            <path d="M411 434C420 377 452 350 501 356C482 405 450 429 411 434Z" />
            <path d="M455 524C401 505 379 467 390 418C438 436 459 477 455 524Z" />
            <path d="M496 639C452 626 430 591 431 544C482 557 506 594 496 639Z" />
            <path d="M529 691C541 637 578 614 623 628C600 674 567 694 529 691Z" />
            <path d="M335 405C305 358 266 341 218 360C243 400 284 417 335 405Z" />
            <path d="M287 383C279 330 247 304 203 309C216 353 245 378 287 383Z" />
            <path d="M458 276C421 252 421 216 440 180C474 203 483 238 458 276Z" />
            <path d="M480 255C482 205 516 170 567 173C550 216 520 244 480 255Z" />
            <path d="M526 494C494 456 495 413 526 380C555 424 552 459 526 494Z" />
            <path d="M546 444C559 395 595 372 641 387C614 429 583 447 546 444Z" />
            <path d="M232 137C190 140 153 113 145 70C193 67 224 91 232 137Z" />
            <path d="M209 88C178 60 178 22 201-11C230 23 233 55 209 88Z" />
          </g>
        </svg>
      </div>
      <Button
        variant="quiet"
        size="icon"
        className={styles.motionToggle}
        aria-label={paused ? "Resume shadow motion" : "Pause shadow motion"}
        onClick={() => setPaused(!paused)}
      >
        <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
      </Button>
    </>
  );
}
