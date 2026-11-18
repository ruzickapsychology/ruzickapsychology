import { GUIDE_STAGES, type GuideStage } from "@/lib/guides";
import postpartumGuide from "./guides/postpartum.json";

/**
 * Reader guides: plain-language pages grouped by where the reader is in their
 * decision (learn, compare, decide). Copy lives in JSON so every page keeps its
 * sources next to its text. Medical facts must come from the primary sources
 * listed on the page; practice facts only from docs/website-facts.md.
 */

export type { GuideStage };

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  items?: string[];
};

export type GuideFaq = { question: string; answer: string };

export type GuideSource = {
  name: string;
  url: string;
  /** Reviewer note: which sentences the source backs. Not shown on the page. */
  supports?: string;
};

export type GuidePageContent = {
  slug: string;
  stage: GuideStage;
  order: number;
  title: string;
  headline: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  answer: string;
  datePublished: string;
  dateModified: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  next: { href: string; label: string; text: string };
  related: string[];
  sources: GuideSource[];
};

export type GuideContent = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  intro: string;
  datePublished: string;
  stages: Array<{
    stage: GuideStage;
    eyebrow: string;
    heading: string;
    description: string;
  }>;
  practiceNote: { heading: string; paragraphs: string[] };
  pages: GuidePageContent[];
};

const guides = [postpartumGuide as GuideContent];

export function getGuide(slug: string): GuideContent | null {
  return guides.find((guide) => guide.slug === slug) ?? null;
}

export function getGuides(): readonly GuideContent[] {
  return guides;
}

/** Pages in reading order: learn, then compare, then decide. */
export function getGuidePages(guide: GuideContent) {
  return [...guide.pages].sort(
    (a, b) =>
      GUIDE_STAGES.indexOf(a.stage) - GUIDE_STAGES.indexOf(b.stage) ||
      a.order - b.order,
  );
}

export function getGuidePage(
  guideSlug: string,
  pageSlug: string,
): { guide: GuideContent; page: GuidePageContent } | null {
  const guide = getGuide(guideSlug);
  const page = guide?.pages.find((item) => item.slug === pageSlug);
  return guide && page ? { guide, page } : null;
}

export function getGuideLastModified(guide: GuideContent) {
  return guide.pages.reduce(
    (latest, page) => (page.dateModified > latest ? page.dateModified : latest),
    guide.datePublished,
  );
}

/** Guide pages featured on each postpartum service page (one per stage). */
export const POSTPARTUM_GUIDE_SERVICE_LINKS: Record<string, readonly string[]> =
  {
    "postpartum-depression-therapy": [
      "baby-blues-or-postpartum-depression",
      "postpartum-depression-treatment-options",
      "first-postpartum-therapy-session",
    ],
    "postpartum-anxiety-therapy": [
      "postpartum-anxiety-signs",
      "intrusive-thoughts-after-baby",
      "questions-to-ask-a-perinatal-therapist",
    ],
    "perinatal-postpartum-therapy": [
      "depression-anxiety-during-pregnancy",
      "perinatal-therapist-what-to-look-for",
      "first-postpartum-therapy-session",
    ],
  };

/** The postpartum guide block for a service page, or null for other services. */
export function getServiceGuideLinks(serviceSlug: string) {
  const slugs = POSTPARTUM_GUIDE_SERVICE_LINKS[serviceSlug];
  const guide = getGuide("postpartum");
  if (!slugs || !guide) return null;
  const pages = slugs
    .map((slug) => guide.pages.find((page) => page.slug === slug))
    .filter((page) => page !== undefined);
  return pages.length ? { guide, pages } : null;
}
