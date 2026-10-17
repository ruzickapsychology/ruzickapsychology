import type { Metadata } from "next";
import { pageMetadata } from "@/config/seo";
import { PrivacyPage } from "@/page-modules/privacy";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Notice",
  description:
    "How Ruzicka Psychology handles website inquiries, analytics data, and information shared through this website.",
  path: "/privacy",
});

export default function PrivacyRoute() {
  return <PrivacyPage />;
}
