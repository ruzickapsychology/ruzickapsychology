import type { Metadata } from "next";
import { pageMetadata } from "@/config/seo";
import { getHomePage, getSiteSettings } from "@/data/cms";
import { getResearchPages, getResearchSources } from "@/data/research";
import { ResearchHubPage } from "@/page-modules/research-hub";

export const metadata: Metadata = pageMetadata({
  title: "Research: Mental Health Data for Rochester and Monroe County",
  description:
    "Data studies on therapists, new parents, couples and loneliness in Rochester and Monroe County, NY, built from public sources with every figure dated and linked.",
  path: "/research",
});

export default async function ResearchHubRoute() {
  const [home, site] = await Promise.all([getHomePage(), getSiteSettings()]);

  return (
    <ResearchHubPage
      pages={getResearchPages()}
      sources={getResearchSources()}
      ctaContent={home?.cta}
      site={site}
    />
  );
}
