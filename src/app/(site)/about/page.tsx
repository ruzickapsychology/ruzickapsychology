import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/config/seo";
import { getAboutPage, getSiteSettings } from "@/data/cms";
import { AboutPage } from "@/page-modules/about";

export const metadata: Metadata = pageMetadata({
  title: "Dr. Christina Ruzicka, PsyD | Rochester Psychologist",
  description:
    "Evidence-based psychotherapy tailored to your goals, with Dr. Christina Ruzicka, Psy.D., Licensed Clinical Psychologist in Rochester, NY.",
  path: "/about",
});

export default async function AboutRoute() {
  const [about, site] = await Promise.all([getAboutPage(), getSiteSettings()]);
  if (!about) notFound();

  return <AboutPage about={about} site={site} />;
}
