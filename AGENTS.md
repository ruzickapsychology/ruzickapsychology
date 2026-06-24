<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Guide

This file provides repository guidance for coding agents working in this project, including Codex, Claude Code, and other agentic tools. Keep project-specific instructions here so each agent can use the same source of truth.

## Commands

- `npm run dev` - start the dev server at http://localhost:3000
- `npm run build` - create a production build; this also type-checks and generates static routes
- `npm run lint` - run ESLint
- `npm run start` - serve the production build after `npm run build`

There is no test suite. Use `npm run lint` and `npm run build` to verify changes.

Next.js 16 requires Node.js 20.9 or newer.

## What This Is

This is a marketing site for a solo therapy practice: Dr. Christina Ruzicka in Rochester, NY. It is a static Next.js App Router site intended for Vercel. There is no database and no auth. Booking and intake happen off-site through a SimplePractice Client Portal link, and the contact form emails inquiries.

## Architecture

### Copy Is Data

All site text lives in `src/content/`, including `site.ts`, `home.ts`, `about.ts`, and other typed `as const` content files. Pages import this content and render it. Editing wording usually means editing `src/content/*`, not page components.

`src/content/site.ts` is the canonical source for the practice name, email, navigation, portal URL, and `areaServed`.

### Theme Contract

Markup should use semantic role utilities such as `bg-surface`, `text-accent`, `border-muted`, `text-fg`, and `bg-feature`, not brand color names.

Theme roles are defined in the `@theme` block of `src/app/globals.css`. This project uses Tailwind CSS v4, so there is no `tailwind.config.js`; `@theme` tokens generate the utilities.

For a site reskin, keep these files in sync:

- `src/app/globals.css` - Tailwind `@theme` tokens
- `src/app/layout.tsx` - `next/font/google` imports
- `src/lib/theme.ts` - JavaScript mirror of the palette used by the edge-runtime OG image, which cannot read CSS variables

See `docs/redesign.md` for design notes.

### Layout System

Compose pages from the primitives in `src/components/ui/`:

- `Section` controls `tone` and responsive vertical `size`
- `Container` controls max width and responsive gutters

The canonical page shape is:

```tsx
<Section tone="..." size="...">
  <Container size="...">...</Container>
</Section>
```

Pages should not set their own section padding. Vertical rhythm comes from `Section size` (`compact`, `default`, or `spacious`), which scales down on mobile. Avoid inline `py-*` on pages. Multi-column grids should collapse at `md`. Typography is fluid via `clamp()` rules for `h1` through `h3` in `globals.css`, so avoid per-breakpoint heading font sizes.

### SEO

SEO is centralized in `src/lib/seo.ts`. Every route should export `metadata` built by:

```ts
pageMetadata({ title, description, path })
```

That helper sets canonical URLs, OpenGraph data, and the title suffix. `site.url`, from `NEXT_PUBLIC_SITE_URL`, drives canonicals, `sitemap.ts`, `robots.ts`, and the OG image. The root layout injects `psychologistJsonLd()` structured data.

When adding a page, export `metadata` through `pageMetadata`.

### Blog

The blog is file-based markdown. Add posts in `src/content/blog/` with `title`, `date`, and `excerpt` frontmatter.

`src/lib/blog.ts` reads markdown with `gray-matter` and renders HTML with `remark`. `/blog/[slug]` is statically generated through `generateStaticParams`.

### Contact Form

`src/app/contact/contact-form.tsx` is a client component using `useActionState`. It posts to the `submitInquiry` server action in `src/app/contact/actions.ts`, which delivers inquiries through Web3Forms.

Without `WEB3FORMS_ACCESS_KEY`, the form shows a "please email directly" message and does not send. This is intentional, not a bug.

## Environment Variables

Set local environment variables in `.env.local` and production variables in Vercel.

- `NEXT_PUBLIC_SITE_URL` - canonical base URL. Defaults to the production domain. Keep this pointed at the real domain even on preview deploys so canonicals and sitemap stay correct.
- `WEB3FORMS_ACCESS_KEY` - enables contact-form delivery.
- `GOOGLE_SITE_VERIFICATION` - Search Console token rendered as a site-wide verification meta tag.

## Conventions And Constraints

- Branching: demo and redesign work should happen on branches, such as `redesign/modern-feminine`. Do not commit to `main` or `master` unless explicitly asked.
- Ethics: this is a licensed psychologist's website. Do not add client testimonials. Do not AI-generate Dr. Ruzicka's likeness; use real photos only.
- The homepage uses a first-person philosophy pull quote in place of testimonials by design. See `docs/redesign.md`.
- `docs/launch.md` is the go-live runbook for DNS cutover, Vercel environment variables, Search Console, and Google Business Profile.
