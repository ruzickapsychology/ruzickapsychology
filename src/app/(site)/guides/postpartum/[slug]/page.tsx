import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/config/seo";
import { getSiteSettings } from "@/data/cms";
import { getGuide, getGuidePage } from "@/data/guides";
import { guidePath } from "@/lib/guides";
import { GuidePage } from "@/page-modules/guide-page";

const GUIDE_SLUG = "postpartum";

export const dynamicParams = false;

export function generateStaticParams() {
  return (getGuide(GUIDE_SLUG)?.pages ?? []).map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/guides/postpartum/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const found = getGuidePage(GUIDE_SLUG, slug);
  if (!found) return {};

  const metadata = pageMetadata({
    title: found.page.metaTitle,
    description: found.page.metaDescription,
    path: guidePath(GUIDE_SLUG, found.page.slug),
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: found.page.datePublished,
      modifiedTime: found.page.dateModified,
    },
  };
}

export default async function PostpartumGuidePageRoute(
  props: PageProps<"/guides/postpartum/[slug]">,
) {
  const { slug } = await props.params;
  const found = getGuidePage(GUIDE_SLUG, slug);
  if (!found) notFound();
  const { guide, page } = found;
  const related = page.related
    .map((relatedSlug) => getGuidePage(GUIDE_SLUG, relatedSlug)?.page)
    .filter((item) => item !== undefined);
  const site = await getSiteSettings();

  return <GuidePage guide={guide} page={page} related={related} site={site} />;
}
