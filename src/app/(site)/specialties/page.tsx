import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/config/seo";
import { getSiteSettings, getSpecialtiesPage } from "@/data/cms";
import { SpecialtiesPage } from "@/page-modules/specialties";

export const metadata: Metadata = pageMetadata({
  title: "Therapy Services in Rochester, NY",
  description:
    "Individual therapy, Imago couples counseling, perinatal and postpartum support, and group therapy in Rochester, NY.",
  path: "/specialties",
});

export default async function SpecialtiesRoute() {
  const [specialties, site] = await Promise.all([
    getSpecialtiesPage(),
    getSiteSettings(),
  ]);
  if (!specialties) notFound();

  return <SpecialtiesPage specialties={specialties} site={site} />;
}
