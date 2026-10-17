import type { Metadata } from "next";
import type {
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  Graph,
  Service,
  WithContext,
} from "schema-dts";
import type { ServicePageContent, SiteSettings } from "@/data/cms";
import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_LEGAL_NAME,
  SITE_URL,
} from "@/config/site";

export const metadataBase = new URL(SITE_URL);

const defaultSocialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
};

// Use the public-facing name in page titles; retain the legal identity elsewhere.
const titleBrand = "Ruzicka Psychology";

// Search copy is code-owned; CMS headlines and excerpts remain visible on articles.
const articleTitles: Readonly<Record<string, string>> = {
  "why-we-choose-the-partners-we-do-the-surprising-psychology-behind-romantic-attraction":
    "Why We Choose Our Partners: The Psychology of Attraction",
  "beyond-the-buzzword-what-does-doing-the-work-actually-mean-in-therapy":
    'What Does "Doing the Work" Mean in Therapy?',
};

const articleDescriptions: Readonly<Record<string, string>> = {
  "why-we-choose-the-partners-we-do-the-surprising-psychology-behind-romantic-attraction":
    "Explore romantic attraction, familiar relationship patterns, and how Imago Relationship Therapy approaches recurring conflict.",
  "beyond-the-buzzword-what-does-doing-the-work-actually-mean-in-therapy":
    'What does "doing the work" mean? Explore the process in individual, perinatal, and couples therapy with Dr. Christina Ruzicka.',
  "welcome-to-the-practice":
    "Meet Dr. Christina Ruzicka, a Rochester psychologist, and learn about her collaborative approach to couples therapy and perinatal mental health.",
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
  const fullTitle = title ? `${title} — ${titleBrand}` : titleBrand;
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

// Keep previews readable without introducing a second editor-managed SEO field.
export function excerptSummary(excerpt: string) {
  const text = excerpt.replace(/\s+/g, " ").trim();
  if (text.length <= 160) return text;
  const preview = text.slice(0, 160);
  const wordBoundary = preview.lastIndexOf(" ");
  return `${preview.slice(0, wordBoundary > 0 ? wordBoundary : 159).trimEnd()}…`;
}

export function blogPostMetadata(post: {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  updatedAt?: string;
}): Metadata {
  const metadata = pageMetadata({
    title: articleTitles[post.slug] ?? post.title,
    description: articleDescriptions[post.slug] ?? excerptSummary(post.excerpt),
    path: `/blog/${post.slug}`,
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      authors: [`${SITE_URL}/about`],
    },
  };
}

export const practiceId = `${SITE_URL}/#practice`;
export const practitionerId = `${SITE_URL}/about#christina-ruzicka`;

export function practiceJsonLd(settings: SiteSettings): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": practiceId,
        name: settings.name,
        legalName: settings.legalName,
        description: settings.tagline,
        email: settings.email,
        telephone: settings.phone,
        url: settings.url ?? SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        address: {
          "@type": "PostalAddress",
          streetAddress: settings.address.streetAddress,
          addressLocality: settings.address.addressLocality,
          addressRegion: settings.address.addressRegion,
          postalCode: settings.address.postalCode,
          addressCountry: settings.address.addressCountry,
        },
        areaServed: settings.areaServed,
        sameAs: settings.externalProfiles?.map((profile) => profile.url),
        founder: { "@id": practitionerId },
      },
      {
        "@type": "Person",
        "@id": practitionerId,
        name: "Dr. Christina Ruzicka",
        honorificPrefix: "Dr.",
        honorificSuffix: "Psy.D.",
        jobTitle: "Licensed Clinical Psychologist",
        url: `${SITE_URL}/about`,
        worksFor: { "@id": practiceId },
        identifier: [
          {
            "@type": "PropertyValue",
            name: "New York Psychologist License",
            value: "024357",
          },
          {
            "@type": "PropertyValue",
            name: "National Provider Identifier",
            value: "1831638501",
          },
        ],
        knowsAbout: [
          "Individual psychotherapy",
          "Imago Relationship Therapy",
          "Couples therapy",
          "Perinatal mental health",
          "Postpartum mental health",
        ],
        sameAs: settings.externalProfiles?.map((profile) => profile.url),
      },
    ],
  };
}

export function serviceJsonLd(
  service: ServicePageContent,
  settings: SiteSettings,
): WithContext<Service> {
  const url = `${SITE_URL}/specialties/${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.pageHeading,
    serviceType: service.title,
    description: service.intro,
    url,
    provider: { "@id": practiceId },
    areaServed: settings.areaServed,
    audience: {
      "@type": "PeopleAudience",
      suggestedMinAge: 18,
    },
  };
}

export function breadcrumbJsonLd(
  items: ReadonlyArray<{ name: string; path: string }>,
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqPageJsonLd(
  items: ReadonlyArray<{ question: string; answer: string }>,
): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function blogPostJsonLd(post: {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  updatedAt?: string;
}): WithContext<BlogPosting> {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: url,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: { "@id": practitionerId },
    publisher: { "@id": practiceId },
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
