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

/**
 * Office location for structured data. OpenStreetMap geocode of 1577 South
 * Avenue, Rochester, NY 14620 (Upper Mount Hope), checked 18 Nov 2026.
 */
export const PRACTICE_GEO = { latitude: 43.1245, longitude: -77.6147 } as const;

/**
 * Nearby areas named on the home and contact pages. Drive times are OSRM
 * free-flow estimates from the office, checked 18 Nov 2026: Highland Park,
 * the South Wedge, Swillburg, the University of Rochester and Brighton are
 * 4-6 minutes away; Pittsford, Henrietta and Penfield 12-14 minutes.
 */
export const PRACTICE_NEARBY =
  "The office is in the Upper Mount Hope neighborhood, a few minutes from Highland Park, the South Wedge, Swillburg, the University of Rochester and Brighton, and about 15 minutes from Pittsford, Henrietta and Penfield.";

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
