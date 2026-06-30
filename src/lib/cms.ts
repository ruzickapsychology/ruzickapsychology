import { defineQuery } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";

import { client } from "@/sanity/lib/client";
import type { SanityImageValue } from "./cms-images";

export type RichText = PortableTextBlock[];

export type SpecialtyIcon = "circle" | "leaves" | "bud" | "quatrefoil";

export type SiteSettings = {
  name: string;
  legalName: string;
  practitioner: string;
  email: string;
  phone?: string;
  address: { line1: string; line2: string; note?: string };
  hours: readonly string[];
  portalUrl?: string;
  url?: string;
  tagline?: string;
  areaServed?: readonly string[];
};

export type SpecialtyContent = {
  _key?: string;
  title: string;
  slug: string;
  icon: SpecialtyIcon;
  summary: string;
  details: string[];
};

export type HomePageContent = {
  hero: {
    kicker?: string;
    heading: string;
    body?: string;
    cta: string;
    backgroundImage?: SanityImageValue;
  };
  specialties: {
    eyebrow?: string;
    heading?: string;
    items: SpecialtyContent[];
  };
  about: {
    eyebrow?: string;
    heading?: string;
    body?: string;
    cta?: string;
    portraitImage?: SanityImageValue;
  };
  cta: {
    heading?: string;
    body?: string;
    cta?: string;
    backgroundImage?: SanityImageValue;
  };
};

export type AboutPageContent = {
  credentials?: string;
  heading: string;
  portraitImage?: SanityImageValue;
  intro?: RichText;
  credentialGroups?: Array<{
    _key?: string;
    heading: string;
    items: ReadonlyArray<{ _key?: string; title: string; detail: string }>;
    license?: string;
  }>;
  space?: {
    eyebrow?: string;
    heading?: string;
    body?: string;
    exteriorImage?: SanityImageValue;
    interiorImage?: SanityImageValue;
  };
  philosophy?: {
    eyebrow?: string;
    quote: string;
    attribution?: string;
    backgroundImage?: SanityImageValue;
  };
};

export type SpecialtiesPageContent = {
  eyebrow?: string;
  heading: string;
  intro?: string;
  items: SpecialtyContent[];
  modality?: {
    eyebrow?: string;
    heading?: string;
    body?: RichText;
    backgroundImage?: SanityImageValue;
  };
};

export type PricingPageContent = {
  eyebrow?: string;
  heading: string;
  intro?: string;
  fees?: {
    heading?: string;
    items?: ReadonlyArray<{
      _key?: string;
      label: string;
      detail: string;
      price: string;
    }>;
    note?: string;
  };
  insurance?: { heading?: string; body?: RichText };
  cta?: {
    heading?: string;
    body?: string;
    cta?: string;
    backgroundImage?: SanityImageValue;
  };
};

export type ContactPageContent = {
  eyebrow?: string;
  heading: string;
  intro?: string;
  headerBackgroundImage?: SanityImageValue;
  expect?: {
    eyebrow?: string;
    heading?: string;
    steps?: ReadonlyArray<{
      _key?: string;
      n: string;
      title: string;
      body: string;
    }>;
  };
};

export type FAQPageContent = {
  heading: string;
  intro?: string;
  items?: ReadonlyArray<{ _key?: string; q: string; a: readonly string[] }>;
  cta?: {
    heading?: string;
    body?: string;
    cta?: string;
    backgroundImage?: SanityImageValue;
  };
};

type RawSpecialty = {
  _key?: string;
  title?: string;
  slug?: string;
  summary?: string;
  details?: string[];
};

type RawPost = {
  _updatedAt?: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  body: RichText;
};

export type RawPostMeta = {
  _updatedAt?: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  body?: RichText;
};

const siteSettingsQuery = defineQuery(/* groq */ `
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    name,
    legalName,
    practitioner,
    email,
    phone,
    address,
    hours,
    portalUrl,
    url,
    tagline,
    areaServed
  }
`);

const specialtiesQuery = defineQuery(/* groq */ `
  *[_type == "specialty" && active != false] | order(order asc, title asc) {
    "_key": _id,
    title,
    "slug": slug.current,
    summary,
    details
  }
`);

