import type { Metadata } from "next";
import type {
  BlogPosting,
  BreadcrumbList,
  CollectionPage,
  DayOfWeek,
  Event,
  FAQPage,
  Graph,
  Service,
  WithContext,
} from "schema-dts";
import type { ServicePageContent, SiteSettings } from "@/data/cms";
import type { ResearchPageContent } from "@/data/research";
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
  const fullTitle = title ? `${title} | ${titleBrand}` : titleBrand;
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

const schemaDays: Record<string, DayOfWeek> = {
  mon: "https://schema.org/Monday",
  tue: "https://schema.org/Tuesday",
  wed: "https://schema.org/Wednesday",
  thu: "https://schema.org/Thursday",
  fri: "https://schema.org/Friday",
  sat: "https://schema.org/Saturday",
  sun: "https://schema.org/Sunday",
};

function to24Hour(time: string) {
  const match = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i.exec(time.trim());
  if (!match) return null;
  const hour = (Number(match[1]) % 12) + (/pm/i.test(match[3]) ? 12 : 0);
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
}

/** Build schema hours only from CMS lines with a real time range, like "Mon · 9:00am – 6:00pm". */
export function openingHoursSpecification(hours: readonly string[] = []) {
  return hours.flatMap((line) => {
    const [day, range] = line.split("·").map((part) => part.trim());
    const dayOfWeek = schemaDays[day?.slice(0, 3).toLowerCase() ?? ""];
    const [opens, closes] = (range ?? "").split(/[-–]/).map(to24Hour);
    return dayOfWeek && opens && closes
      ? [
          {
            "@type": "OpeningHoursSpecification" as const,
            dayOfWeek,
            opens,
            closes,
          },
        ]
      : [];
  });
}

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
        openingHoursSpecification: openingHoursSpecification(settings.hours),
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
          "Anxiety",
          "Disordered eating",
          "Self-esteem",
          "Relationship issues",
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

export function upcomingSessions(
  service: Pick<ServicePageContent, "upcomingSessions">,
  now = new Date(),
) {
  return service.upcomingSessions
    .filter((session) => new Date(session.endsAt) > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

/** Event markup for real dated sessions that are also visible on the page. */
export function serviceEventsJsonLd(
  service: ServicePageContent,
  settings: SiteSettings,
  now = new Date(),
): Array<WithContext<Event>> {
  const url = `${SITE_URL}/specialties/${service.slug}`;
  return upcomingSessions(service, now).map((session) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: service.title,
    description: service.intro,
    url,
    startDate: session.startsAt,
    endDate: session.endsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    organizer: { "@id": practiceId },
    location: {
      "@type": "Place",
      name: settings.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address.streetAddress,
        addressLocality: settings.address.addressLocality,
        addressRegion: settings.address.addressRegion,
        postalCode: settings.address.postalCode,
        addressCountry: settings.address.addressCountry,
      },
    },
    ...(session.priceUsd
      ? {
          offers: {
            "@type": "Offer" as const,
            price: session.priceUsd,
            priceCurrency: "USD",
            url,
          },
        }
      : {}),
  }));
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

/** Article + Dataset for a /research page. Author and publisher are the practice node from the site layout. */
export function researchPageJsonLd(page: ResearchPageContent): Graph {
  const url = `${SITE_URL}/research/${page.slug}`;
  const nodes: Array<Graph["@graph"][number]> = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: page.title,
      description: page.metaDescription,
      url,
      mainEntityOfPage: url,
      datePublished: page.datePublished,
      dateModified: page.dateModified,
      inLanguage: "en-US",
      author: { "@id": practiceId },
      publisher: { "@id": practiceId },
      isPartOf: { "@id": `${SITE_URL}/research#collection` },
      citation: page.sources.map((source) => source.url),
      ...(page.dataset ? { about: { "@id": `${url}#dataset` } } : {}),
    },
  ];
  if (page.dataset) {
    nodes.push({
      "@type": "Dataset",
      "@id": `${url}#dataset`,
      name: page.dataset.name,
      description: page.dataset.description,
      url,
      temporalCoverage: page.dataset.temporalCoverage,
      spatialCoverage: { "@type": "Place", name: page.dataset.spatialCoverage },
      variableMeasured: page.dataset.variableMeasured,
      license: "https://creativecommons.org/licenses/by/4.0/",
      isAccessibleForFree: true,
      creator: { "@id": practiceId },
      publisher: { "@id": practiceId },
      datePublished: page.datePublished,
      dateModified: page.dateModified,
      isBasedOn: page.sources.map((source) => source.url),
      ...(page.csv
        ? {
            distribution: {
              "@type": "DataDownload",
              encodingFormat: "text/csv",
              contentUrl: `${SITE_URL}${page.csv.href}`,
            },
          }
        : {}),
    });
  }
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function researchHubJsonLd(
  pages: readonly ResearchPageContent[],
): WithContext<CollectionPage> {
  const url = `${SITE_URL}/research`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: "Research: Mental Health Data for Rochester and Monroe County",
    url,
    inLanguage: "en-US",
    publisher: { "@id": practiceId },
    hasPart: pages.map((page) => ({
      "@type": "Article" as const,
      "@id": `${url}/${page.slug}#article`,
      headline: page.title,
      url: `${url}/${page.slug}`,
      datePublished: page.datePublished,
    })),
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
