<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Guide

Canonical instructions for Codex, Claude Code, and other coding agents working in this repo.

## Commands

- `npm run dev` - start the dev server at http://localhost:3000
- `npm run verify:quick` - run the normal edit verification path: lint, typecheck, and unit tests
- `npm run verify` - run the full code handoff path: generators, generated-file drift check, formatting check, lint, typecheck, Sanity content checks, unit tests, and build
- `npm run verify:ci` - run the local equivalent of GitHub CI, including Playwright browser install and e2e checks
- `npm run verify:release` - run the CI tier plus Lighthouse CI
- `npm run build` - create a production build; this also type-checks and generates static routes
- `npm run typecheck` - run Next route type generation and TypeScript
- `npm run typegen` - generate Sanity schema/query types
- `npm run check:generated` - fail if generated Sanity or CSS Module declaration files are stale or untracked
- `npm run test` - run unit tests
- `npm run test:e2e` - run Playwright smoke/accessibility checks against the current production build
- `npm run lhci` - run Lighthouse CI against a local production server
- `npm run sanity:validate-content` - validate required CMS content and image alt text
- `npm run start` - serve the production build after `npm run build`
- `SANITY_DRY_RUN=1 npm run sanity:seed` - preview the Sanity seed operation
- `npm run sanity:repair-keys` - repair missing Sanity array `_key` values after API-created content

Use `npm run verify:quick` for normal code and content edits. Use `npm run verify` before larger code handoffs. Use `npm run verify:ci` for layout, navigation, form, image, accessibility, or CI-parity checks. Use `npm run verify:release` before launch or performance-sensitive handoffs. Run `npm run build` directly when you need to inspect static generation, route output, or production-only behavior. `npm run test:e2e` starts `npm run start`, so run `npm run build` first or prefer `npm run verify:ci` to avoid testing a stale `.next` build. Use Node.js 22 and npm 10, matching `package.json`, `.node-version`, and CI.

## Agent Automation

- Codex has a repo-local `PostToolUse` hook in `.codex/hooks.json` for `apply_patch`, `Edit`, `Write`, and `MultiEdit`.
- Claude Code has a matching repo-local `PostToolUse` hook in `.claude/settings.json` for `Edit`, `Write`, and `MultiEdit`.
- Both hooks call `scripts/format-hook-files.mjs`, which formats edited files, runs ESLint fixes on JS/TS files, and regenerates CSS Module declarations when needed.
- Hook coverage is tool-specific. Codex hooks only run inside Codex after matched Codex tools; Claude hooks only run inside Claude Code after matched Claude tools. Edits made by other editors, shell commands, generators, or untrusted/disabled hooks still rely on explicit verification or commit hooks.
- Repo-local Codex and Claude hooks may need to be reviewed and trusted with `/hooks`.
- Husky and lint-staged run formatting, ESLint fixes, and CSS Module declaration generation for staged files on commit.
- Treat hooks as guardrails. Still run the appropriate verification command before handing off meaningful changes.

## Instruction Surfaces

- Keep `AGENTS.md` as the canonical cross-agent entrypoint, with tool-specific shims such as `CLAUDE.md` and `.github/copilot-instructions.md` pointing back here.
- Do not add repo-local skills yet. This repo is small enough that `AGENTS.md` plus the topic docs below is the preferred progressive-disclosure model.
- Add a repo-local skill only if a repeated workflow becomes too procedural for these docs, such as a multi-step release checklist or CMS migration playbook.

## When To Read More

| Change area                                                      | Read first                                              |
| ---------------------------------------------------------------- | ------------------------------------------------------- |
| Visual layout, spacing, typography, buttons, responsive behavior | `docs/design-system.md`                                 |
| Sanity schemas, GROQ, seed data, content validation              | `docs/cms.md`                                           |
| Images, loading behavior, Lighthouse, Core Web Vitals            | `docs/performance.md`                                   |
| Contact form, analytics events, conversion tracking              | `docs/forms-analytics.md`                               |
| Environment variables, deployment, launch checks                 | `docs/launch.md`                                        |
| Components and approved composition patterns                     | `docs/component-registry.md`, `docs/pattern-library.md` |
| Security headers, providers, and privacy                         | `docs/security.md`                                      |
| Extracting this into a reusable starter                          | `docs/template-customization.md`                        |
| Next.js APIs, routing, config, metadata, typed routes            | Relevant local guide in `node_modules/next/dist/docs/`  |

