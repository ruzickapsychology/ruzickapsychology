import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/config/seo";
import { getSiteSettings } from "@/data/cms";
import { getGuide, getGuidePages } from "@/data/guides";
import { guidePath } from "@/lib/guides";
import { GuideHubPage } from "@/page-modules/guide-hub";

const GUIDE_SLUG = "postpartum";

export function generateMetadata(): Metadata {
  const guide = getGuide(GUIDE_SLUG);
  if (!guide) return {};
  return pageMetadata({
    title: guide.metaTitle,
    description: guide.metaDescription,
    path: guidePath(guide.slug),
  });
}

export default async function PostpartumGuideRoute() {
  const guide = getGuide(GUIDE_SLUG);
  if (!guide) notFound();
  const site = await getSiteSettings();

  return (
    <GuideHubPage guide={guide} pages={getGuidePages(guide)} site={site} />
  );
}
