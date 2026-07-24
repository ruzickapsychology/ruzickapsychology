import { publicEnv } from "@/config/env";

export const SITE_URL = publicEnv.siteUrl;

export const SITE_LEGAL_NAME = "Ruzicka Psychology PLLC";

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
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
] as const;
