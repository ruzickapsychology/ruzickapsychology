import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/config/seo";
import {
  getAboutPage,
  getServicePage,
  getServiceSlugsForBuild,
  getSiteSettings,
} from "@/data/cms";
import { getServiceDefinition } from "@/config/services";
import { getServiceGuideLinks } from "@/data/guides";
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

  const [service, site, about] = await Promise.all([
    getServicePage(definition.slug),
    getSiteSettings(),
    definition.practitionerReviewed ? getAboutPage() : null,
  ]);
  if (!service || !site) notFound();

  return (
    <ServicePage
      service={service}
      site={site}
      about={about}
      practitionerReviewed={definition.practitionerReviewed}
      guide={getServiceGuideLinks(definition.slug)}
    />
  );
}
