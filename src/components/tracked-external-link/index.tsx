"use client";

import { track } from "@vercel/analytics";
import type { ComponentProps } from "react";

type TrackedExternalLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  event: string;
};

export function TrackedExternalLink({
  href,
  event,
  children,
  onClick,
  target = "_blank",
  rel = "noopener noreferrer",
  ...props
}: TrackedExternalLinkProps) {
  return (
    <a
      {...props}
      data-slot="tracked-external-link"
      href={href}
      target={target}
      rel={rel}
      onClick={(clickEvent) => {
        onClick?.(clickEvent);
        if (!clickEvent.defaultPrevented) track(event);
      }}
    >
      {children}
    </a>
  );
}
