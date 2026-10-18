# Exploration 08 — Seasonal botanical imagery

One original wild-rose illustration sits beside the Certified Imago Relationship Therapy copy on the specialties page. It quietly changes with the Rochester calendar: buds, flowers, rosehips, and bare branches. There are no visible seasonal labels, month names, explanatory copy, or controls.

The artwork uses the existing palette and the shared editorial grid. All CMS practice copy and consultation actions remain unchanged. The homepage retains the merged sunlight treatment. The decorative SVG is hidden from assistive technology and adds no focus stops. There are no new dependencies, network calls, persistent storage, or externally sourced artwork.

## Rendering

The hydrated component selects the meteorological season from the current month in `America/New_York`, independent of the visitor's time zone. The server renders a deterministic spring illustration, so static HTML and hydration agree. Explicit SVG dimensions and an unchanged aspect ratio reserve the same space for every season. Without JavaScript, the static illustration remains visible.

The illustration is still, including for reduced-motion visitors. On desktop it sits beside the Imago copy; on smaller screens it follows the Imago copy and Learn more link. It adds no explanatory section to the page.

## Verification

The browser coverage checks all four automatic calendar states, the UTC/Rochester month boundary, absence of seasonal UI, fixed artwork dimensions, hydration errors, overflow, accessibility of the Imago section, reduced motion, and the no-JavaScript fallback.

Earlier captures in `current/` show the previous homepage placement; they are retained for reference, with no new media added. The four automatic date states are in `artwork/`. See PR #29 for final full-suite results.
