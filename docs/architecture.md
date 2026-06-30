# Architecture

This site is a static Next.js App Router application backed by Sanity-managed content.

## Request Flow

1. App Router pages in `src/app/(site)/*/page.tsx` call CMS helpers from `src/lib/cms.ts`.
2. `src/lib/cms.ts` runs GROQ queries through the Sanity client and normalizes the result into page-friendly objects.
3. Pages compose reusable UI primitives and pass normalized content into presentational components.
4. The marketing route-group layout in `src/app/(site)/layout.tsx` fetches `siteSettings` for the header, footer, and structured data.

If CMS data is unavailable, helpers return `null`. Pages should avoid rendering stale fixture fallbacks.

## Core Directories

- `src/app/` - routes, route groups, route metadata, sitemap, robots, OpenGraph image, embedded Studio route.
- `src/components/` - reusable components, header, footer, analytics-aware links.
- `src/components/ui/` - low-level UI primitives and reusable visual components.
- `src/lib/` - CMS data layer, blog normalization, SEO, image helpers, theme mirror.
- `src/sanity/` - schema, Studio structure, Sanity env helpers.
- `src/content/` - seed fixtures only.
- `scripts/` - Sanity seed and repair scripts.

## Page Ownership

Pages should compose content and layout. They should not own design systems, data normalization, content constants, or one-off utilities.

Preferred page shape:

```tsx
<Section size="spacious" tone="default">
  <Container size="xl" className="site-grid">
    ...
  </Container>
</Section>
```

## CMS Data Layer

`src/lib/cms.ts` owns:

- GROQ queries.
- Static `defineQuery` strings that Sanity TypeGen can parse.
- Portable Text type normalization.
- Specialty ordering and active filtering.
- Blog post normalization.
- Null handling when Sanity is unavailable.

Pages should not call the raw Sanity client directly unless adding a route-specific query that belongs in `src/lib/cms.ts`.

## Sanity Studio

Studio is embedded at `/studio` through `src/app/studio/[[...tool]]/page.tsx` and `sanity.config.ts`.

`/studio` intentionally sits outside the `(site)` route group, so it does not render the public header/footer or trigger public CMS layout fetches.

For a reusable starter template, a standalone Studio can be considered for new projects, but this client repo intentionally keeps Studio embedded for simple operations.

## Header And Footer

`src/components/header/index.tsx` owns:

- Desktop navigation.
- Mobile full-screen navigation.
- Initial vs scrolled nav treatment.
- Client Portal external link tracking.

`src/components/footer/index.tsx` owns:

- Footer link layout.
- Practice facts from `siteSettings`.
- Rotating flower badge.
- Responsive footer behavior.

Do not duplicate navigation lists in page components. Code-owned navigation defaults live in `src/lib/site-defaults.ts`; editable practice facts come from Sanity.

## SEO

`src/lib/seo.ts` owns:

- `pageMetadata()`.
- `metadataBase`.
- Canonicals.
- OpenGraph defaults.
- Psychologist JSON-LD.

Each page should export metadata through `pageMetadata({ title, description, path })`. SEO fields are code-owned for now.

## Blog

Blog runtime content comes from Sanity `post` documents. `src/lib/blog.ts` normalizes posts into the shape used by the blog index and detail pages, computes read time, and renders Portable Text with `PortableContent`.

Markdown files in `src/content/blog/` are seed fixtures, not runtime posts.

## Forms And Analytics

The contact form is client-side and posts directly to Web3Forms. See `docs/forms-analytics.md`.

Tracked events:

- `consultation_cta_click`
- `client_portal_click`
- `inquiry_submitted`

Keep events close to the interaction surface so future agents can reason about what fires and why.
