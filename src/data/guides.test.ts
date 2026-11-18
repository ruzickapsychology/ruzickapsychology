import { describe, expect, it } from "vitest";
import { SERVICE_SLUGS } from "@/config/services";
import { guidePageJsonLd, guideHubJsonLd } from "@/config/seo";
import { SITE_URL } from "@/config/site";
import { getResearchPages } from "./research";
import {
  getGuide,
  getGuidePages,
  getGuides,
  getServiceGuideLinks,
  POSTPARTUM_GUIDE_SERVICE_LINKS,
} from "./guides";

const linkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const staticPaths = new Set([
  "/",
  "/about",
  "/specialties",
  "/pricing",
  "/faq",
  "/contact",
  "/resources",
  "/research",
  "/blog",
  "/privacy",
]);

function pageStrings(page: ReturnType<typeof getGuidePages>[number]) {
  return [
    page.title,
    page.headline,
    page.summary,
    page.answer,
    page.metaDescription,
    page.next.text,
    ...page.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.items ?? []),
    ]),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ];
}

describe("reader guides", () => {
  const guide = getGuide("postpartum");
  const pages = guide ? getGuidePages(guide) : [];
  const guideSlugs = new Set(pages.map((page) => page.slug));
  const researchSlugs = new Set(getResearchPages().map((page) => page.slug));

  function isKnownPath(href: string) {
    const path = href.split(/[?#]/)[0];
    if (staticPaths.has(path)) return true;
    const [, section, slug, extra] = path.split("/");
    if (extra) {
      return (
        section === "guides" && slug === "postpartum" && guideSlugs.has(extra)
      );
    }
    if (section === "guides") return slug === "postpartum";
    if (section === "specialties")
      return (SERVICE_SLUGS as readonly string[]).includes(slug);
    if (section === "research") return researchSlugs.has(slug);
    return false;
  }

  it("loads the postpartum guide with unique slugs in stage order", () => {
    expect(guide).not.toBeNull();
    expect(getGuides()).toHaveLength(1);
    expect(guideSlugs.size).toBe(pages.length);
    const stages = pages.map((page) => page.stage);
    expect(stages).toEqual(
      [...stages].sort(
        (a, b) =>
          ["learn", "compare", "decide"].indexOf(a) -
          ["learn", "compare", "decide"].indexOf(b),
      ),
    );
  });

  it("keeps titles and descriptions within search limits", () => {
    for (const page of pages) {
      expect(page.metaTitle.length, page.slug).toBeLessThanOrEqual(60);
      expect(page.metaDescription.length, page.slug).toBeLessThanOrEqual(165);
    }
  });

  it("links only to pages that exist", () => {
    for (const page of pages) {
      for (const text of pageStrings(page)) {
        for (const [, , href] of text.matchAll(linkPattern)) {
          if (/^https:\/\//.test(href)) continue;
          expect(isKnownPath(href), `${page.slug}: ${href}`).toBe(true);
        }
      }
      expect(isKnownPath(page.next.href), page.slug).toBe(true);
      for (const related of page.related) {
        expect(guideSlugs.has(related), `${page.slug}: ${related}`).toBe(true);
        expect(related).not.toBe(page.slug);
      }
      for (const source of page.sources) {
        expect(source.url, page.slug).toMatch(/^https:\/\//);
      }
    }
  });

  it("avoids claims the practice cannot make and stray markup", () => {
    for (const page of pages) {
      for (const text of pageStrings(page)) {
        expect(text, page.slug).not.toMatch(/—/);
        expect(text, page.slug).not.toMatch(/<[a-z/]|\*\*/i);
        expect(text, page.slug).not.toMatch(
          /certified|specialist|top-rated|guarantee|\bTBD\b/i,
        );
      }
    }
  });

  it("features existing guide pages on the postpartum service pages", () => {
    for (const [service, slugs] of Object.entries(
      POSTPARTUM_GUIDE_SERVICE_LINKS,
    )) {
      expect((SERVICE_SLUGS as readonly string[]).includes(service)).toBe(true);
      if (!pages.length) continue;
      for (const slug of slugs) expect(guideSlugs.has(slug), slug).toBe(true);
      expect(getServiceGuideLinks(service)?.pages).toHaveLength(slugs.length);
    }
    expect(getServiceGuideLinks("couples-therapy")).toBeNull();
  });

  it("describes guide pages as unreviewed articles by the practice", () => {
    if (!guide || !pages.length) return;
    const article = guidePageJsonLd(guide, pages[0]);
    expect(article["@type"]).toBe("Article");
    expect(article).not.toHaveProperty("reviewedBy");
    expect(article.mainEntityOfPage).not.toHaveProperty("reviewedBy");
    expect(article.url).toBe(`${SITE_URL}/guides/postpartum/${pages[0].slug}`);
    const hub = guideHubJsonLd(guide, pages);
    expect(hub["@type"]).toBe("CollectionPage");
    expect(hub.hasPart).toHaveLength(pages.length);
  });
});
