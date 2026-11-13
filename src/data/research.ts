import monroeCountyDivorceCouples from "./research/monroe-county-divorce-couples.json";
import monroeCountyPostpartumDepression from "./research/monroe-county-postpartum-depression.json";
import monroeCountyTherapists from "./research/monroe-county-therapists.json";

/**
 * Research pages are data artifacts, not editor copy: each page's JSON is
 * written by `research/<slug>/build.py` from public source files, so every
 * figure on the page comes from a script a reviewer can re-run. Never edit the
 * JSON by hand; change the build script and re-run it.
 */

export type ResearchKeyNumber = {
  value: string;
  label: string;
  source: string;
};

export type ResearchBar = {
  label: string;
  value: number;
  display: string;
  tone: "highlight" | "default" | "muted" | "compare";
};

export type ResearchStatItem = {
  text: string;
  source: string;
  url: string;
};

export type ResearchBlock =
  | { type: "keyNumbers"; heading: string; items: ResearchKeyNumber[] }
  | {
      type: "chart";
      heading: string;
      description: string;
      unit: string;
      bars: ResearchBar[];
      note?: string;
    }
  | {
      type: "table";
      heading: string;
      caption: string;
      columns: string[];
      rows: string[][];
      csv?: boolean;
    }
  | { type: "prose"; eyebrow?: string; heading: string; paragraphs: string[] }
  | { type: "points"; eyebrow?: string; heading: string; items: string[] }
  | {
      type: "statGroup";
      eyebrow?: string;
      heading: string;
      items: ResearchStatItem[];
    }
  | { type: "notice"; text: string };

export type ResearchSource = {
  name: string;
  period: string;
  url: string;
};

export type ResearchPageContent = {
  slug: string;
  kind: "study" | "statistics";
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  datePublished: string;
  dateModified: string;
  card: { value: string; label: string; summary: string };
  blocks: ResearchBlock[];
  sources: ResearchSource[];
  citation: string;
  csv?: { href: string; rows: number; label: string };
  dataset?: {
    name: string;
    description: string;
    temporalCoverage: string;
    spatialCoverage: string;
    variableMeasured: string[];
  };
  related?: Array<{ label: string; href: string }>;
};

/** Published research pages, newest first on the hub. */
const researchPages: readonly ResearchPageContent[] = [
  monroeCountyTherapists as ResearchPageContent,
  monroeCountyPostpartumDepression as ResearchPageContent,
  monroeCountyDivorceCouples as ResearchPageContent,
];

export const RESEARCH_HUB_PATH = "/research";

export function researchPath(slug: string) {
  return `${RESEARCH_HUB_PATH}/${slug}`;
}

export function getResearchPages(): readonly ResearchPageContent[] {
  return researchPages;
}

export function getResearchPage(slug: string): ResearchPageContent | null {
  return researchPages.find((page) => page.slug === slug) ?? null;
}

export function getResearchSlugsForBuild() {
  return researchPages.map((page) => page.slug);
}

/** Every distinct source cited across the research pages, for the hub index. */
export function getResearchSources() {
  const seen = new Map<string, ResearchSource & { pages: string[] }>();
  for (const page of researchPages) {
    for (const source of page.sources) {
      const existing = seen.get(source.url);
      if (existing) {
        if (!existing.pages.includes(page.title))
          existing.pages.push(page.title);
      } else {
        seen.set(source.url, { ...source, pages: [page.title] });
      }
    }
  }
  return [...seen.values()];
}

/** Latest dateModified across the research pages, for the hub sitemap entry. */
export function getResearchLastModified() {
  return researchPages
    .map((page) => page.dateModified)
    .sort()
    .at(-1);
}