## What This Is

This is a static marketing site for a solo therapy practice: Dr. Christina Ruzicka in Rochester, New York. It uses Next.js App Router, plain CSS with colocated CSS Modules, an embedded Sanity Studio, Vercel Analytics, and Web3Forms. Booking and intake happen off-site through the SimplePractice Client Portal link.

## Runtime Content

Sanity is the runtime source of truth. App Router entries fetch normalized
content through `src/data/cms.ts` and pass it to render-only page modules.

`src/content/*` and `src/content/blog/*.md` are seed fixtures only. They exist so `scripts/seed-sanity.ts` can recreate the initial Sanity documents with deterministic IDs. Do not add runtime fallbacks to these files, and do not duplicate CMS copy in JSX.

If Sanity data is missing, a page may render nothing rather than falling back to stale local content. Fix the content or seed data instead of adding redundancy.

## Routes And Page Modules

- `src/app/` is the framework boundary. Public `page.tsx` files own metadata,
  typed params/search params, static-param generation, data loading, and route
  decisions such as `notFound()`.
- `src/page-modules/` owns route-level rendering and route-specific CSS. Each
  module lives in its own folder with an `index.tsx` entrypoint and receives
  already-loaded, typed props.
- Public `page.tsx` files must not import reusable components or CSS Modules
  directly. They should delegate rendering to one page module.
- Page modules must not fetch route data. Shared CMS and blog reads belong in
  `src/data/` and are called by the App Router entry.
- Page modules may import data types only; put pure presentation helpers in
  `src/lib/` or `src/config/`. Start new pages from `docs/pattern-library.md`.
- Keep Next.js convention files such as `layout.tsx`, `error.tsx`, and
  `not-found.tsx` in `src/app/`; shared layouts may compose site chrome there.
- Do not create `src/pages/`. This project uses the App Router, and
  `src/page-modules/` deliberately avoids the reserved Pages Router name.

## Layout And Design

Use the reusable primitives in the flat `src/components/` directory:

```tsx
<Section tone="default" size="spacious">
  <GridContainer size="xl">...</GridContainer>
</Section>
```

- `Section` owns vertical spacing and background tone. Avoid page-specific `py-*` when a `Section` size can express the rhythm.
- `Container` owns gutters and max width. Keep important content aligned to the shared grid.
- `Grid`, `GridContainer`, `Stack`, `ContentSection`, and `PageHeader` own
  responsive page composition. Do not recreate these structures in route CSS.
- `Heading`, `Eyebrow`, `Text`, `ContentHeader`, and `PortableContent` own
  visible typography. Public page modules must not contain raw `h1`-`h3` or
  paragraph elements.
- Follow the shadcn-style open-code and composition model while retaining CSS
  Modules. Low-level components forward native element props, expose explicit
  variants, merge `className` with `cn()`, and publish stable `data-slot`
  attributes.
- Prefer compound APIs for structured UI. Compose
  `ContentHeaderEyebrow`/`ContentHeaderTitle`/`ContentHeaderDescription`,
  `PageHeaderContent`/`PageHeaderTitle`, `Field`/`FieldLabel`/`Input`, and
  `DisclosureTrigger`/`DisclosureTitle`/`DisclosureContent` instead of adding
  configuration props that hide the rendered hierarchy.
- Domain blocks such as `SiteHeader`, `SiteFooter`, `CtaSection`, and
  `SpecialtyCard` may accept content-oriented props, but they must compose the
  shared primitives rather than recreate their styles.
- `globals.css` owns theme tokens, typography, grid helpers, shared hover states, and cross-page content utilities.
- Component selectors, local keyframes, and component state transitions belong in colocated CSS Modules named `styles.module.css`. Do not introduce utility-CSS framework classes. CSS Module type declarations are generated into `.generated/css-types` by automation and checked during verification.
- Every reusable component is a direct child of `src/components`, in its own
  folder with an `index.tsx`/`index.ts` entrypoint. Do not recreate `ui/` or
  `layout/` category directories.
