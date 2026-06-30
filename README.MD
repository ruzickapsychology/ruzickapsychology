# Ruzicka Psychology

Static marketing site for Dr. Christina Ruzicka's therapy practice in Rochester, New York. Built with Next.js App Router, TypeScript, Tailwind CSS v4, Sanity Studio, Vercel Analytics, and Web3Forms.

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

Use Node.js 22 and npm 10, matching `package.json`, `.node-version`, and CI.

## Scripts

- `npm run dev` - start the dev server
- `npm run verify:quick` - fast edit loop: component structure, lint, typecheck, and unit tests
- `npm run verify` - full code handoff: generators, generated-file drift check, formatting, lint, typecheck, content validation, tests, and build
- `npm run verify:ci` - local equivalent of GitHub CI, including Playwright browser install and e2e checks
- `npm run verify:release` - CI tier plus Lighthouse CI
- `npm run build` - production build and static route generation
- `npm run start` - serve the production build
- `npm run lint` - run ESLint
- `npm run typecheck` - generate Next route types and run TypeScript
- `npm run typegen` - extract the Sanity schema and generate Sanity types
- `npm run css-types` - generate TypeScript declarations for CSS Modules
- `npm run check:generated` - fail if generated Sanity or CSS Module declaration files are stale
- `npm run test` - run unit tests
- `npm run test:e2e` - run Playwright accessibility and smoke tests
- `npm run lhci` - run Lighthouse CI against a local production server
- `npm run sanity:validate-content` - validate required Sanity content and image alt text
- `SANITY_DRY_RUN=1 npm run sanity:seed` - preview the seed operation
- `npm run sanity:seed` - upload seed fixtures to the configured Sanity dataset
- `npm run sanity:repair-keys` - add missing `_key` values to Sanity arrays created without keys

## Environment Variables

Set these in `.env.local` for local development and in Vercel for production:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=vq39ihmt
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-06-24
NEXT_PUBLIC_SITE_URL=https://www.ruzickapsychology.com
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=
GOOGLE_SITE_VERIFICATION=
```

`NEXT_PUBLIC_SITE_URL` drives canonicals, OpenGraph, sitemap, and robots output. Keep it pointed at the production domain unless you intentionally want preview-specific SEO output.

`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is a public Web3Forms access key. The form submits directly from the browser, so this value is expected to be public.

## Project Shape

```text
src/
  app/                 App Router pages, route groups, metadata, sitemap, robots, Studio route
  components/          Header, footer, analytics links, reusable UI primitives
  content/             deterministic seed fixtures only
  lib/                 CMS queries, image helpers, SEO, blog normalization
  sanity/              Sanity schema, Studio structure, env helpers
scripts/
  seed-sanity.ts       idempotent Sanity seed from src/content fixtures
  validate-sanity-content.ts
  repair-sanity-array-keys.ts
docs/
  architecture.md
  cms.md
  design-system.md
  forms-analytics.md
  performance.md
  template-customization.md
```

Runtime content comes from Sanity, not from `src/content`. The fixture files in `src/content/*` and `src/content/blog/*.md` exist so the seed script can recreate the initial CMS content.

## Sanity Setup

1. Create or choose a Sanity project and dataset.
2. Put the project ID, dataset, and API version in `.env.local`.
3. Run `npm run dev` and open http://localhost:3000/studio.
4. Log in to Sanity if prompted.
5. Seed initial content:

```bash
SANITY_DRY_RUN=1 npm run sanity:seed
npm run sanity:seed
```

The seed script uses deterministic IDs. Singletons are replaced on each run. Repeatable documents such as specialties and posts use `createIfNotExists` by default so local seed fixtures do not overwrite production editorial changes.

To intentionally reset repeatable documents from fixtures, run:

```bash
SANITY_SEED_OVERWRITE_REPEATABLES=1 npm run sanity:seed
```

If Studio shows "Missing keys" for an array field, run:

```bash
npm run sanity:repair-keys
```

## Contact Form

The contact form lives in `src/app/(site)/contact/contact-form.tsx`. It submits directly to Web3Forms, includes basic validation and a honeypot, shows success/error UI, and tracks `inquiry_submitted` with Vercel Analytics.

To enable delivery, create a Web3Forms access key for the recipient inbox and set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`.

## Deploy

Deploy to Vercel from GitHub. Required production environment variables:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
- `GOOGLE_SITE_VERIFICATION` if Search Console verification is needed

After changing Vercel env vars, redeploy.

## Verification

Before pushing important changes:

```bash
npm run verify:ci
```

Before launch or performance-sensitive handoffs:

```bash
npm run verify:release
```

For CMS or launch changes, also spot-check:

- `/`
- `/about`
- `/specialties`
- `/pricing`
- `/contact`
- `/faq`
- `/blog`
- one `/blog/[slug]`
- `/studio`

## Troubleshooting

- Build fails with missing Sanity env vars: add the `NEXT_PUBLIC_SANITY_*` variables in Vercel and redeploy.
- `/studio` 404s on Vercel: confirm the latest deployment built successfully and the Sanity public env vars exist in that environment.
- Pages render blank: the required Sanity singleton is missing or unreachable. Seed the dataset or inspect the query in Studio Vision.
- Contact form does not send: confirm `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is set in the browser environment and that Web3Forms accepts the key.
- Lighthouse flags image delivery: check `docs/performance.md` before changing image code.
