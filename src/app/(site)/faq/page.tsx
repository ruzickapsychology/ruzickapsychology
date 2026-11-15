import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/config/seo";
import { getAboutPage, getFAQPage, getSiteSettings } from "@/data/cms";
import { FAQPage } from "@/page-modules/faq";

export const metadata: Metadata = pageMetadata({
  title: "Therapy FAQs in Rochester, NY",
  description:
    "Answers to common questions about therapy in Rochester, NY with Dr. Christina Ruzicka, including her approach, first sessions, fees, and getting started.",
  path: "/faq",
});

export default async function FAQRoute() {
  const [faq, site, about] = await Promise.all([
    getFAQPage(),
    getSiteSettings(),
    getAboutPage(),
  ]);
  if (!faq) notFound();

  return <FAQPage faq={faq} site={site} about={about} />;
}
