export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ruzickapsychology.com";

export const SITE_LEGAL_NAME = "Ruzicka Psychology PLLC";

export const SITE_DEFAULT_DESCRIPTION =
  "Evidence-based psychotherapy in Rochester, New York for individuals, couples, and families.";

export const MAIN_NAV = [
  { label: "About", href: "/about" },
  { label: "Specialties", href: "/specialties" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_NAV = [
  { label: "About", href: "/about" },
  { label: "Specialties", href: "/specialties" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;
