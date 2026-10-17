import { defineQuery, type QueryParams } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";

import { normalizeRichText } from "@/data/rich-text";
import { client } from "@/sanity/lib/client";
import {
  type AvailabilityBadgeMessages,
  normalizeAvailabilityStatus,
  type AvailabilityMessaging,
  type AvailabilityStatus,
} from "@/config/availability";
import type { SanityImageValue } from "@/config/cms-images";
import {
  getServiceDefinition,
  getServiceDefinitionByDocumentId,
  SERVICE_PAGES,
  type ServiceSlug,
} from "@/config/services";

export type RichText = PortableTextBlock[];

export type SpecialtyIcon = "circle" | "leaves" | "bud" | "quatrefoil";

export type SiteSettings = {
  name: string;
  legalName: string;
  practitioner: string;
  email: string;
  phone?: string;
  safetyNotice?: string | null;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
    note?: string;
  };
  hours: readonly string[];
  portalUrl?: string;
  availabilityStatus: AvailabilityStatus;
  availabilityBadgeMessages?: AvailabilityBadgeMessages | null;
  availabilityMessaging?: AvailabilityMessaging | null;
  url?: string;
  tagline?: string;
  areaServed?: readonly string[];
  externalProfiles?: ReadonlyArray<{
    _key?: string;
    label: string;
    url: string;
  }>;
};

export type SpecialtyContent = {
  _key?: string;
  documentId?: string;
  title: string;
  slug: string;
  pageStatus: "hubOnly" | "published";
  icon: SpecialtyIcon;
  summary: string;
  details: string[];
};

export type ServicePageContent = SpecialtyContent & {
  slug: ServiceSlug;
  pageStatus: "published";
  pageHeading: string;
  intro: string;
  overview: RichText;
  commonConcerns: readonly string[];
  approachHeading: string;
  approachBody: RichText;
  whatToExpect: RichText;
  faqs: ReadonlyArray<{
    _key?: string;
    question: string;
    answer: RichText;
    answerText: string;
  }>;
  relatedPosts: ReadonlyArray<{
    _key?: string;
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: string;
  }>;
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
  reimbursementGuide?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items?: ReadonlyArray<{
      _key?: string;
      eyebrow?: string;
      title: string;
      body?: RichText;
    }>;
  };
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
  formNote?: string;
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
  items?: ReadonlyArray<{
    _key?: string;
    q: string;
    answer: RichText;
    answerText: string;
  }>;
  cta?: {
    heading?: string;
    body?: string;
    cta?: string;
    backgroundImage?: SanityImageValue;
  };
};

type RawSpecialty = {
  _key?: string;
  _id?: string;
  title?: string;
  slug?: string;
  pageStatus?: "hubOnly" | "published";
  pageReady?: boolean;
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
  bodyText?: Array<string | null>;
  sources?: Array<{
    _key?: string;
    title: string;
    citation: string;
    url: string;
  }>;
};

export type RawPostMeta = {
  _updatedAt?: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  bodyText?: Array<string | null>;
};

const siteSettingsQuery = defineQuery(/* groq */ `
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    name,
    legalName,
    practitioner,
    email,
    phone,
    safetyNotice,
    address{
      "streetAddress": coalesce(streetAddress, line1),
      "addressLocality": coalesce(addressLocality, "Rochester"),
      "addressRegion": coalesce(addressRegion, "NY"),
      "postalCode": coalesce(postalCode, "14620"),
      "addressCountry": coalesce(addressCountry, "US"),
      note
    },
    hours,
    portalUrl,
    "availabilityStatus": coalesce(availabilityStatus, "accepting"),
    availabilityBadgeMessages,
    availabilityMessaging{
      waitlist{
        heroCta,
        contactHeading,
        contactIntro,
        ctaHeading,
        ctaBody,
        homeCtaLabel,
        pricingCtaHeading,
        pricingCtaBody,
        pricingCtaLabel
      },
      closed{
        heroCta,
        contactHeading,
        contactIntro,
        ctaHeading,
        ctaBody,
        pricingCtaHeading,
        pricingCtaBody,
        panelHeading,
        panelBody,
        contactMethodsLabel
      }
    },
    url,
    tagline,
    areaServed,
    externalProfiles[]{_key, label, url}
  }
`);

