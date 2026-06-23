import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadataBase = new URL(site.url);

export function pageMetadata({
  title,
  description = site.tagline,
  path = "/",
}: {
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const fullTitle = title ? `${title} — ${site.legalName}` : site.legalName;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: site.legalName,
      type: "website",
    },
  };
}

export function psychologistJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Psychologist",
    name: site.legalName,
    founder: site.practitioner,
    email: site.email,
    url: site.url,
    medicalSpecialty: "Psychiatric",
    areaServed: site.areaServed,
    availableService: [
      { "@type": "MedicalTherapy", name: "Individual Therapy" },
      { "@type": "MedicalTherapy", name: "Couples Counseling (Imago Relationship Therapy)" },
      { "@type": "MedicalTherapy", name: "Perinatal & Postpartum Support" },
      { "@type": "MedicalTherapy", name: "Group Therapy" },
    ],
  };
}
