import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/config/seo";
import {
  getServicePage,
  getServiceSlugsForBuild,
  getSiteSettings,
} from "@/data/cms";
import { getServiceDefinition } from "@/config/services";
import { ServicePage } from "@/page-modules/service";

export async function generateStaticParams() {
  return (await getServiceSlugsForBuild()).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/specialties/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const definition = getServiceDefinition(slug);
  if (!definition) return {};

  return pageMetadata({
    title: definition.pageTitle,
    description: definition.description,
    path: `/specialties/${definition.slug}`,
  });
}

export default async function ServiceRoute(
  props: PageProps<"/specialties/[slug]">,
) {
  const { slug } = await props.params;
  const definition = getServiceDefinition(slug);
  if (!definition) notFound();

  const [service, site] = await Promise.all([
    getServicePage(definition.slug),
    getSiteSettings(),
  ]);
  if (!service || !site) notFound();

  return <ServicePage service={service} site={site} />;
}