const homePageQuery = defineQuery(/* groq */ `
  *[_type == "homePage" && _id == "homePage"][0]{
    hero{
      kicker,
      heading,
      body,
      ctaLabel,
      backgroundImage{
        asset->{
          _id,
          url,
          metadata {
            dimensions {width, height},
            lqip
          }
        },
        alt,
        crop,
        hotspot
      }
    },
    specialtiesSection{
      eyebrow,
      heading,
      specialties[]->{
        title,
        "slug": slug.current,
        summary,
        details
      }
    },
    aboutPreview{
      eyebrow,
      heading,
      body,
      ctaLabel,
      portraitImage{
        asset->{
          _id,
          url,
          metadata {
            dimensions {width, height},
            lqip
          }
        },
        alt,
        crop,
        hotspot
      }
    },
    ctaSection{
      heading,
      body,
      ctaLabel,
      backgroundImage{
        asset->{
          _id,
          url,
          metadata {
            dimensions {width, height},
            lqip
          }
        },
        alt,
        crop,
        hotspot
      }
    }
  }
`);

const aboutPageQuery = defineQuery(/* groq */ `
  *[_type == "aboutPage" && _id == "aboutPage"][0]{
    credentials,
    heading,
    portraitImage{
      asset->{
        _id,
        url,
        metadata {
          dimensions {width, height},
            lqip
        }
      },
      alt,
      crop,
      hotspot
    },
    intro,
    credentialGroups[]{
      _key,
      heading,
      items[]{_key, title, detail},
      license
    },
    space{
      eyebrow,
      heading,
      body,
      exteriorImage{
        asset->{
          _id,
          url,
          metadata {
            dimensions {width, height},
            lqip
          }
        },
        alt,
        crop,
        hotspot
      },
      interiorImage{
        asset->{
          _id,
          url,
          metadata {
            dimensions {width, height},
            lqip
          }
        },
        alt,
        crop,
        hotspot
      }
    },
    philosophy{
      eyebrow,
      quote,
      attribution,
      backgroundImage{
        asset->{
          _id,
          url,
          metadata {
            dimensions {width, height},
            lqip
          }
        },
        alt,
        crop,
        hotspot
      }
    }
  }
`);

const specialtiesPageQuery = defineQuery(/* groq */ `
  *[_type == "specialtiesPage" && _id == "specialtiesPage"][0]{
    header,
    specialties[]->{
      title,
      "slug": slug.current,
      summary,
      details
    },
    modality{
      eyebrow,
      heading,
      body,
      backgroundImage{
        asset->{
          _id,
          url,
          metadata {
            dimensions {width, height},
            lqip
          }
        },
        alt,
        crop,
        hotspot
      }
    }
  }
`);

const pricingPageQuery = defineQuery(/* groq */ `
  *[_type == "pricingPage" && _id == "pricingPage"][0]{
    header,
    fees{
      heading,
      items[]{_key, label, detail, price},
      note
    },
    insurance{
      heading,
      body
    },
    cta,
    ctaBackgroundImage{
      asset->{
        _id,
        url,
        metadata {
          dimensions {width, height},
            lqip
        }
      },
      alt,
      crop,
      hotspot
    }
  }
`);

const contactPageQuery = defineQuery(/* groq */ `
  *[_type == "contactPage" && _id == "contactPage"][0]{
    header,
    headerBackgroundImage{
      asset->{
        _id,
        url,
        metadata {
          dimensions {width, height},
            lqip
        }
      },
      alt,
      crop,
      hotspot
    },
    process{
      eyebrow,
      heading,
      steps[]{_key, number, title, body}
    }
  }
`);

const faqPageQuery = defineQuery(/* groq */ `
  *[_type == "faqPage" && _id == "faqPage"][0]{
    heading,
    intro,
    items[]{_key, question, answer},
    cta,
    ctaBackgroundImage{
      asset->{
        _id,
        url,
        metadata {
          dimensions {width, height},
            lqip
        }
      },
      alt,
      crop,
      hotspot
    }
  }
`);

export const blogPostsQuery = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _updatedAt,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    body
  }
`);

export const blogPostQuery = defineQuery(/* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    _updatedAt,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    body
  }
`);

export const blogPostMetaQuery = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _updatedAt,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    body
  }
`);

export const blogPostSlugsQuery = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current
  }
`);

export const sitemapEntriesQuery = defineQuery(/* groq */ `
  {
    "pages": *[_id in ["homePage", "aboutPage", "specialtiesPage", "pricingPage", "contactPage", "faqPage"]]{
      _id,
      _updatedAt
    },
    "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
      _updatedAt,
      "slug": slug.current
    }
  }
`);

