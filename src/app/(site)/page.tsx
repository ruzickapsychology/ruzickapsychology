import { notFound } from "next/navigation";
import { getHomePage, getSiteSettings } from "@/data/cms";
import { HomePage } from "@/page-modules/home";

export default async function HomeRoute() {
  const [home, site] = await Promise.all([getHomePage(), getSiteSettings()]);
  if (!home) notFound();

  return <HomePage home={home} site={site} />;
}
