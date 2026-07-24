import { getCliClient } from "sanity/cli";

import {
  initialAvailabilityBadgeMessages,
  initialAvailabilityMessaging,
} from "../src/config/availability";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-24";
const client = getCliClient({ apiVersion }).withConfig({ useCdn: false });

type AvailabilityStateInput = Record<string, unknown> | null | undefined;

type SiteSettingsDocument = {
  availabilityBadgeMessages?: {
    accepting?: AvailabilityStateInput;
    waitlist?: AvailabilityStateInput;
    closed?: AvailabilityStateInput;
  } | null;
  availabilityMessaging?: {
    waitlist?: AvailabilityStateInput;
    closed?: AvailabilityStateInput;
  } | null;
};

function stateString(state: AvailabilityStateInput, field: string) {
  const value = state?.[field];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function badgeMessages(
  state: AvailabilityStateInput,
  status: "accepting" | "waitlist" | "closed",
) {
  const initial = initialAvailabilityBadgeMessages[status];

  return {
    line1: stateString(state, "line1") ?? initial.line1,
    line2: stateString(state, "line2") ?? initial.line2,
  };
}

function waitlistMessaging(state: AvailabilityStateInput) {
  const initial = initialAvailabilityMessaging.waitlist;
  const heroCta =
    stateString(state, "heroCta") ??
    stateString(state, "ctaLabel") ??
    initial.heroCta;
  const ctaHeading = stateString(state, "ctaHeading") ?? initial.ctaHeading;
  const ctaBody = stateString(state, "ctaBody") ?? initial.ctaBody;

  return {
    heroCta,
    contactHeading:
      stateString(state, "contactHeading") ?? initial.contactHeading,
    contactIntro: stateString(state, "contactIntro") ?? initial.contactIntro,
    ctaHeading,
    ctaBody,
    homeCtaLabel:
      stateString(state, "homeCtaLabel") ??
      stateString(state, "ctaLabel") ??
      heroCta,
    pricingCtaHeading:
      stateString(state, "pricingCtaHeading") ?? initial.pricingCtaHeading,
    pricingCtaBody:
      stateString(state, "pricingCtaBody") ??
      stateString(state, "ctaBody") ??
      initial.pricingCtaBody,
    pricingCtaLabel:
      stateString(state, "pricingCtaLabel") ??
      stateString(state, "ctaLabel") ??
      heroCta,
  };
}

function closedMessaging(state: AvailabilityStateInput) {
  const initial = initialAvailabilityMessaging.closed;

  return {
    heroCta:
      stateString(state, "heroCta") ??
      stateString(state, "ctaLabel") ??
      initial.heroCta,
    contactHeading:
      stateString(state, "contactHeading") ?? initial.contactHeading,
    contactIntro: stateString(state, "contactIntro") ?? initial.contactIntro,
    ctaHeading: stateString(state, "ctaHeading") ?? initial.ctaHeading,
    ctaBody: stateString(state, "ctaBody") ?? initial.ctaBody,
    pricingCtaHeading:
      stateString(state, "pricingCtaHeading") ?? initial.pricingCtaHeading,
    pricingCtaBody:
      stateString(state, "pricingCtaBody") ??
      stateString(state, "ctaBody") ??
      initial.pricingCtaBody,
    panelHeading: stateString(state, "panelHeading") ?? initial.panelHeading,
    panelBody: stateString(state, "panelBody") ?? initial.panelBody,
    contactMethodsLabel:
      stateString(state, "contactMethodsLabel") ?? initial.contactMethodsLabel,
  };
}

async function main() {
  const siteSettings = await client.fetch<SiteSettingsDocument | null>(
    /* groq */ `*[_id == "siteSettings"][0]{availabilityBadgeMessages, availabilityMessaging}`,
  );
  const currentBadgeMessages = siteSettings?.availabilityBadgeMessages;
  const currentMessaging = siteSettings?.availabilityMessaging;

  await client
    .patch("siteSettings")
    .setIfMissing({ availabilityStatus: "accepting" })
    .set({
      availabilityBadgeMessages: {
        accepting: badgeMessages(currentBadgeMessages?.accepting, "accepting"),
        waitlist: badgeMessages(currentBadgeMessages?.waitlist, "waitlist"),
        closed: badgeMessages(currentBadgeMessages?.closed, "closed"),
      },
      availabilityMessaging: {
        waitlist: waitlistMessaging(currentMessaging?.waitlist),
        closed: closedMessaging(currentMessaging?.closed),
      },
    })
    .commit();

  console.log("[sanity] Availability messaging is present in siteSettings.");
}

main().catch((error) => {
  console.error(
    "[sanity] Failed to backfill availability messaging:",
    error instanceof Error ? error.message : "Unknown error",
  );
  process.exit(1);
});
