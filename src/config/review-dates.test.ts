import { describe, expect, it } from "vitest";
import {
  approvalFor,
  formatReviewDate,
  lastReviewedFor,
} from "@/config/review-dates";
import { SPREAD_REVIEW_DATES } from "@/config/review-spread";

describe("approvalFor", () => {
  it("uses the approval on record for each page group", () => {
    expect(approvalFor("/")).toBe("2026-11-14");
    expect(approvalFor("/about")).toBe("2026-11-14");
    expect(approvalFor("/specialties/couples-therapy")).toBe("2026-11-14");
    expect(approvalFor("/specialties/anxiety-therapy")).toBe("2026-11-15");
    expect(approvalFor("/resources")).toBe("2026-11-15");
    expect(approvalFor("/research")).toBe("2026-11-15");
    expect(approvalFor("/research/some-study")).toBe("2026-11-15");
    expect(approvalFor("/specialties/online-therapy")).toBe("2026-11-23");
    expect(approvalFor("/guides/postpartum")).toBe("2026-11-23");
    expect(approvalFor("/guides/postpartum/d-mer")).toBe("2026-11-23");
  });

  it("never dates a review before the page was published", () => {
    expect(approvalFor("/blog/new-post", "2026-11-20")).toBe("2026-11-23");
    expect(approvalFor("/blog/old-post", "2025-06-28")).toBe("2026-11-14");
  });
});

describe("lastReviewedFor (dates spread per user 23 Nov 2026)", () => {
  const entries = Object.entries(SPREAD_REVIEW_DATES);

  it("returns the spread date for a dated page and the approval for any other", () => {
    expect(entries.length).toBeGreaterThan(0);
    for (const [path, date] of entries)
      expect(lastReviewedFor(path)).toBe(date);
    expect(lastReviewedFor("/specialties/not-yet-dated")).toBe("2026-11-14");
    expect(lastReviewedFor("/blog/new-post", "2026-11-20")).toBe("2026-11-23");
  });

  it("picks weekdays inside the window, never after the approval on record", () => {
    for (const [path, date] of entries) {
      expect(new Date(`${date}T12:00:00Z`).getUTCDay(), path).not.toBe(0);
      expect(new Date(`${date}T12:00:00Z`).getUTCDay(), path).not.toBe(6);
      expect(date >= "2026-08-25", path).toBe(true);
      expect(date <= approvalFor(path), path).toBe(true);
    }
  });

  it("keeps the pages first published 18 Nov 2026 within 18-23 Nov", () => {
    const firstPublished18Nov = entries.filter(
      ([p]) =>
        p.startsWith("/guides") ||
        [
          "/specialties/marriage-counseling",
          "/specialties/online-therapy",
          "/specialties/online-postpartum-therapy",
        ].includes(p),
    );
    expect(firstPublished18Nov.length).toBeGreaterThan(0);
    for (const [path, date] of firstPublished18Nov)
      expect(date >= "2026-11-18" && date <= "2026-11-23", path).toBe(true);
  });

  it("formats the visible date without a timezone shift", () => {
    expect(formatReviewDate("2026-11-14")).toBe("November 14, 2026");
  });
});
