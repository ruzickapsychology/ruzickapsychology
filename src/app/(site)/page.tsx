import { notFound } from "next/navigation";
import { getAboutPage, getHomePage, getSiteSettings } from "@/data/cms";
import { HomePage } from "@/page-modules/home";

export default async function HomeRoute() {
  const [home, site, about] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getAboutPage(),
  ]);
  if (!home) notFound();

  return <HomePage home={home} site={site} philosophy={about?.philosophy} />;
}
