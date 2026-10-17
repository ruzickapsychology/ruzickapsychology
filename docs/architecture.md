# Architecture

This site is a static Next.js App Router application backed by Sanity-managed content.

## Request Flow

1. App Router entries in `src/app/(site)/**/page.tsx` resolve metadata, params,
   route state, and data through helpers in `src/data/`.
2. `src/data/cms.ts` runs GROQ queries through the Sanity client and normalizes the result into page-friendly objects.
3. Route entries pass already-loaded, typed props to a matching module in
   `src/page-modules/`.
4. Page modules compose reusable UI primitives and own route-specific CSS
   without performing route data fetches.
5. The marketing route-group layout in `src/app/(site)/layout.tsx` fetches `siteSettings` for the header, footer, and structured data.

If CMS data is unavailable, helpers return `null`. Pages should avoid rendering stale fixture fallbacks.

## Core Directories

- `src/app/` - thin framework routes, route groups, metadata, sitemap, robots,
  OpenGraph image, and the embedded Studio route.
- `src/page-modules/` - public page rendering, route-level composition,
  route-specific CSS, and page-local client boundaries.
- `src/components/` - flat collection of source-owned primitives, compound
  components, and reusable domain blocks. Every component is a direct child
  folder.
- `src/data/` - CMS queries and page-facing data normalization.
- `src/config/` - code-owned site facts, SEO, service definitions, availability, image helpers, and theme values.
- `src/lib/` - small framework/runtime helpers that do not own site policy.
- `src/sanity/` - schema, Studio structure, Sanity env helpers.
- `src/content/` - seed fixtures only.
- `scripts/` - Sanity seed and repair scripts.

## Route And Page Ownership

`page.tsx` files own Next.js concerns: metadata, typed params/search params,
static-param generation, data loading, and route boundary decisions such as
`notFound()`. They should not import reusable UI components or CSS Modules.

Page modules compose content and layout from the shared component system. They
should not fetch route data, own design systems, normalize CMS results, or
introduce one-off utilities.

Preferred page-module shape:

```tsx
<Section size="spacious" tone="default">
  <GridContainer size="xl">...</GridContainer>
</Section>
```

## CMS Data Layer

`src/data/cms.ts` owns:

- GROQ queries.
- Static `defineQuery` strings that Sanity TypeGen can parse.
- Portable Text type normalization.
- Specialty ordering and active filtering.
- Blog post normalization.
- Null handling when Sanity is unavailable.

Route entries should not call the raw Sanity client directly. Add shared query
and normalization logic to `src/data/cms.ts`, then pass its result into the
page module.

## Sanity Studio

Studio is embedded at `/studio` through `src/app/studio/[[...tool]]/page.tsx` and `sanity.config.ts`.

`/studio` intentionally sits outside the `(site)` route group, so it does not render the public header/footer or trigger public CMS layout fetches.

For a reusable starter template, a standalone Studio can be considered for new projects, but this client repo intentionally keeps Studio embedded for simple operations.

## Header And Footer

`src/components/site-header/index.tsx` owns:

- Desktop navigation.
- Mobile full-screen navigation.
- Initial vs scrolled nav treatment.
- Client Portal external link tracking.

`src/components/site-footer/index.tsx` owns:

- Footer link layout.
- Practice facts from `siteSettings`.
- Rotating flower badge.
- Responsive footer behavior.

Do not duplicate navigation lists in page components. Code-owned navigation defaults live in `src/config/site.ts`; editable practice facts come from Sanity.

## SEO

`src/config/seo.ts` owns:

- `pageMetadata()`.
- `metadataBase`.
- Canonicals.
- OpenGraph defaults.
- Psychologist JSON-LD.

Each page should export metadata through `pageMetadata({ title, description, path })`. SEO fields are code-owned for now.

## Blog

Blog runtime content comes from Sanity `post` documents. `src/data/blog.ts` normalizes posts into the shape used by the blog index and detail pages, computes read time, and renders Portable Text with `PortableContent`.

Markdown files in `src/content/blog/` are seed fixtures, not runtime posts.

## Forms And Analytics

The contact form is client-side and posts directly to Web3Forms. See `docs/forms-analytics.md`.

Tracked events:

- `consultation_cta_click`
- `client_portal_click`
- `inquiry_submitted`

Keep events close to the interaction surface so future agents can reason about what fires and why.
