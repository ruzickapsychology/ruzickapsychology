import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/config/seo";
import { getContactPage, getSiteSettings } from "@/data/cms";
import { getContactInterestLabel } from "@/config/services";
import { ContactPage } from "@/page-modules/contact";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Request a consultation with Dr. Christina Ruzicka. In-person in Rochester, NY and virtual appointments available.",
  path: "/contact",
});

export default async function ContactRoute(props: PageProps<"/contact">) {
  const searchParams = await props.searchParams;
  const interestParam = Array.isArray(searchParams.interest)
    ? searchParams.interest[0]
    : searchParams.interest;
  const initialInterest = getContactInterestLabel(interestParam);
  const [contact, site] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
  ]);
  if (!contact || !site) notFound();

  return (
    <ContactPage
      contact={contact}
      site={site}
      initialInterest={initialInterest}
    />
  );
}
