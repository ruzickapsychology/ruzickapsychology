export const site = {
  name: "Ruzicka Psychology",
  legalName: "Ruzicka Psychology PLLC",
  practitioner: "Dr. Christina Ruzicka, Psy.D.",
  email: "Christina@ruzickapsychology.com",
  phone: "(646) 123-1599",
  address: {
    line1: "1577 South Ave",
    line2: "Rochester, NY 14620",
    note: "Virtual appointments also available",
  },
  hours: [
    "Mon – Thu · 9am – 5pm",
    "Friday · Virtual only",
    "Evenings by request",
  ],
  portalUrl: "https://christina-ruzicka.clientsecure.me",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com",
  tagline:
    "Evidence-based psychotherapy tailored to your unique story. Specialized support for couples seeking connection, and women navigating maternal mental health and postpartum anxiety.",
  areaServed: ["Rochester, NY", "Monroe County, NY"],
  nav: [
    { label: "About", href: "/about" },
    { label: "Specialties", href: "/specialties" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
