"use client";

import { track } from "@vercel/analytics";
import Link, { type LinkProps } from "next/link";
import type { ComponentProps } from "react";
import {
  buttonVariants,
  type ButtonTone,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/button";

type CtaLinkProps = Omit<ComponentProps<typeof Link>, "className" | "href"> & {
  href: LinkProps<string>["href"];
  event: string;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
};

export function CtaLink({
  href,
  event,
  variant = "primary",
  tone = "default",
  size = "default",
  className,
  children,
  onClick,
  ...props
}: CtaLinkProps) {
  return (
    <Link
      {...props}
      data-slot="cta-link"
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      href={href}
      className={buttonVariants({ variant, tone, size, className })}
      onClick={(clickEvent) => {
        onClick?.(clickEvent);
        if (!clickEvent.defaultPrevented) track(event);
      }}
    >
      {children}
    </Link>
  );
}
