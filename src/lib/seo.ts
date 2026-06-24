import type { Metadata } from "next";
import type { SiteSettings } from "@/lib/cms";
import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_LEGAL_NAME,
  SITE_URL,
} from "@/lib/site-defaults";

export const metadataBase = new URL(SITE_URL);

export function pageMetadata({
  title,
  description = SITE_DEFAULT_DESCRIPTION,
  path = "/",
}: {
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const fullTitle = title ? `${title} — ${SITE_LEGAL_NAME}` : SITE_LEGAL_NAME;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_LEGAL_NAME,
      type: "website",
    },
  };
}

export function psychologistJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Psychologist",
    name: settings.legalName,
    founder: settings.practitioner,
    email: settings.email,
    url: settings.url,
    medicalSpecialty: "Psychiatric",
    areaServed: settings.areaServed,
    availableService: [
      { "@type": "MedicalTherapy", name: "Individual Therapy" },
      { "@type": "MedicalTherapy", name: "Couples Counseling (Imago Relationship Therapy)" },
      { "@type": "MedicalTherapy", name: "Perinatal & Postpartum Support" },
      { "@type": "MedicalTherapy", name: "Group Therapy" },
    ],
  };
}
