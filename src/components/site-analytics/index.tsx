"use client";

import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { sanitizeAnalyticsEvent } from "@/lib/analytics-privacy";

/** Nonvisual instrumentation, deliberately scoped to the public site layout. */
export function SiteAnalytics() {
  return (
    <>
      <Analytics beforeSend={sanitizeAnalyticsEvent} />
      <SpeedInsights beforeSend={sanitizeAnalyticsEvent} />
      {/* eSEOspace phone-tap counter: one anonymous count per tel: link tap. */}
      <Script src="/eseo-calls.js" strategy="afterInteractive" />
    </>
  );
}
