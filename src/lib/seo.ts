import type { Metadata } from "next";
import type { WithContext, PhysiciansOffice } from "schema-dts";
import type { SiteSettings } from "@/lib/cms";
import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_LEGAL_NAME,
  SITE_URL,
} from "@/lib/site-defaults";

export const metadataBase = new URL(SITE_URL);

const defaultSocialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
};

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
      images: [defaultSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [defaultSocialImage.url],
    },
  };
}

export function psychologistJsonLd(
  settings: SiteSettings,
): WithContext<PhysiciansOffice> {
  return {
    "@context": "https://schema.org",
    "@type": "PhysiciansOffice",
    name: settings.legalName,
    founder: settings.practitioner,
    email: settings.email,
    telephone: settings.phone,
    url: settings.url,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.line1,
      addressLocality: "Rochester",
      addressRegion: "NY",
      addressCountry: "US",
    },
    medicalSpecialty: "Psychiatric",
    areaServed: settings.areaServed,
    image: `${SITE_URL}/opengraph-image`,
    availableService: [
      { "@type": "MedicalTherapy", name: "Individual Therapy" },
      {
        "@type": "MedicalTherapy",
        name: "Couples Counseling (Imago Relationship Therapy)",
      },
      { "@type": "MedicalTherapy", name: "Perinatal & Postpartum Support" },
      { "@type": "MedicalTherapy", name: "Group Therapy" },
    ],
  };
}
