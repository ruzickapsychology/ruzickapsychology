# Sanity CMS

Sanity is the runtime content source for the site. The local content files are seed fixtures only.

## Documents

Singleton IDs:

- `siteSettings`
- `homePage`
- `aboutPage`
- `specialtiesPage`
- `pricingPage`
- `contactPage`
- `faqPage`

Repeatable documents:

- `specialty`
- `post`

The Studio structure in `src/sanity/structure.ts` groups singleton pages separately from repeatable documents so non-technical editors can find the right content quickly.

## Schema Location

- `src/sanity/schemaTypes/documents/` - document schemas.
- `src/sanity/schemaTypes/objects/` - reusable object schemas.
- `src/sanity/schemaTypes/index.ts` - schema registry.
- `sanity.config.ts` - embedded Studio config and plugins.

Use `defineType`, `defineField`, and `defineArrayMember`. Prefer editor-friendly fields over design-specific knobs.

## Content Model Guidance

Good CMS fields:

- Page headings, intros, body copy.
- CTA labels and copy.
- Practice facts.
- Therapy specialties and detailed descriptions.
- FAQ questions and answers.
- Blog post title, excerpt, publish date, and body.
- Images with alt text.

Keep code-owned:

- Navigation structure.
- SEO metadata shape.
- Form field structure and validation.
- Specialty icon mapping and animations.
- Layout choices, grid spans, and responsive behavior.
- Analytics event names.

## Seeding

The seed script is `scripts/seed-sanity.ts`.

It reads:

- `src/content/site.ts`
- `src/content/home.ts`
- `src/content/about.ts`
- `src/content/specialties.ts`
- `src/content/pricing.ts`
- `src/content/contact.ts`
- `src/content/faq.ts`
- `src/content/blog/*.md`
- selected images from `public/images/`

Run:

```bash
SANITY_DRY_RUN=1 npm run sanity:seed
npm run sanity:seed
```

The script uses deterministic IDs. Singleton pages and practice settings use `createOrReplace`.

Repeatable documents such as specialties and posts use `createIfNotExists` by default. This prevents old fixtures from overwriting real editorial changes after launch.

To intentionally reset repeatable documents from fixtures:

```bash
SANITY_SEED_OVERWRITE_REPEATABLES=1 npm run sanity:seed
```

Expected initial content:

- 1 practice settings document.
- 6 page singleton documents.
- 4 specialties.
- 3 blog posts.

## Array Keys

Sanity arrays need stable `_key` values for Studio editing. API-created content can miss keys if scripts do not add them.

If Studio shows "Missing keys", run:

```bash
npm run sanity:repair-keys
```

The repair script patches known singleton pages and repeatable docs with missing array keys.

## Images

Use the shared `imageWithAlt` object for meaningful images. Editors should provide alt text that describes the image's content or purpose.

Sanity images should have hotspot support where the image may crop across breakpoints. Frontend code should request appropriately sized images through:

- `src/lib/next-image-loader.ts` for `next/image`.
- `BackgroundImageLayer` for below-the-fold cover images that still need responsive image loading.

## Portable Text

Keep Portable Text constrained. This site needs paragraphs, simple emphasis, and links. Avoid allowing arbitrary embedded layout blocks unless the content model intentionally moves toward a page-builder model.

## Studio Notes

Studio is embedded at `/studio`. This is convenient for the current client repo. For a generalized starter, consider whether a standalone Studio repo or workspace is preferable before cloning the pattern broadly.

The Studio route is outside the public `(site)` route group. Keep it that way so Studio does not inherit marketing navigation, footer, or public CMS layout fetches.
