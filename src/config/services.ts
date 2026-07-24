import type { Route } from "next";

export const SERVICE_SLUGS = [
  "individual-therapy",
  "couples-therapy",
  "perinatal-postpartum-therapy",
  "group-therapy",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export type ServicePageDefinition = {
  slug: ServiceSlug;
  documentId: string;
  title: string;
  pageTitle: string;
  description: string;
  contactLabel: string;
};

export const SERVICE_PAGES: readonly ServicePageDefinition[] = [
  {
    slug: "individual-therapy",
    documentId: "specialty-individual-therapy",
    title: "Individual Therapy",
    pageTitle: "Individual Therapy in Rochester, NY",
    description:
      "Individual therapy in Rochester, NY for anxiety, life transitions, grief, burnout, identity, body image, and recurring relationship patterns.",
    contactLabel: "Individual therapy",
  },
  {
    slug: "couples-therapy",
    documentId: "specialty-couples-counseling",
    title: "Couples Therapy",
    pageTitle: "Couples Therapy in Rochester, NY",
    description:
      "Couples therapy and certified Imago Relationship Therapy in Rochester, NY for recurring conflict, communication struggles, and emotional disconnection.",
    contactLabel: "Couples therapy",
  },
  {
    slug: "perinatal-postpartum-therapy",
    documentId: "specialty-perinatal-postpartum-support",
    title: "Perinatal & Postpartum Therapy",
    pageTitle: "Perinatal & Postpartum Therapy in Rochester, NY",
    description:
      "Perinatal and postpartum therapy in Rochester, NY for pregnancy, loss, early parenthood, anxiety, identity changes, depletion, and relationship strain.",
    contactLabel: "Perinatal or postpartum therapy",
  },
  {
    slug: "group-therapy",
    documentId: "specialty-group-therapy",
    title: "Group Therapy",
    pageTitle: "Group Therapy in Rochester, NY",
    description:
      "Periodic, skills-based group therapy in Rochester, NY for couples seeking practical communication tools, guided practice, and stronger connection.",
    contactLabel: "Group therapy or workshop",
  },
] as const;

const serviceBySlug = new Map(
  SERVICE_PAGES.map((service) => [service.slug, service]),
);

const serviceByDocumentId = new Map(
  SERVICE_PAGES.map((service) => [service.documentId, service]),
);

export function isServiceSlug(value: string): value is ServiceSlug {
  return SERVICE_SLUGS.includes(value as ServiceSlug);
}

export function getServiceDefinition(slug: string) {
  return isServiceSlug(slug) ? serviceBySlug.get(slug) : undefined;
}

export function getServiceDefinitionByDocumentId(documentId: string) {
  return serviceByDocumentId.get(documentId);
}

export function serviceHref(slug: ServiceSlug): Route {
  return `/specialties/${slug}` as Route;
}

export function serviceContactHref(slug: ServiceSlug): Route {
  return `/contact?interest=${slug}` as Route;
}

export function getContactInterestLabel(value: string | undefined) {
  return value ? getServiceDefinition(value)?.contactLabel : undefined;
}

export const POST_SERVICE_LINKS: Record<
  string,
  {
    href: Route;
    label: string;
    description: string;
    serviceSlug?: ServiceSlug;
  }
> = {
  "why-we-choose-the-partners-we-do-the-surprising-psychology-behind-romantic-attraction":
    {
      href: serviceHref("couples-therapy"),
      serviceSlug: "couples-therapy",
      label: "Explore couples therapy",
      description:
        "Learn how Imago-informed couples work can help partners understand recurring patterns and practice a different kind of conversation.",
    },
  "beyond-the-buzzword-what-does-doing-the-work-actually-mean-in-therapy": {
    href: serviceHref("individual-therapy"),
    serviceSlug: "individual-therapy",
    label: "Explore individual therapy",
    description:
      "See how individual therapy can create space to understand patterns, process emotions, and make intentional changes.",
  },
  "welcome-to-the-practice": {
    href: "/specialties",
    label: "Explore therapy services",
    description:
      "Learn about individual therapy, couples therapy, and perinatal and postpartum support.",
  },
};
