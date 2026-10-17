# A thread that becomes a flower

A fine rose-ink line follows the homepage's outer margin, folds into a small leaf, and sweeps inward to finish as a botanical drawing before the consultation invitation. It follows ordinary page scrolling and uses the existing paper and accent tokens.

## Try it

Open `/` and scroll from the hero through the specialties, biography, and location sections. The final flower appears above the consultation panel. At 375px the same thread lives in a narrow gutter and still finishes in a full-size flower. Enable reduced motion to see the complete static drawing.

## Implementation

The homepage remains server rendered. A local client wrapper receives its existing sections as children and adds an inaccessible, pointer-transparent SVG overlay. ResizeObserver measures the actual rendered content, so CMS copy, viewport changes, and font loading determine the drawing's height. A passive scroll listener schedules one animation frame; updates write only SVG paint properties and never move content. A fixed-proportion flower is rendered as the pre-hydration/no-JavaScript fallback. No dependencies, tracking, CMS fields, or content were added.

The flower uses original vector paths rather than generated imagery. The final 250–280px illustration space is deliberately reserved to prevent layout shifts.

## Review

Screenshots and a scroll recording are captured from the actual locally running homepage. Screenshots use reduced motion so the whole drawing can be reviewed; the recording shows the default scroll behavior.

- `1440-full.jpg`, `768-full.jpg`, `375-full.jpg`: complete responsive context.
- `1440-flower.jpg`, `768-flower.jpg`, `375-flower.jpg`: illustration and consultation context.
- `flower-thread-scroll.webm`: default motion demonstration.
- `capture-checks.json`: browser geometry, reduced motion, and keyboard checks.

## Validation

- Node 22.22.2 / npm 10.9.7.
- `npm run verify:quick`: passed, 24 unit test files / 105 tests.
- `npm run verify:ci`: generators, drift, structure, privacy, formatting, lint, and TypeScript passed; sandbox stopped at Sanity content validation with DNS ENOTFOUND. Parent will rerun with network access.

## Design assessment

This is a restrained editorial detail, with the final drawn flower as its payoff. It intentionally asks for no interaction and creates no new decision for a visitor. The left-margin line is subtle on a phone; the full flower remains visible at the same scale. This is an exploration, not a production rollout.
