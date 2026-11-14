import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/config/seo";
import { getHomePage, getSiteSettings } from "@/data/cms";
import {
  getResearchPage,
  getResearchSlugsForBuild,
  researchPath,
} from "@/data/research";
import { ResearchPage } from "@/page-modules/research-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return getResearchSlugsForBuild().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/research/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = getResearchPage(slug);
  if (!page) return {};

  const metadata = pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: researchPath(page.slug),
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: page.datePublished,
      modifiedTime: page.dateModified,
    },
  };
}

export default async function ResearchRoute(
  props: PageProps<"/research/[slug]">,
) {
  const { slug } = await props.params;
  const page = getResearchPage(slug);
  if (!page) notFound();

  const [home, site] = await Promise.all([getHomePage(), getSiteSettings()]);

  return <ResearchPage page={page} ctaContent={home?.cta} site={site} />;
}
