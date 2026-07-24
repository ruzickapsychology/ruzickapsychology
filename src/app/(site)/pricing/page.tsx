import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/config/seo";
import {
  getPricingPage,
  getPublishedServiceDefinitions,
  getSiteSettings,
} from "@/data/cms";
import { PricingPage } from "@/page-modules/pricing";

export const metadata: Metadata = pageMetadata({
  title: "Therapy Fees & Insurance in Rochester, NY",
  description:
    "Session fees, insurance information, and reimbursement guidance for therapy with Dr. Christina Ruzicka in Rochester, NY.",
  path: "/pricing",
});

export default async function PricingRoute() {
  const [pricing, site, publishedServices] = await Promise.all([
    getPricingPage(),
    getSiteSettings(),
    getPublishedServiceDefinitions(),
  ]);
  if (!pricing) notFound();

  return (
    <PricingPage
      pricing={pricing}
      site={site}
      publishedServices={publishedServices}
    />
  );
}
