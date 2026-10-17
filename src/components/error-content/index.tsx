"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/button";
import { StatusPage } from "@/components/status-page";

export function ErrorContent({ retry }: { retry: () => void }) {
  return (
    <StatusPage
      eyebrow="Something went wrong"
      heading="We couldn't load this page."
      message="Please try again. If the problem continues, you can return to the homepage or contact the practice directly."
      actions={
        <>
          <Button onClick={retry}>Try again</Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Return home
          </Link>
        </>
      }
    />
  );
}
