import { describe, expect, it } from "vitest";
import {
  getAvailabilityBadgeMessages,
  getAvailabilityContext,
  getAvailabilityCtaContent,
  getAvailabilityStateCopy,
  initialAvailabilityBadgeMessages,
  initialAvailabilityMessaging,
  normalizeAvailabilityStatus,
} from "./availability";

describe("availability helpers", () => {
  it("normalizes accepting values without falling through to waitlist", () => {
    expect(normalizeAvailabilityStatus("accepting")).toBe("accepting");
    expect(normalizeAvailabilityStatus("Accepting new patients")).toBe(
      "accepting",
    );
    expect(normalizeAvailabilityStatus(undefined)).toBe("accepting");
  });

  it("does not return alternate copy for accepting status", () => {
    const copy = getAvailabilityStateCopy("accepting", {
      waitlist: { heroCta: "Custom waitlist" },
    });

    expect(copy).toBeNull();
  });

  it("selects the matching Sanity-owned message set", () => {
    const copy = getAvailabilityStateCopy("waitlist", {
      waitlist: {
        ...initialAvailabilityMessaging.waitlist,
        heroCta: "Custom waitlist",
        pricingCtaLabel: "Custom pricing waitlist",
      },
    });

    expect(copy).toMatchObject({
      heroCta: "Custom waitlist",
      pricingCtaLabel: "Custom pricing waitlist",
    });
  });

  it("returns null when alternate-state copy is missing from Sanity", () => {
    expect(getAvailabilityStateCopy("waitlist", null)).toBeNull();
  });

  it("provides one normalized context for page availability decisions", () => {
    expect(
      getAvailabilityContext("full", initialAvailabilityMessaging),
    ).toMatchObject({
      status: "closed",
      isDefault: false,
      isWaitlist: false,
      isClosed: true,
    });
  });

  it("resolves shared CTA content by status and placement", () => {
    const defaults = {
      heading: "Default heading",
      body: "Default body",
      label: "Default label",
    };

    expect(
      getAvailabilityCtaContent({
        status: "accepting",
        messaging: initialAvailabilityMessaging,
        defaults,
      }),
    ).toEqual(defaults);
    expect(
      getAvailabilityCtaContent({
        status: "waitlist",
        messaging: initialAvailabilityMessaging,
        defaults,
        placement: "pricing",
      }),
    ).toMatchObject({
      heading: initialAvailabilityMessaging.waitlist.pricingCtaHeading,
      label: initialAvailabilityMessaging.waitlist.pricingCtaLabel,
    });
    expect(
      getAvailabilityCtaContent({
        status: "closed",
        messaging: initialAvailabilityMessaging,
        defaults,
      }).label,
    ).toBeUndefined();
  });

  it("selects the matching Sanity-owned badge message set", () => {
    expect(
      getAvailabilityBadgeMessages(
        "waitlist",
        initialAvailabilityBadgeMessages,
      ),
    ).toEqual(["JOIN THE WAITLIST", "EMAIL FOR AVAILABILITY"]);
    expect(
      getAvailabilityBadgeMessages("closed", initialAvailabilityBadgeMessages),
    ).toEqual(["PRACTICE CURRENTLY FULL", "PLEASE CHECK BACK SOON"]);
  });

  it("returns null when badge messages are missing from Sanity", () => {
    expect(getAvailabilityBadgeMessages("waitlist", null)).toBeNull();
  });
});
