import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/config/seo";
import { getFAQPage } from "@/data/cms";
import { FAQPage } from "@/page-modules/faq";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Common questions about therapy with Dr. Christina Ruzicka — what she helps with, her style, first sessions, fees, and how to begin.",
  path: "/faq",
});

export default async function FAQRoute() {
  const faq = await getFAQPage();
  if (!faq) notFound();

  return <FAQPage faq={faq} />;
}
