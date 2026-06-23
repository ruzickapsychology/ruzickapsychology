/**
 * Role palette for contexts that can't read CSS variables (the OG image runs
 * in the edge runtime). Keep these values in sync with the `@theme` block in
 * `globals.css` — together they are the rebrand surface.
 */
export const theme = {
  bg: "#eae6dd",
  fg: "#3a232a",
  body: "#514a4c",
  surface: "#fbf8f1",
  muted: "#e7ddcd",
  accent: "#8c4651",
  accentSoft: "#e3c7cb",
  feature: "#efe2d6",
  light: "#f1eeeb",
} as const;