- Use `Button` for actual buttons and `buttonVariants()` for links that use a
  button treatment. Do not invent button styles outside
  `src/components/button/`.
- Use semantic CSS variables such as `var(--color-accent)`, `var(--color-light)`, `var(--color-icon)`, `var(--color-feature)`, and `var(--color-muted)`.
- Do not add new hard-coded brand hex values in components unless there is a clear reason and the value is promoted to a theme token afterward.
- Multi-column layouts should collapse cleanly at `md` unless a component has its own documented breakpoint behavior.
- Respect `prefers-reduced-motion` for any new animation.

See `docs/design-system.md` for recipes and visual rules.

## Images And Performance

- Use `next/image` for meaningful images and above-the-fold hero imagery.
- Use `BackgroundImageLayer` for below-the-fold Sanity images that need cover behavior but should still benefit from responsive loading and lazy loading.
- Avoid CSS `background-image` for large or meaningful images. CSS backgrounds are acceptable for tiny decorative textures and controlled overlays.
- Always provide useful Sanity image alt text unless the image is purely decorative.
- Sanity-hosted images are optimized by `src/lib/next-image-loader.ts`; do not bypass it with raw oversized URLs.

See `docs/performance.md`.

## CMS

- Sanity config lives in `sanity.config.ts`; schema lives in `src/sanity/schemaTypes/`.
- Singleton document IDs are `siteSettings`, `homePage`, `aboutPage`, `specialtiesPage`, `pricingPage`, `contactPage`, and `faqPage`.
- Repeatable content currently includes `specialty` and `post`.
- Seed logic lives in `scripts/seed-sanity.ts`; array-key repair lives in `scripts/repair-sanity-array-keys.ts`.
- Singletons are replaced by the seed script. Repeatable documents use `createIfNotExists` unless `SANITY_SEED_OVERWRITE_REPEATABLES=1` is set.
- Use `defineType`, `defineField`, and `defineArrayMember` for schema work.
- Keep `defineQuery` calls static and parseable by Sanity TypeGen; do not build query strings with template interpolation.
- Model editor-friendly content fields, not page-builder presentation knobs, unless the project explicitly changes direction.

See `docs/cms.md`.

## SEO And Analytics

- SEO metadata is code-owned in `src/config/seo.ts`.
- Every route should export metadata with `pageMetadata({ title, description, path })`.
- Structured data is injected from `src/app/(site)/layout.tsx` using `practiceJsonLd()`, so `/studio` does not inherit marketing chrome or CMS fetches.
- Vercel Analytics events live near their interaction surfaces in components such as `src/components/cta-link/index.tsx`, `src/components/tracked-external-link/index.tsx`, and `src/page-modules/contact/contact-form/index.tsx`.

## Contact Form

The contact form is a client component in `src/page-modules/contact/contact-form/index.tsx`. It submits directly to Web3Forms with `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, validates required fields, includes a honeypot, tracks successful human submissions, and shows client-side success/error states.

Do not reintroduce a server action unless the product goal changes. The current direct Web3Forms path keeps the site static and simple.

## Environment Variables

Set local variables in `.env.local` and production variables in Vercel. Keep `.env.example` in sync.

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
- `GOOGLE_SITE_VERIFICATION`

## Ethics And Client-Specific Constraints

Ruzicka-specific:

- Do not add client testimonials without explicit legal/ethical review.
- Do not AI-generate Dr. Ruzicka's likeness. Use real photos only.
- Keep clinical claims conservative and evidence-aligned.

Template guidance:

- For regulated or licensed-service websites, treat testimonials, before/after claims, medical claims, and lead-capture copy as requiring client/legal review.
- Keep SEO code-owned unless the content model explicitly needs editor-managed SEO.

## Do Not

- Do not edit generated Sanity content by hand in the dataset when a seed or migration script should own the change.
- Do not add duplicate content constants in JSX.
- Do not use large CSS background images for content images.
- Do not create one-off spacing systems on individual pages.
- Do not remove accessibility labels, focus states, alt text, or reduced-motion handling while restyling.
