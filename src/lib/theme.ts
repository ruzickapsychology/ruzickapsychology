/**
 * Role palette for contexts that can't read CSS variables (the OG image runs
 * in the edge runtime). Keep these values in sync with the `@theme` block in
 * `globals.css` — together they are the rebrand surface.
 */
export const theme = {
  bg: "#f9f7f5",
  fg: "#3c2128",
  surface: "#e9e2db",
  muted: "#dbd4cd",
  accent: "#884650",
  accentSoft: "#ce9ba3",
  feature: "#b6c5d3",
} as const;
