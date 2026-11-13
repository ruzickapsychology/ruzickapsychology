import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SERVICE_SLUGS } from "@/config/services";
import { getResearchPages, getResearchSources } from "@/data/research";
import { researchTextSegments } from "@/lib/research-text";

const staticRoutes = new Set([
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
  ...SERVICE_SLUGS.map((slug) => `/specialties/${slug}`),
]);

function allText(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allText);
  if (value && typeof value === "object")
    return Object.values(value).flatMap(allText);
  return [];
}

describe("research pages", () => {
  const pages = getResearchPages();

  it("has at least one page with unique slugs", () => {
    expect(pages.length).toBeGreaterThan(0);
    expect(new Set(pages.map((page) => page.slug)).size).toBe(pages.length);
  });

  it.each(pages.map((page) => [page.slug, page] as const))(
    "%s has a headline, sources and a CSV that exists",
    (_slug, page) => {
      expect(page.title.length).toBeGreaterThan(10);
      expect(page.headline).toMatch(/\d/);
      expect(page.sources.length).toBeGreaterThan(0);
      for (const source of page.sources)
        expect(source.url).toMatch(/^https:\/\//);
      if (page.csv) {
        const file = join(process.cwd(), "public", page.csv.href);
        expect(existsSync(file)).toBe(true);
        const lines = readFileSync(file, "utf8").trim().split("\n");
        expect(lines.length - 1).toBe(page.csv.rows);
      }
    },
  );

  it.each(pages.map((page) => [page.slug, page] as const))(
    "%s links only to routes that exist",
    (_slug, page) => {
      const researchRoutes = new Set(pages.map((p) => `/research/${p.slug}`));
      const internal = allText(page)
        .flatMap(researchTextSegments)
        .filter((segment) => segment.kind === "link" && !segment.external)
        .map((segment) => (segment.kind === "link" ? segment.href : ""));
      const related = (page.related ?? []).map((link) => link.href);
      for (const href of [...internal, ...related])
        expect(staticRoutes.has(href) || researchRoutes.has(href)).toBe(true);
    },
  );

  it("never names a clinician as author or reviewer", () => {
    const text = allText(pages).join(" ");
    expect(text).not.toMatch(/Reviewed by|Medically reviewed/i);
  });

  it("indexes each source once", () => {
    const urls = getResearchSources().map((source) => source.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("researchTextSegments", () => {
  it("splits links from text", () => {
    expect(
      researchTextSegments(
        "See [the list](/resources) or [NYSED](https://x.y).",
      ),
    ).toEqual([
      { kind: "text", text: "See " },
      { kind: "link", text: "the list", href: "/resources", external: false },
      { kind: "text", text: " or " },
      { kind: "link", text: "NYSED", href: "https://x.y", external: true },
      { kind: "text", text: "." },
    ]);
  });
});
