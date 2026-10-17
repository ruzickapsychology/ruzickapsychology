# Pattern Library

Start here when adding a page or section. Choose a pattern, supply typed content,
and compose the existing components. A normal content page should need no new CSS.

## Ownership

| Concern                                              | Owner                               |
| ---------------------------------------------------- | ----------------------------------- |
| Data loading, metadata, params, not-found decisions  | `src/app/(site)/**/page.tsx`        |
| Typed render-only composition                        | `src/page-modules/<name>/index.tsx` |
| CMS normalization and legacy compatibility           | `src/data/`                         |
| Pure formatting and destination helpers              | `src/lib/` and `src/config/`        |
| Background tone and vertical section spacing         | `Section` / `ContentSection`        |
| Width, gutters, responsive columns, internal spacing | `Container`, `Grid`, `Stack`        |
| Typography, controls, actions and focus styling      | Shared components                   |

Page modules import data types with `import type`; they do not import runtime
data loaders. The public layout already owns navigation, footer and analytics.
Do not repeat that chrome in a page module.

## Editorial Page Header

Use `PageShell`, then the compound `PageHeader`, then `ContentSection`.
`PageHeaderTitle` supplies the single H1; section titles are H2. This minimal
render module is a copyable starting point (the route supplies its CMS props):

```tsx
import { ContentSection } from "@/components/content-section";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
} from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { PortableContent } from "@/components/portable-content";
import type { RichText } from "@/data/cms";

export function EditorialPage({
  title,
  intro,
  body,
}: {
  title: string;
  intro: string;
  body: RichText;
}) {
  return (
    <PageShell>
      <PageHeader width="md">
        <PageHeaderContent align="left">
          <PageHeaderTitle>{title}</PageHeaderTitle>
          <PageHeaderDescription>{intro}</PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>
      <ContentSection containerSize="md" size="spacious">
        <PortableContent value={body} variant="article" />
      </ContentSection>
    </PageShell>
  );
}
```

Use `PageHeaderBreadcrumbs` with `BreadcrumbTrail` when needed. Keep header and
first content section adjacent: `PageShell` already removes duplicate leading
content padding. Prefer the default background on that first section so a new
color band does not begin flush against its content. Subsequent sections own
their normal padding. Do not compensate with page-specific margin arithmetic.

## Section Selection

| Need                                 | Use                                                               |
| ------------------------------------ | ----------------------------------------------------------------- |
| Prose, FAQ or one content block      | `ContentSection containerSize="md"`                               |
| Heading beside body/list             | `ContentSection layout="editorial"`                               |
| Portrait beside biography            | `GridContainer layout="portrait"` inside `Section`                |
| Equal columns                        | `Grid layout="two"` (640px), `twoMd` (768px), or `twoLg` (1024px) |
| Related reading                      | `EditorialLinkCardGrid` and `EditorialLinkCard`                   |
| Vertical grouping within a section   | `Stack` with an explicit `gap`                                    |
| Home/contact full-bleed introduction | `ImmersivePageHeader` compounds                                   |
| Consultation band                    | Availability-aware content passed to `CtaSection`                 |

`portrait` and `editorial` take exactly two direct children. Both stack below
1024px. At desktop, portrait uses 4 / spacer / 7 tracks; editorial uses
6 / spacer / 5. They own the spans; child CSS should not repeat them.
`ContentSection` accepts all `Grid` layouts and a grid `gap`. Its default
`layout="stack"` means an ordinary container; use `Stack` inside it when children
need vertical gaps. Do not use a 12-column site grid merely to stack full-width
children on new pages. Use `layout="single"` when retaining grid gaps between
full-width children. Grid alignment belongs in `align="start"` or `align="center"`.
Contact uses `twoLg` for both its introduction/form and location/map pairs.

```tsx
<ContentSection layout="editorial" size="spacious" tone="feature">
  <ContentHeader align="left" gap="none">
    <ContentHeaderEyebrow>The approach</ContentHeaderEyebrow>
    <ContentHeaderTitle>{heading}</ContentHeaderTitle>
  </ContentHeader>
  <PortableContent value={body} variant="article" />
</ContentSection>
```

The snippet uses `ContentHeader` compound exports, `ContentSection`, and
`PortableContent` from their registry entries. With a `Stack` or grid owning
spacing, use `ContentHeader gap="none"` to avoid adding its default trailing
margin as well. Intentionally editorial rows, image frames and animations may
keep local CSS; a new breakpoint or spacing system needs a specific reason.

## Service Detail

Use this order:

1. Breadcrumb and page introduction.
2. Concerns or fit indicators.
3. Clinical approach.
4. What sessions can involve.
5. In-person and virtual availability.
6. Visible service-specific FAQs.
7. Related articles and services.
8. Consultation CTA.

Visible copy and structured data must agree. Do not publish clinical or insurance claims until the practice owner reviews them.

The existing service route and `ServicePage` module already supply this pattern.
For another service, extend the service definition/slug registry and CMS content
and queries as needed, then verify publication, metadata and sitemap coverage.
Do not clone the rendering module for each service.

## Cards And Lists

Use the shared grid and container primitives. The complete card should be a coherent link target when it has one destination. Essential information must not depend on hover.

## Links

Use `TextLink variant="inline"` for prose links so they inherit surrounding
typography while remaining visibly underlined. Use ordinary internal links for navigation, `CtaLink` for consultation
conversion points, and `TrackedExternalLink` for tracked off-site destinations.
Use `Button` for button elements and `buttonVariants()` when a link needs the
same pill treatment.

## Forms And Disclosures

Use explicit `Field → FieldLabel + Input/Textarea + FieldDescription/FieldError`
composition. Controls have a complete default style; `tone="inverse"` is the
existing translucent treatment for dark image sections. Use the same tone on
descriptions/errors and the submit `Button`. IDs, label association, required
attributes and `aria-describedby` remain visible at the call site. Do not copy
border, padding, placeholder or focus rules into a new form.

```tsx
<Field>
  <FieldLabel htmlFor="email">Email address (required)</FieldLabel>
  <Input
    id="email"
    name="email"
    type="email"
    autoComplete="email"
    required
    aria-describedby="email-help"
  />
  <FieldDescription id="email-help">Where we can reply.</FieldDescription>
</Field>
```

Form workflow, provider submission, honeypots, success states and animations stay
with the form. `DisclosureList → DisclosureItem → DisclosureTrigger +
DisclosureContent` owns native details/summary behavior; use `PortableContent`
for normalized CMS answers. Keep compound hierarchy explicit rather than adding
an all-purpose form/page builder.

## New Page Checklist

1. Check the registry and reuse an existing route/module when the content shape matches.
2. If new CMS fields are needed, update schema, static GROQ, types and normalization;
   keep fixture content for seeding only. Do not add runtime fixture fallbacks.
3. Create the thin route with `pageMetadata` and typed data loading; read the installed
   Next.js routing/metadata guide first. Create its render-only page module using the recipe.
4. Use shared typography and section/layout patterns; keep one H1 and meaningful H2/H3 order.
5. Add navigation only where useful, and include the public URL in sitemap coverage.
6. Run `verify:quick`; use `verify:ci` for layout, forms or navigation changes.
   `components:validate` rejects data-layer runtime imports and raw visible
   controls/disclosures in page modules. Hidden anti-bot controls are deliberately exempt.

## Responsive Review

Review every new pattern at 375px, 768px, and desktop width. Verify heading order, keyboard focus, link purpose, tap targets, image cropping, and reduced motion.
