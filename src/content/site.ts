export const site = {
  name: "Ruzicka Psychology",
  legalName: "Ruzicka Psychology PLLC",
  practitioner: "Dr. Christina Ruzicka, Psy.D.",
  email: "christina@ruzickapsychology.com",
  portalUrl: "https://christina-ruzicka.clientsecure.me",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ruzickapsychology.com",
  tagline:
    "Evidence-based psychotherapy tailored to your unique story. Specialized support for couples seeking connection, and women navigating maternal mental health and postpartum anxiety.",
  areaServed: ["Rochester, NY", "Monroe County, NY"],
  nav: [
    { label: "About", href: "/about" },
    { label: "Specialties", href: "/#services" },
    {
      label: "Client Portal",
      href: "https://christina-ruzicka.clientsecure.me",
      external: true,
    },
    { label: "Contact", href: "/contact" },
  ],
} as const;
