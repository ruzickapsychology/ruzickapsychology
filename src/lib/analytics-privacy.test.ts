import { describe, expect, it } from "vitest";
import { sanitizeAnalyticsEvent } from "./analytics-privacy";

describe("analytics URL privacy", () => {
  it("removes contact interest, arbitrary personal data, credentials and fragments", () => {
    const event = {
      type: "event",
      url: "https://visitor:secret@example.com/contact?interest=couples-therapy&email=private@example.com#message",
    };
    expect(sanitizeAnalyticsEvent(event)).toEqual({
      type: "event",
      url: "https://example.com/contact",
    });
    expect(event.url).toContain("private@example.com");
  });

  it("preserves performance event fields and a public page path", () => {
    expect(
      sanitizeAnalyticsEvent({
        type: "vital",
        route: "/specialties/[slug]",
        url: "https://example.com/specialties/couples-therapy?utm_source=directory",
      }),
    ).toEqual({
      type: "vital",
      route: "/specialties/[slug]",
      url: "https://example.com/specialties/couples-therapy",
    });
  });

  it.each([
    "https://example.com/studio",
    "https://example.com/studio/structure/post;private?draft=1",
    "not a URL",
    "mailto:private@example.com",
  ])("drops Studio and invalid events: %s", (url) => {
    expect(sanitizeAnalyticsEvent({ url })).toBeNull();
  });
});
