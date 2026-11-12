import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/config/seo";
import { getResourcesPage } from "@/data/cms";
import { ResourcesPage } from "@/page-modules/resources";

export const metadata: Metadata = pageMetadata({
  title: "Crisis and Pregnancy Support Resources in Rochester, NY",
  description:
    "Crisis lines and pregnancy and postpartum support for Rochester and Monroe County, NY, including 988, 211/LIFE LINE and the National Maternal Mental Health Hotline.",
  path: "/resources",
});

export default async function ResourcesRoute() {
  const resources = await getResourcesPage();
  if (!resources) notFound();

  return <ResourcesPage resources={resources} />;
}
