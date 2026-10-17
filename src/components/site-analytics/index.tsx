"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { sanitizeAnalyticsEvent } from "@/lib/analytics-privacy";

/** Nonvisual instrumentation, deliberately scoped to the public site layout. */
export function SiteAnalytics() {
  return (
    <>
      <Analytics beforeSend={sanitizeAnalyticsEvent} />
      <SpeedInsights beforeSend={sanitizeAnalyticsEvent} />
    </>
  );
}
