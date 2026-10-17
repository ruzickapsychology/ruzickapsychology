export const HEADER_SENTINEL_ID = "hero-sentinel";

import type { ComponentProps } from "react";

export function HeaderSentinel(props: Omit<ComponentProps<"div">, "id">) {
  return (
    <div
      {...props}
      data-slot="header-sentinel"
      id={HEADER_SENTINEL_ID}
      aria-hidden
    />
  );
}