async function fetchCms<T>(
  query: string,
  params: Record<string, unknown> = {},
) {
  try {
    const data = await client.fetch<T | null>(query, params, {
      next: { revalidate: 60 },
    });
    return data ?? null;
  } catch (error) {
    console.warn("[sanity] CMS content unavailable:", error);
    return null;
  }
}

async function fetchCmsStrict<T>(
  query: string,
  params: Record<string, unknown> = {},
) {
  return client.fetch<T>(query, params, {
    next: { revalidate: 60 },
  });
}

const specialtyIconBySlug: Record<string, SpecialtyIcon> = {
  "individual-therapy": "circle",
  "couples-counseling": "leaves",
  "perinatal-postpartum-support": "bud",
  "perinatal-and-postpartum-support": "bud",
  "group-therapy": "quatrefoil",
};

function getSpecialtyIcon(slug: string, title: string): SpecialtyIcon {
  const slugMatch = specialtyIconBySlug[slug];
  if (slugMatch) return slugMatch;

  const normalizedTitle = title.toLowerCase();
  if (
    normalizedTitle.includes("perinatal") ||
    normalizedTitle.includes("postpartum")
  ) {
    return "bud";
  }

  return "circle";
}

function normalizeSpecialty(item: RawSpecialty): SpecialtyContent | null {
  if (!item.title || !item.summary) return null;
  const slug = item.slug ?? "";
  return {
    _key: item._key ?? slug,
    title: item.title,
    slug,
    icon: getSpecialtyIcon(slug, item.title),
    summary: item.summary,
    details: item.details?.filter(Boolean) ?? [],
  };
}

function normalizeSpecialtyList(items?: RawSpecialty[] | null) {
  return (
    (items?.map(normalizeSpecialty).filter(Boolean) as
      SpecialtyContent[] | undefined) ?? []
  );
}

export async function getSiteSettings() {
  return fetchCms<SiteSettings>(siteSettingsQuery);
}

export async function getSpecialties() {
  const docs = await fetchCms<RawSpecialty[]>(specialtiesQuery);
  return normalizeSpecialtyList(docs);
}

export async function getHomePage(): Promise<HomePageContent | null> {
  const [doc, allSpecialties] = await Promise.all([
    fetchCms<{
      hero?: {
        kicker?: string;
        heading?: string;
        body?: string;
        ctaLabel?: string;
        backgroundImage?: SanityImageValue;
      };
      specialtiesSection?: {
        eyebrow?: string;
        heading?: string;
        specialties?: RawSpecialty[];
      };
      aboutPreview?: {
        eyebrow?: string;
        heading?: string;
        body?: string;
        ctaLabel?: string;
        portraitImage?: SanityImageValue;
      };
      ctaSection?: {
        heading?: string;
        body?: string;
        ctaLabel?: string;
        backgroundImage?: SanityImageValue;
      };
    }>(homePageQuery),
    getSpecialties(),
  ]);

  if (!doc?.hero?.heading) return null;

  return {
    hero: {
      kicker: doc.hero.kicker,
      heading: doc.hero.heading,
      body: doc.hero.body,
      cta: doc.hero.ctaLabel ?? "",
      backgroundImage: doc.hero.backgroundImage,
    },
    specialties: {
      eyebrow: doc.specialtiesSection?.eyebrow,
      heading: doc.specialtiesSection?.heading,
      items: doc.specialtiesSection?.specialties?.length
        ? normalizeSpecialtyList(doc.specialtiesSection.specialties)
        : allSpecialties,
    },
    about: {
      eyebrow: doc.aboutPreview?.eyebrow,
      heading: doc.aboutPreview?.heading,
      body: doc.aboutPreview?.body,
      cta: doc.aboutPreview?.ctaLabel,
      portraitImage: doc.aboutPreview?.portraitImage,
    },
    cta: {
      heading: doc.ctaSection?.heading,
      body: doc.ctaSection?.body,
      cta: doc.ctaSection?.ctaLabel,
      backgroundImage: doc.ctaSection?.backgroundImage,
    },
  };
}

export async function getAboutPage() {
  return fetchCms<AboutPageContent>(aboutPageQuery);
}

export async function getSpecialtiesPage(): Promise<SpecialtiesPageContent | null> {
  const [doc, allSpecialties] = await Promise.all([
    fetchCms<{
      header?: { eyebrow?: string; heading?: string; intro?: string };
      specialties?: RawSpecialty[];
      modality?: {
        eyebrow?: string;
        heading?: string;
        body?: RichText;
        backgroundImage?: SanityImageValue;
      };
    }>(specialtiesPageQuery),
    getSpecialties(),
  ]);

  if (!doc?.header?.heading) return null;

  return {
    eyebrow: doc.header.eyebrow,
    heading: doc.header.heading,
    intro: doc.header.intro,
    items: doc.specialties?.length
      ? normalizeSpecialtyList(doc.specialties)
      : allSpecialties,
    modality: doc.modality,
  };
}

