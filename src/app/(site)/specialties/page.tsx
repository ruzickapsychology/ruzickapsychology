import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/config/seo";
import { getAboutPage, getSiteSettings, getSpecialtiesPage } from "@/data/cms";
import { SpecialtiesPage } from "@/page-modules/specialties";

export const metadata: Metadata = pageMetadata({
  title: "Therapy Services in Rochester, NY",
  description:
    "Individual and anxiety therapy, Imago couples therapy, postpartum anxiety and depression support, and a couples workshop in Rochester, NY.",
  path: "/specialties",
});

export default async function SpecialtiesRoute() {
  const [specialties, site, about] = await Promise.all([
    getSpecialtiesPage(),
    getSiteSettings(),
    getAboutPage(),
  ]);
  if (!specialties) notFound();

  return (
    <SpecialtiesPage specialties={specialties} site={site} about={about} />
  );
}
