"use client";

import { track } from "@vercel/analytics";

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
      rel="noopener noreferrer"
      className={className}
      onClick={() => track(event)}
    >
      {children}
    </a>
  );
}
