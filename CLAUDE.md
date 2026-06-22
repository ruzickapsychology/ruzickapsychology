# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> ⚠️ The line above is not decorative: this is Next.js **16.2.9**, which has breaking
> changes vs. older training data. Read the relevant guide in `node_modules/next/dist/docs/`
> before using any Next.js API you're unsure about.

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build (use this to verify a change compiles; the build also runs type-checking and generates all static routes)
- `npm run lint` — ESLint (`eslint-config-next`)
- `npm run start` — serve the production build

There is **no test suite** — verification is `npm run lint` + `npm run build`.

## What this is

Marketing site for a solo therapy practice (Dr. Christina Ruzicka, Rochester NY). Static
Next.js App Router site on Vercel. No database, no auth — booking/intake happens off-site
through a SimplePractice "Client Portal" link, and the contact form emails inquiries.

## Architecture — the load-bearing ideas

**1. Copy is data, separated from JSX.** All site text lives in `src/content/` (`site.ts`,
`home.ts`, `about.ts`, typed `as const`). Pages import these and render them. Editing wording
means editing `src/content/*`, never the page components. `site.ts` is the canonical source
for name, email, nav, portal URL, and `areaServed`.

**2. Theme contract — rebrands are a one-file change.** Markup references **semantic role
utilities** (`bg-surface`, `text-accent`, `border-muted`, `text-fg`, `bg-feature`), never
brand color names. Roles are defined in the `@theme` block of `src/app/globals.css` (Tailwind
v4 — there is no `tailwind.config.js`; `@theme` tokens generate the utilities). To re-skin the
whole site, edit only: the `@theme` block, the three `next/font/google` imports in
`src/app/layout.tsx`, and `src/lib/theme.ts` (a JS mirror of the palette used by the edge-runtime
OG image, which can't read CSS vars). Keep `theme.ts` and `@theme` in sync. See `docs/redesign.md`.

**3. Layout system — compose pages from two primitives.** `Section` (`tone` + responsive `size`)
and `Container` (`size` = max-width + responsive gutter) in `src/components/ui/`. The canonical
page shape is `<Section tone size><Container size>…</Container></Section>`; every page including
content pages follows it, so **no page sets its own padding**. Conventions: vertical rhythm comes
from `Section size` (`compact`/`default`/`spacious`, all scale down on mobile) — never inline
`py-*`; multi-column grids collapse at `md`; typography is fluid via `clamp()` (set on `h1`–`h3`
in `globals.css`), so no per-breakpoint font sizes.

**4. SEO is centralized in `src/lib/seo.ts`.** Every route exports `metadata` built by
`pageMetadata({ title, description, path })` — this sets the canonical URL, OpenGraph, and title
suffix. `site.url` (from `NEXT_PUBLIC_SITE_URL`) drives canonicals, `sitemap.ts`, `robots.ts`, and
the OG image. The root layout injects `psychologistJsonLd()` structured data. When adding a page,
export `metadata` via `pageMetadata` and it's automatically in the sitemap-able set.

**5. Blog is file-based markdown.** Drop a `.md` file in `src/content/blog/` with `title`,
`date`, `excerpt` frontmatter. `src/lib/blog.ts` reads it (gray-matter) and renders HTML (remark);
`/blog/[slug]` is statically generated via `generateStaticParams`.

**6. Contact form degrades gracefully.** `src/app/contact/contact-form.tsx` (a client component
using `useActionState`) posts to the `submitInquiry` server action in `contact/actions.ts`, which
delivers via Web3Forms. **Without `WEB3FORMS_ACCESS_KEY` the form shows a "please email directly"
message and does not send — this is intentional, not a bug.**

## Environment variables

Set in `.env.local` for local dev (gitignored) and in Vercel for production. See `.env.example`.

- `NEXT_PUBLIC_SITE_URL` — canonical base URL (defaults to the prod domain). Leave pointed at the
  real domain even on preview deploys so canonicals/sitemap stay correct.
- `WEB3FORMS_ACCESS_KEY` — turns on contact-form delivery (see above).
- `GOOGLE_SITE_VERIFICATION` — Search Console token; renders a verification `<meta>` site-wide.

## Conventions & constraints

- **Branching:** demo/redesign work goes on branches (e.g. `redesign/modern-feminine`); do not
  commit to `main`/`master` unless asked.
- **Ethics (non-obvious, intentional):** this is a licensed psychologist's site. Do **not** add
  client testimonials (APA discourages soliciting them from current clients) and do **not**
  AI-generate Dr. Ruzicka's likeness — use real photos. The homepage uses a first-person
  philosophy pull-quote in place of testimonials by design. See the note in `docs/redesign.md`.
- `docs/launch.md` is the go-live runbook (DNS cutover, Vercel env vars, Search Console, Google
  Business Profile).
