import {
  DEFAULT_AVAILABILITY_STATUS,
  initialAvailabilityBadgeMessages,
  initialAvailabilityMessaging,
} from "../config/availability";

export const site = {
  name: "Ruzicka Psychology",
  legalName: "Ruzicka Psychology PLLC",
  practitioner: "Dr. Christina Ruzicka, Psy.D.",
  email: "Christina@ruzickapsychology.com",
  phone: "(585) 667-0970",
  address: {
    streetAddress: "1577 South Avenue",
    addressLocality: "Rochester",
    addressRegion: "NY",
    postalCode: "14620",
    addressCountry: "US",
    note: "Virtual appointments also available",
  },
  hours: [
    "Mon – Thu · 9am – 5pm",
    "Friday · Virtual only",
    "Evenings by request",
  ],
  portalUrl: "https://christina-ruzicka.clientsecure.me",
  availabilityStatus: DEFAULT_AVAILABILITY_STATUS,
  availabilityBadgeMessages: initialAvailabilityBadgeMessages,
  availabilityMessaging: initialAvailabilityMessaging,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com",
  tagline:
    "Evidence-based psychotherapy tailored to your unique story. Specialized support for couples seeking connection, and women and parents navigating perinatal mental health and postpartum anxiety.",
  areaServed: ["Rochester, NY", "Monroe County, NY"],
  externalProfiles: [
    {
      label: "Psychology Today",
      url: "https://www.psychologytoday.com/us/therapists/christina-ruzicka-rochester-ny/912736",
    },
    {
      label: "NPI Profile",
      url: "https://npiprofile.com/npi/1831638501",
    },
  ],
  nav: [
    { label: "About", href: "/about" },
    { label: "Specialties", href: "/specialties" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
