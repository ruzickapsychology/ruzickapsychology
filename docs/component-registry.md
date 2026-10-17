# Component Registry

Use this registry before creating a component. Components are source-owned and
follow a shadcn-style composition contract while retaining CSS Modules.

## Component Contract

- Every component is a direct child folder of `src/components`.
- Primitive roots forward native element props, merge `className` with `cn()`,
  expose explicit variants, and publish a stable `data-slot`.
- Structured UI uses compound exports so the rendered hierarchy stays visible
  at the call site.
- Domain blocks may accept content data, but must compose the primitives below.

## Layout Primitives

- `section` — vertical rhythm and background tone.
- `container` — shared gutters and maximum widths.
- `grid`, `stack`, `action-group` — responsive layout and spacing.
  `ActionGroup as="span"` supports grouped links inside prose without invalid nesting.
  Grid's `portrait` and `editorial` layouts own the recurring two-child asymmetric
  compositions; `two`, `twoMd`, `twoLg`, `three`, `four` and `auto` own equal/card grids.
  Use `single` for a full-width stack with grid gaps; `align` owns vertical alignment.
- `page-shell` — standard page root and entrance behavior.
- `content-section` — Section + Container/GridContainer composition.
  Defaults to an ordinary container; accepts all Grid layouts and grid gap variants.
- `immersive-page-header` — shared full-bleed home/contact geometry with
  `ImmersivePageHeaderContent`, `ImmersivePageHeaderNavigation`, and
  `ImmersivePageHeaderJumpLink` compound slots.

## Compound Content

- `office-hours` — semantic day/time table for CMS hours lines. Splits the
  existing middle-dot delimiter, aligns times in a shared column, and preserves
  unstructured availability notes across both columns. Does not infer or change
  business hours.

- `content-header` — `ContentHeader`, `ContentHeaderEyebrow`,
  `ContentHeaderTitle`, `ContentHeaderDescription`, and
  `ContentHeaderActions`. `align="centerLeft"` centers on mobile and switches
  to left alignment at 768px; do not repeat that breakpoint in route CSS.
- `page-header` — `PageHeader`, `PageHeaderBreadcrumbs`,
  `PageHeaderContent`, `PageHeaderEyebrow`, `PageHeaderTitle`, and
  `PageHeaderDescription`. `PageHeaderTitle` always renders the page H1.
  `PageHeaderContent variant="overview"` centers overview introductions;
  `variant="editorial"` (default) left-aligns reading-page introductions.
- `disclosure-list` — `DisclosureList`, `DisclosureItem`,
  `DisclosureTrigger`, `DisclosureEyebrow`, `DisclosureTitle`, and
  `DisclosureContent`.
- `form-field` — `Field`, `FieldLabel`, `FieldDescription`, `FieldError`,
  `Input`, and `Textarea`.
  Controls own dimensions, borders, placeholder/focus styling and scroll clearance.
  Explicit default/inverse tones support paper and dark-image sections. Description
  and error refs support announced, focused form states.
- `typography` — canonical `Heading`, `Eyebrow`, and `Text` roles.
- `portable-content` — visible Sanity Portable Text with safe link support.

## Actions

- `button` — `Button` for button elements and `buttonVariants()` for links.
  `tone="inverse"` supplies light focus treatment on dark backgrounds.
- `cta-link` — button-styled internal consultation links with analytics.
- `text-link` — consistent navigation treatment; `variant="inline"` inherits prose
  typography and adds an underline without an arrow.
- `tracked-external-link` — external destinations with analytics.
- `pagination` — shared accessible numbered pagination.

## Navigation And Metadata

- `site-header`, `site-footer` — public-site chrome.
- `breadcrumbs`, `breadcrumb-trail` — visible hierarchy and matching JSON-LD.
- `json-ld` — safely serialized structured-data script output.
- `header-sentinel` — transparent-header scroll boundary.

## Media, Cards, And Brand

- `background-image-layer`, `circular-portrait` — responsive Sanity imagery.
  `BackgroundImageLayer readability="light"` adds the shared cream wash for dark
  text over artwork; the default leaves standalone imagery unchanged.
- `divider-grid`, `editorial-link-card`, `specialty-card` — reusable content
  blocks.
- `flower-mark`, `hero-badge`, `specialty-glyph`, `arrow-up-right` —
  brand-specific visual primitives.

## Domain Blocks

- `cta-section` — consultation call-to-action band.
- `status-page`, `error-content` — shared error and not-found presentation.

## Creation Rule

Extend an existing primitive or compound component before creating a new one.
Keep route-specific composition in its matching `src/page-modules/` folder
until it is reused. Promote repeated UI into `src/components/`. Do not
hide a reusable hierarchy behind `heading`, `intro`, `multiline`, or similar
configuration props when named compound children make the structure clearer.

Use `docs/pattern-library.md` for the canonical new-page and section recipes.
`npm run components:validate` enforces render-only page-module boundaries and
shared visible form/disclosure elements in addition to structure and typography.

## Intentional Local Composition

Home/contact image washes, contact submission animations, pricing fee rows and
blog editorial rows remain local because their behavior or composition differs.
Do not force these into tile cards or opaque panels for uniformity. Reuse shared
typography, controls, spacing and layout beneath those intentional differences.
FAQ/service/pricing disclosures already share the same compound components;
their differing heading levels and content are deliberate.

## Consistency review — October 17, 2026

All public render modules use the shared typography and section/header families.
Home and Contact intentionally use `ImmersivePageHeader`; About combines the
portrait grid with `ContentHeader`; editorial pages use `PageHeader`.

The review consolidated repeated Contact column spans, full-width section grids,
portrait alignment, responsive header alignment, fee-list spacing, related-card
columns, and service CTA link grouping. Privacy and fee links use the same inline
link variant. Repeated header/column geometry belongs in these shared APIs rather
than new route-level selectors.

Local CSS still owns image crops/washes, fee-row alignment and panel dividers,
blog editorial rows/navigation, map treatment, credentials, and submission states.
These are deliberate compositions, not alternate systems for page typography or
responsive columns. Current validation enforces component/route boundaries and
shared visible typography/controls; visual review is still needed to catch CSS
that duplicates a shared component's responsibility.
