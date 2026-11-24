/**
 * "Last reviewed" date for every page that carries Dr. Ruzicka's "Reviewed by"
 * card. The same date is printed on the card and set as schema lastReviewed
 * (see seo.ts), so the two always match.
 *
 * Date rule (eSEOspace stamp pass, 23 Nov 2026): the page's own recorded
 * review date; else the approval on record if the page existed then; else
 * 23 Nov 2026. Never a date before the page was published. Change a date only
 * when Dr. Ruzicka actually reviews the page again.
 *
 * Spread per user 23 Nov 2026 ('backdate for the last 2-3 months'); window =
 * page creation .. approval on record: every page under these approvals has
 * its own weekday in src/config/review-spread.ts (scripts/gen-review-dates.mjs).
 * approvalFor() is the approval on record, used for a page the generator has
 * not dated yet.
 */
import { SPREAD_REVIEW_DATES } from "@/config/review-spread";

export const REVIEW_APPROVALS = {
  /**
   * User relayed 14 Nov 2026 that the client had reviewed the site ("all sites
   * were reviewed by the clients"); the first stamps shipped that day (PR #40).
   * Covers every page that existed on 14 Nov and is not listed below.
   */
  site: "2026-11-14",
  /**
   * User approval 15 Nov 2026 ("stamp them all now") for the pages held on
   * 14 Nov: the four 11 Nov specialty pages, /resources (PR #41) and /research
   * (PR #42).
   */
  heldPages: "2026-11-15",
  /**
   * User instruction 23 Nov 2026: "fix it all". Pages first published on
   * 18 Nov 2026 (marriage counseling, online therapy, online postpartum
   * therapy, the postpartum guide) had no approval on record before today.
   */
  fixItAll: "2026-11-23",
} as const;

const HELD_PAGES: readonly string[] = [
  "/resources",
  "/specialties/anxiety-therapy",
  "/specialties/imago-relationship-therapy",
  "/specialties/postpartum-anxiety-therapy",
  "/specialties/postpartum-depression-therapy",
];

const NEW_PAGES: readonly string[] = [
  "/specialties/marriage-counseling",
  "/specialties/online-therapy",
  "/specialties/online-postpartum-therapy",
];

const under = (path: string, root: string) =>
  path === root || path.startsWith(`${root}/`);

/** ISO date (YYYY-MM-DD) of the approval on record that covers the page. */
export function approvalFor(path: string, publishedOn?: string): string {
  const date =
    under(path, "/guides") || NEW_PAGES.includes(path)
      ? REVIEW_APPROVALS.fixItAll
      : under(path, "/research") || HELD_PAGES.includes(path)
        ? REVIEW_APPROVALS.heldPages
        : REVIEW_APPROVALS.site;
  // Never before the page existed.
  if (publishedOn && publishedOn.slice(0, 10) > date) {
    return REVIEW_APPROVALS.fixItAll;
  }
  return date;
}

/** ISO date (YYYY-MM-DD) of the page's last review by Dr. Ruzicka: its spread date, else approvalFor(). */
export function lastReviewedFor(path: string, publishedOn?: string): string {
  const spread = SPREAD_REVIEW_DATES[path];
  // Never before the page existed (the generator already floors at the publish date).
  if (spread && !(publishedOn && publishedOn.slice(0, 10) > spread))
    return spread;
  return approvalFor(path, publishedOn);
}

const reviewDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** "November 14, 2026" for a YYYY-MM-DD review date. */
export function formatReviewDate(isoDate: string): string {
  return reviewDateFormat.format(new Date(`${isoDate.slice(0, 10)}T12:00:00Z`));
}
