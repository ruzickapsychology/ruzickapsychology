"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { buttonClasses } from "@/components/ui/button";

type Variant = "primary" | "secondary" | "outline";

export function CtaLink({
  href,
  event,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  event: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={buttonClasses(variant, className)}
      onClick={() => track(event)}
    >
      {children}
    </Link>
  );
}

export function TrackedExternalLink({
  href,
  event,
  className,
  children,
}: {
  href: string;
  event: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => track(event)}
    >
      {children}
    </a>
  );
}