export async function getPricingPage(): Promise<PricingPageContent | null> {
  const doc = await fetchCms<{
    header?: { eyebrow?: string; heading?: string; intro?: string };
    fees?: PricingPageContent["fees"];
    insurance?: PricingPageContent["insurance"];
    cta?: { heading?: string; body?: string; label?: string };
    ctaBackgroundImage?: SanityImageValue;
  }>(pricingPageQuery);

  if (!doc?.header?.heading) return null;

  return {
    eyebrow: doc.header.eyebrow,
    heading: doc.header.heading,
    intro: doc.header.intro,
    fees: doc.fees,
    insurance: doc.insurance,
    cta: doc.cta
      ? {
          heading: doc.cta.heading,
          body: doc.cta.body,
          cta: doc.cta.label,
          backgroundImage: doc.ctaBackgroundImage,
        }
      : undefined,
  };
}

export async function getContactPage(): Promise<ContactPageContent | null> {
  const doc = await fetchCms<{
    header?: { eyebrow?: string; heading?: string; intro?: string };
    headerBackgroundImage?: SanityImageValue;
    process?: {
      eyebrow?: string;
      heading?: string;
      steps?: Array<{
        _key?: string;
        number?: string;
        title?: string;
        body?: string;
      }>;
    };
  }>(contactPageQuery);

  if (!doc?.header?.heading) return null;

  return {
    eyebrow: doc.header.eyebrow,
    heading: doc.header.heading,
    intro: doc.header.intro,
    headerBackgroundImage: doc.headerBackgroundImage,
    expect: doc.process
      ? {
          eyebrow: doc.process.eyebrow,
          heading: doc.process.heading,
          steps: doc.process.steps
            ?.filter((step) => step.number && step.title && step.body)
            .map((step) => ({
              _key: step._key,
              n: step.number as string,
              title: step.title as string,
              body: step.body as string,
            })),
        }
      : undefined,
  };
}

export async function getFAQPage(): Promise<FAQPageContent | null> {
  const doc = await fetchCms<{
    heading?: string;
    intro?: string;
    items?: Array<{ _key?: string; question?: string; answer?: string[] }>;
    cta?: { heading?: string; body?: string; label?: string };
    ctaBackgroundImage?: SanityImageValue;
  }>(faqPageQuery);

  if (!doc?.heading) return null;

  return {
    heading: doc.heading,
    intro: doc.intro,
    items: doc.items
      ?.filter((item) => item.question && item.answer?.length)
      .map((item) => ({
        _key: item._key,
        q: item.question as string,
        a: item.answer as string[],
      })),
    cta: doc.cta
      ? {
          heading: doc.cta.heading,
          body: doc.cta.body,
          cta: doc.cta.label,
          backgroundImage: doc.ctaBackgroundImage,
        }
      : undefined,
  };
}

export async function getSanityPosts() {
  return fetchCms<RawPost[]>(blogPostsQuery);
}

export async function getSanityPostMeta() {
  return fetchCms<RawPostMeta[]>(blogPostMetaQuery);
}

export async function getSanityPostMetaStrict() {
  return fetchCmsStrict<RawPostMeta[]>(blogPostMetaQuery);
}

export async function getSanityPostSlugsStrict() {
  return fetchCmsStrict<Array<{ slug: string }>>(blogPostSlugsQuery);
}

export async function getSitemapEntriesStrict() {
  return fetchCmsStrict<{
    pages: Array<{ _id: string; _updatedAt: string }>;
    posts: Array<{ slug: string; _updatedAt: string }>;
  }>(sitemapEntriesQuery);
}

export async function getSitemapEntries() {
  return fetchCms<{
    pages: Array<{ _id: string; _updatedAt: string }>;
    posts: Array<{ slug: string; _updatedAt: string }>;
  }>(sitemapEntriesQuery);
}

export async function getSanityPost(slug: string) {
  return fetchCms<RawPost>(blogPostQuery, { slug });
}

export function plainTextFromPortableText(blocks: RichText) {
  return blocks
    .flatMap((block) => block.children ?? [])
    .map((child) =>
      "text" in child && typeof child.text === "string" ? child.text : "",
    )
    .join(" ");
}
