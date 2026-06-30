"use client";

import Link, { type LinkProps } from "next/link";
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
  href: LinkProps<string>["href"];
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
