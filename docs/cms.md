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
- Practice availability status.
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

## Practice Availability

`siteSettings.availabilityStatus` controls the public new-client state across
the home and contact pages:

- `accepting` - default state. Shows the rotating accepting-new-clients badge,
  existing consultation CTAs, and the contact form.
- `waitlist` - hides the rotating badge, changes consultation CTAs to waitlist
  language, and keeps the contact form available.
- `closed` - hides the rotating badge, removes new-client inquiry CTAs from the
  contact flow, and replaces the contact form with a Client Portal note for
  current clients.

`siteSettings.availabilityMessaging` contains the editable copy for the
`waitlist` and `closed` states. This Sanity object is the runtime source of
truth for non-default availability copy, including separate fields for the home
hero CTA, home bottom CTA, pricing bottom CTA, contact page header, and closed
contact panel.

`siteSettings.availabilityBadgeMessages` contains the two rotating hero badge
lines for each availability state. Keep each line short, uppercase, and 24
characters or fewer so the circular text spacing remains balanced.

If the field is missing on an older `siteSettings` document, the frontend treats
it as `accepting`.

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

## Reviewed website copy migrations

The SEO migration requires an explicit scope and a saved field-by-field preview.
For routine website copy, preview one document at a time:

```bash
npm run sanity:migrate-seo-pages -- -- --website-copy-only --document homePage --plan /private/tmp/homepage-plan.json
```

Review the exact before/after values, then apply that same plan with `--apply`
and `--backup /private/tmp/homepage-backup.json`. Files are created exclusively;
use fresh paths and keep backups outside Git. Changed revisions, fixtures,
scope, or target dataset require a new preview. Clinical/service scopes retain
their explicit review flags; `--all-content` is a broad replacement scope.

Existing drafts normally block writes. `--include-reviewed-drafts` is available
only for `--website-copy-only`: the preview includes both published and draft
revisions and only the allowlisted heading/form-note fields. Applying never
publishes or discards the draft. Coordinate publishing with editors because
draft nonexistence cannot be asserted atomically.

`--article-formatting-only` repairs the known romantic-attraction article's
three section-heading styles and stray delimiter span, plus the three existing
section-heading styles in the “Doing the Work” article. It requires exact
source-text matches and uses the same reviewed-plan, backup, revision, and
draft guards. It does not import fixture copy or change clinical wording.

`--verified-facts-only` narrowly corrects the known About license/certification
and South Avenue heading, adds verified profile links without removing existing
profiles, and initializes the shared emergency notice. It rejects unexpected
existing wording and uses the same saved-plan, backup, revision, and draft guards.
It does not update hours, insurance, billing, workshop details, or clinical prose.

The optional `siteSettings.safetyNotice` supplies the public footer notice. Keep
it concise and consistent with the contact-page emergency guidance. Missing
content renders nothing; it does not fall back to seed fixtures.

## Array key repair

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

## Ready website content batch

`npm run sanity:migrate-ready-website -- -- --plan /private/tmp/ready-plan.json`
previews only the verified About degree/year, general virtual-appointments FAQ,
and removal of the contradictory Pricing billing-code advice. It does not reseed.
Review the exact saved before/after values; apply that same file using `--apply`
and `--backup /private/tmp/ready-backup.json`. Both outputs are exclusive private
files; keep them outside Git. The runner checks project/dataset/scope, target
revisions, published source revisions, and relevant draft absence. A fresh preview
after successful application has zero changes. Any changed wording or revision
requires a fresh review. Coordinate publication with editors: draft absence and
read-only source revisions cannot be asserted atomically with the target writes.
