import Link from "next/link";
import { buttonVariants } from "@/components/button";
import { StatusPage } from "@/components/status-page";

export default function SiteNotFound() {
  return (
    <StatusPage
      eyebrow="Page unavailable"
      heading="This page is not available."
      message="The requested content may be missing or temporarily unavailable. Please try again soon, or return home."
      actions={
        <Link href="/" className={buttonVariants()}>
          Return home
        </Link>
      }
    />
  );
}
