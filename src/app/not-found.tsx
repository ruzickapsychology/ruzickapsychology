import Link from "next/link";
import { buttonVariants } from "@/components/button";
import { StatusPage } from "@/components/status-page";

export default function NotFound() {
  return (
    <main>
      <StatusPage
        eyebrow="Not found"
        heading="This page is not available."
        message="The page you requested does not exist, or its content is not available right now."
        actions={
          <Link href="/" className={buttonVariants()}>
            Return home
          </Link>
        }
      />
    </main>
  );
}
