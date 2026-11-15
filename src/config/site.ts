import { publicEnv } from "@/config/env";

export const SITE_URL = publicEnv.siteUrl;

export const SITE_LEGAL_NAME = "Ruzicka Psychology PLLC";

/**
 * Dr. Christina Ruzicka's psychologist license. Checked on the NYSED Office of
 * the Professions verification search on 14 Nov 2026: Psychology (068),
 * licensed June 14, 2021, status Registered, registered through Oct 31, 2029.
 */
export const PRACTITIONER_LICENSE = {
  name: "New York Psychologist License",
  label: "New York License 024357",
  number: "024357",
  issuer: "New York State Education Department, Office of the Professions",
  issuerUrl: "https://www.op.nysed.gov/",
} as const;

export const SITE_DEFAULT_DESCRIPTION =
  "Evidence-based psychotherapy in Rochester, New York for adults and couples.";

export const MAIN_NAV = [
  { label: "About", href: "/about" },
  { label: "Specialties", href: "/specialties" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_NAV = [
  { label: "About", href: "/about" },
  { label: "Specialties", href: "/specialties" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Resources", href: "/resources" },
  { label: "Research", href: "/research" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
] as const;