const specialtiesQuery = defineQuery(/* groq */ `
  *[_type == "specialty" && active != false] | order(order asc, title asc) {
    _id,
    "_key": _id,
    title,
    "slug": slug.current,
    "pageStatus": coalesce(pageStatus, "hubOnly"),
    "pageReady":
      pageStatus == "published" &&
      defined(pageHeading) &&
      defined(intro) &&
      count(overview) > 0 &&
      count(commonConcerns) > 0 &&
      defined(approachHeading) &&
      count(approachBody) > 0 &&
      count(whatToExpect) > 0 &&
      count(faqs) >= 3,
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
      specialties[]{
        _key,
        "_id": @->_id,
        "title": @->title,
        "slug": @->slug.current,
        "pageStatus": coalesce(@->pageStatus, "hubOnly"),
        "pageReady":
          @->pageStatus == "published" &&
          defined(@->pageHeading) &&
          defined(@->intro) &&
          count(@->overview) > 0 &&
          count(@->commonConcerns) > 0 &&
          defined(@->approachHeading) &&
          count(@->approachBody) > 0 &&
          count(@->whatToExpect) > 0 &&
          count(@->faqs) >= 3,
        "summary": @->summary,
        "details": @->details
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
    specialties[]{
      _key,
      "_id": @->_id,
      "title": @->title,
      "slug": @->slug.current,
      "pageStatus": coalesce(@->pageStatus, "hubOnly"),
      "pageReady":
        @->pageStatus == "published" &&
        defined(@->pageHeading) &&
        defined(@->intro) &&
        count(@->overview) > 0 &&
        count(@->commonConcerns) > 0 &&
        defined(@->approachHeading) &&
        count(@->approachBody) > 0 &&
        count(@->whatToExpect) > 0 &&
        count(@->faqs) >= 3,
      "summary": @->summary,
      "details": @->details
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

const servicePageQuery = defineQuery(/* groq */ `
  *[
    _type == "specialty" &&
    _id == $documentId &&
    active != false &&
    pageStatus == "published" &&
    defined(pageHeading) &&
    defined(intro) &&
    count(overview) > 0 &&
    count(commonConcerns) > 0 &&
    defined(approachHeading) &&
    count(approachBody) > 0 &&
    count(whatToExpect) > 0 &&
    count(faqs) >= 3
  ][0]{
    _id,
    "_key": _id,
    title,
    "slug": slug.current,
    pageStatus,
    summary,
    details,
    pageHeading,
    intro,
    overview,
    commonConcerns,
    approachHeading,
    approachBody,
    whatToExpect,
    faqs[]{
      _key,
      question,
      "answer": coalesce(answerRichText, []),
      "legacyAnswer": answer,
      "answerText": coalesce(pt::text(answerRichText), array::join(answer, " "))
    },
    relatedPosts[]->{
      "_key": _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt
    }
  }
`);

const serviceSlugsQuery = defineQuery(/* groq */ `
  *[
    _type == "specialty" &&
    _id in $serviceDocumentIds &&
    active != false &&
    pageStatus == "published" &&
    defined(pageHeading) &&
    defined(intro) &&
    count(overview) > 0 &&
    count(commonConcerns) > 0 &&
    defined(approachHeading) &&
    count(approachBody) > 0 &&
    count(whatToExpect) > 0 &&
    count(faqs) >= 3
  ]{_id}
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
    reimbursementGuide{
      eyebrow,
      heading,
      intro,
      items[]{_key, eyebrow, title, body}
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
    formNote,
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
    items[]{
      _key,
      question,
      answerRichText,
      answer,
      "answerText": coalesce(
        pt::text(answerRichText),
        array::join(answer, " ")
      )
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

export const blogPostQuery = defineQuery(/* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    _updatedAt,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    body,
    sources[]{_key, title, citation, url},
    "bodyText": body[].children[].text
  }
`);

export const blogPostMetaQuery = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _updatedAt,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "bodyText": body[].children[].text
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
    },
    "services": *[
      _type == "specialty" &&
      _id in $serviceDocumentIds &&
      active != false &&
      pageStatus == "published" &&
      defined(pageHeading) &&
      defined(intro) &&
      count(overview) > 0 &&
      count(commonConcerns) > 0 &&
      defined(approachHeading) &&
      count(approachBody) > 0 &&
      count(whatToExpect) > 0 &&
      count(faqs) >= 3
    ]{
      _id,
      _updatedAt
    }
  }
`);

async function fetchCms<T>(query: string, params: QueryParams = {}) {
  if (!client) return null;

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

async function fetchCmsStrict<T>(query: string, params: QueryParams = {}) {
  if (!client) {
    console.warn("[sanity] CMS content unavailable: Sanity is not configured.");
    return null;
  }

  return client.fetch<T>(query, params, {
    next: { revalidate: 60 },
  });
}

const specialtyIconBySlug: Record<string, SpecialtyIcon> = {
  "individual-therapy": "circle",
  "couples-therapy": "leaves",
  "couples-counseling": "leaves",
  "perinatal-postpartum-therapy": "bud",
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
  const service = item._id
    ? getServiceDefinitionByDocumentId(item._id)
    : undefined;
  const slug = service?.slug ?? item.slug ?? "";
  return {
    _key: item._key ?? slug,
    documentId: item._id,
    title: item.title,
    slug,
    pageStatus:
      item.pageStatus === "published" && item.pageReady
        ? "published"
        : "hubOnly",
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

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const settings = await fetchCms<
    Omit<SiteSettings, "availabilityStatus" | "availabilityMessaging"> & {
      availabilityStatus?: string | null;
      availabilityBadgeMessages?: AvailabilityBadgeMessages | null;
      availabilityMessaging?: AvailabilityMessaging | null;
    }
  >(siteSettingsQuery);

  if (!settings) return null;

  return {
    ...settings,
    availabilityStatus: normalizeAvailabilityStatus(
      settings.availabilityStatus,
    ),
    availabilityBadgeMessages: settings.availabilityBadgeMessages,
    availabilityMessaging: settings.availabilityMessaging,
  };
}

export async function getSpecialties() {
  const docs = await fetchCms<RawSpecialty[]>(specialtiesQuery);
  return normalizeSpecialtyList(docs);
}

export async function getPublishedServiceDefinitions() {
  const specialties = await getSpecialties();

  return specialties.flatMap((specialty) => {
    const definition = getServiceDefinition(specialty.slug);
    return specialty.pageStatus === "published" && definition
      ? [definition]
      : [];
  });
}

export async function getServicePage(
  slug: string,
): Promise<ServicePageContent | null> {
  const definition = getServiceDefinition(slug);
  if (!definition) return null;

  const doc = await fetchCms<
    RawSpecialty & {
      pageHeading?: string;
      intro?: string;
      overview?: RichText;
      commonConcerns?: string[];
      approachHeading?: string;
      approachBody?: RichText;
      whatToExpect?: RichText;
      faqs?: Array<{
        _key?: string;
        question?: string;
        answer?: RichText;
        legacyAnswer?: string[];
        answerText?: string;
      }>;
      relatedPosts?: ServicePageContent["relatedPosts"];
    }
  >(servicePageQuery, { documentId: definition.documentId });

  const specialty = doc ? normalizeSpecialty(doc) : null;
  if (
    !doc ||
    !specialty ||
    doc.pageStatus !== "published" ||
    !doc.pageHeading ||
    !doc.intro ||
    !doc.overview?.length ||
    !doc.commonConcerns?.length ||
    !doc.approachHeading ||
    !doc.approachBody?.length ||
    !doc.whatToExpect?.length ||
    !doc.faqs?.length
  ) {
    return null;
  }

  return {
    ...specialty,
    slug: definition.slug,
    pageStatus: "published",
    pageHeading: doc.pageHeading,
    intro: doc.intro,
    overview: doc.overview,
    commonConcerns: doc.commonConcerns,
    approachHeading: doc.approachHeading,
    approachBody: doc.approachBody,
    whatToExpect: doc.whatToExpect,
    faqs: doc.faqs
      .filter((item) => item.question)
      .map((item, index) => {
        const answer = normalizeRichText(
          item.answer,
          item.legacyAnswer,
          `${definition.slug}-faq-${index}`,
        );
        return {
          _key: item._key,
          question: item.question as string,
          answer,
          answerText: item.answerText ?? item.legacyAnswer?.join(" ") ?? "",
        };
      })
      .filter((item) => item.answer.length),
    relatedPosts: doc.relatedPosts ?? [],
  };
}

export async function getServiceSlugsForBuild() {
  if (!client) {
    console.warn("[sanity] CMS content unavailable: Sanity is not configured.");
    return [];
  }

  const existing = await client
    .withConfig({ useCdn: false })
    .fetch<Array<{ _id: string }>>(serviceSlugsQuery, {
      serviceDocumentIds: SERVICE_PAGES.map((service) => service.documentId),
    });
  const ids = new Set(existing?.map((item) => item._id) ?? []);
  return SERVICE_PAGES.filter((service) => ids.has(service.documentId)).map(
    (service) => service.slug,
  );
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
    reimbursementGuide?: PricingPageContent["reimbursementGuide"];
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
    reimbursementGuide: doc.reimbursementGuide,
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
    formNote?: string;
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
    formNote: doc.formNote,
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
    items?: Array<{
      _key?: string;
      question?: string;
      answerRichText?: RichText;
      answer?: string[];
      answerText?: string;
    }>;
    cta?: { heading?: string; body?: string; label?: string };
    ctaBackgroundImage?: SanityImageValue;
  }>(faqPageQuery);

  if (!doc?.heading) return null;

  return {
    heading: doc.heading,
    intro: doc.intro,
    items: doc.items
      ?.filter(
        (item) =>
          item.question && (item.answerRichText?.length || item.answer?.length),
      )
      .map((item, index) => ({
        _key: item._key,
        q: item.question as string,
        answer: normalizeRichText(
          item.answerRichText,
          item.answer,
          `faq-${item._key ?? index}`,
        ),
        answerText:
          item.answerText ??
          item.answer?.join(" ") ??
          item.answerRichText
            ?.flatMap((block) =>
              "children" in block && Array.isArray(block.children)
                ? block.children.map((child) =>
                    "text" in child && typeof child.text === "string"
                      ? child.text
                      : "",
                  )
                : [],
            )
            .join(" ") ??
          "",
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

export async function getSanityPostMeta() {
  return fetchCms<RawPostMeta[]>(blogPostMetaQuery);
}

export async function getSanityPostMetaStrict() {
  return (await fetchCmsStrict<RawPostMeta[]>(blogPostMetaQuery)) ?? [];
}

export async function getSanityPostSlugsStrict() {
  return (
    (await fetchCmsStrict<Array<{ slug: string }>>(blogPostSlugsQuery)) ?? []
  );
}

export async function getSitemapEntriesStrict() {
  return fetchCmsStrict<{
    pages: Array<{ _id: string; _updatedAt: string }>;
    posts: Array<{ slug: string; _updatedAt: string }>;
    services: Array<{ _id: string; _updatedAt: string }>;
  }>(sitemapEntriesQuery, {
    serviceDocumentIds: SERVICE_PAGES.map((service) => service.documentId),
  });
}

export async function getSitemapEntries() {
  return fetchCms<{
    pages: Array<{ _id: string; _updatedAt: string }>;
    posts: Array<{ slug: string; _updatedAt: string }>;
    services: Array<{ _id: string; _updatedAt: string }>;
  }>(sitemapEntriesQuery, {
    serviceDocumentIds: SERVICE_PAGES.map((service) => service.documentId),
  });
}

export async function getSanityPost(slug: string) {
  return fetchCms<RawPost>(blogPostQuery, { slug });
}
