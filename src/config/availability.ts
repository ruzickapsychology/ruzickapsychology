export const availabilityStatuses = [
  "accepting",
  "waitlist",
  "closed",
] as const;

export type AvailabilityStatus = (typeof availabilityStatuses)[number];

export const DEFAULT_AVAILABILITY_STATUS: AvailabilityStatus = "accepting";

export type AvailabilityBadgeMessageSet = {
  line1: string;
  line2: string;
};

export type AvailabilityBadgeMessages = Record<
  AvailabilityStatus,
  AvailabilityBadgeMessageSet
>;

export type WaitlistAvailabilityMessaging = {
  heroCta: string;
  contactHeading: string;
  contactIntro: string;
  ctaHeading: string;
  ctaBody: string;
  homeCtaLabel: string;
  pricingCtaHeading: string;
  pricingCtaBody: string;
  pricingCtaLabel: string;
};

export type ClosedAvailabilityMessaging = {
  heroCta: string;
  contactHeading: string;
  contactIntro: string;
  ctaHeading: string;
  ctaBody: string;
  pricingCtaHeading: string;
  pricingCtaBody: string;
  panelHeading: string;
  panelBody: string;
  contactMethodsLabel: string;
};

export type AvailabilityMessaging = {
  waitlist: WaitlistAvailabilityMessaging;
  closed: ClosedAvailabilityMessaging;
};

export type AvailabilityMessagingInput = {
  waitlist?: Partial<WaitlistAvailabilityMessaging> | null;
  closed?: Partial<ClosedAvailabilityMessaging> | null;
} | null;

export const initialAvailabilityBadgeMessages = {
  accepting: {
    line1: "ACCEPTING NEW CLIENTS",
    line2: "IN PERSON OR VIRTUAL",
  },
  waitlist: {
    line1: "JOIN THE WAITLIST",
    line2: "EMAIL FOR AVAILABILITY",
  },
  closed: {
    line1: "PRACTICE CURRENTLY FULL",
    line2: "PLEASE CHECK BACK SOON",
  },
} as const satisfies AvailabilityBadgeMessages;

const availabilityStatusSet = new Set<AvailabilityStatus>(availabilityStatuses);

const availabilityStatusAliases: Record<string, AvailabilityStatus> = {
  accepting: "accepting",
  "accepting-new-clients": "accepting",
  "accepting-new-patients": "accepting",
  open: "accepting",
  waitlist: "waitlist",
  "waitlist-only": "waitlist",
  "not-accepting": "closed",
  "not-accepting-inquiries": "closed",
  closed: "closed",
  full: "closed",
};

export function normalizeAvailabilityStatus(
  status?: unknown,
): AvailabilityStatus {
  if (typeof status !== "string") return DEFAULT_AVAILABILITY_STATUS;

  const normalized = status
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z-]/g, "");

  if (availabilityStatusSet.has(normalized as AvailabilityStatus)) {
    return normalized as AvailabilityStatus;
  }

  return availabilityStatusAliases[normalized] ?? DEFAULT_AVAILABILITY_STATUS;
}

export const initialAvailabilityMessaging = {
  waitlist: {
    heroCta: "Join the waitlist",
    contactHeading: "Join the Waitlist",
    contactIntro:
      "Dr. Ruzicka is currently booked, but you may use this form to inquire about the waitlist. Availability can change, especially for couples therapy, which may be shorter-term than individual therapy.",
    ctaHeading: "Interested in working together?",
    ctaBody:
      "Current openings are limited, but you are welcome to reach out about the waitlist.",
    homeCtaLabel: "Join the waitlist",
    pricingCtaHeading: "Have a question about fit or fees?",
    pricingCtaBody:
      "Current openings are limited, but you are welcome to reach out about the waitlist.",
    pricingCtaLabel: "Join the waitlist",
  },
  closed: {
    heroCta: "Learn about specialties",
    contactHeading: "Current Availability",
    contactIntro:
      "Dr. Ruzicka's practice is currently full and she is not accepting new client inquiries or waitlist requests at this time. Thank you for understanding.",
    ctaHeading: "Practice currently full",
    ctaBody:
      "Dr. Ruzicka is not accepting new client inquiries or waitlist requests at this time. Please check back for future availability.",
    pricingCtaHeading: "Practice currently full",
    pricingCtaBody:
      "Dr. Ruzicka is not accepting new client inquiries or waitlist requests at this time. Please check back for future availability.",
    panelHeading: "Not accepting inquiries",
    panelBody:
      "Current clients may continue to use the Client Portal. Please check back for future availability.",
    contactMethodsLabel: "For current clients or administrative questions:",
  },
} as const satisfies AvailabilityMessaging;

export function getAvailabilityStateCopy(
  status?: unknown,
  messaging?: AvailabilityMessagingInput,
) {
  const availabilityStatus = normalizeAvailabilityStatus(status);

  if (availabilityStatus === "waitlist") return messaging?.waitlist ?? null;
  if (availabilityStatus === "closed") return messaging?.closed ?? null;

  return null;
}

export function getAvailabilityContext(
  status?: unknown,
  messaging?: AvailabilityMessagingInput,
) {
  const availabilityStatus = normalizeAvailabilityStatus(status);

  return {
    status: availabilityStatus,
    copy: getAvailabilityStateCopy(availabilityStatus, messaging),
    isDefault: availabilityStatus === DEFAULT_AVAILABILITY_STATUS,
    isWaitlist: availabilityStatus === "waitlist",
    isClosed: availabilityStatus === "closed",
  } as const;
}

export function getAvailabilityCtaContent({
  status,
  messaging,
  defaults,
  placement = "standard",
}: {
  status?: unknown;
  messaging?: AvailabilityMessagingInput;
  defaults: {
    heading?: string | null;
    body?: string | null;
    label?: string | null;
  };
  placement?: "standard" | "pricing";
}) {
  const availability = getAvailabilityContext(status, messaging);

  if (availability.isDefault) return defaults;

  if (availability.isWaitlist) {
    const copy = messaging?.waitlist;
    return placement === "pricing"
      ? {
          heading: copy?.pricingCtaHeading,
          body: copy?.pricingCtaBody,
          label: copy?.pricingCtaLabel,
        }
      : {
          heading: copy?.ctaHeading,
          body: copy?.ctaBody,
          label: copy?.homeCtaLabel,
        };
  }

  const copy = messaging?.closed;
  if (placement === "pricing") {
    return {
      heading: copy?.pricingCtaHeading,
      body: copy?.pricingCtaBody,
      label: undefined,
    };
  }

  return {
    heading: copy?.ctaHeading,
    body: copy?.ctaBody,
    label: undefined,
  };
}

export function getAvailabilityBadgeMessages(
  status?: unknown,
  badgeMessages?: Partial<AvailabilityBadgeMessages> | null,
) {
  const availabilityStatus = normalizeAvailabilityStatus(status);
  const messages = badgeMessages?.[availabilityStatus];
  if (!messages?.line1 || !messages.line2) return null;

  return [messages.line1, messages.line2] as const;
}
