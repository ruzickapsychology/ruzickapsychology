import { describe, expect, it } from "vitest";
import { formatReviewDate, lastReviewedFor } from "@/config/review-dates";

describe("lastReviewedFor", () => {
  it("uses the approval on record for each page group", () => {
    expect(lastReviewedFor("/")).toBe("2026-11-14");
    expect(lastReviewedFor("/about")).toBe("2026-11-14");
    expect(lastReviewedFor("/specialties/couples-therapy")).toBe("2026-11-14");
    expect(lastReviewedFor("/specialties/anxiety-therapy")).toBe("2026-11-15");
    expect(lastReviewedFor("/resources")).toBe("2026-11-15");
    expect(lastReviewedFor("/research")).toBe("2026-11-15");
    expect(lastReviewedFor("/research/some-study")).toBe("2026-11-15");
    expect(lastReviewedFor("/specialties/online-therapy")).toBe("2026-11-23");
    expect(lastReviewedFor("/guides/postpartum")).toBe("2026-11-23");
    expect(lastReviewedFor("/guides/postpartum/d-mer")).toBe("2026-11-23");
  });

  it("never dates a review before the page was published", () => {
    expect(lastReviewedFor("/blog/new-post", "2026-11-20")).toBe("2026-11-23");
    expect(lastReviewedFor("/blog/old-post", "2025-06-28")).toBe("2026-11-14");
  });

  it("formats the visible date without a timezone shift", () => {
    expect(formatReviewDate("2026-11-14")).toBe("November 14, 2026");
  });
});
