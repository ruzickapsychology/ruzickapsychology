# Template Customization

Use this checklist when extracting or cloning this repo into a new high-quality static marketing-site starter.

## 1. Create Project Infrastructure

- Create a new GitHub repo.
- Create a Vercel project.
- Create a Sanity project and dataset.
- Configure `.env.local` and Vercel env vars from `.env.example`.
- Confirm `npm run dev`, `/studio`, and `npm run verify` work.

## 2. Generalize Client-Specific Content

- Replace practice name, legal name, practitioner, email, phone, address, hours, portal URL, and service area in Sanity.
- Replace page singleton content.
- Replace specialties or service categories.
- Replace FAQ and blog content.
- Replace all images with licensed or client-provided assets.
- Re-seed only if the seed fixtures are intentionally updated.

## 3. Theme The Site

- Update `src/app/globals.css` theme tokens.
- Update `src/lib/theme.ts` to match the core palette for OpenGraph images.
- Update fonts in `src/app/layout.tsx` if needed.
- Keep semantic class names in components.
- Verify contrast for text on image bands and translucent overlays.

## 4. Content Model

Keep the first version simple:

- Practice settings singleton.
- Page singletons.
- Repeatable services/specialties.
- Repeatable blog posts.
- Constrained Portable Text.
- Image with alt.

Avoid a generic page builder unless the client needs frequent structural page changes.

## 5. Images

- Upload client-approved images to Sanity.
- Add alt text.
- Confirm hero images are eager only when they are the LCP image.
- Confirm below-the-fold images lazy load through `BackgroundImageLayer`.
- Remove unused local assets.

## 6. Forms

- Create a Web3Forms key or replace the provider intentionally.
- Keep spam protection and validation.
- Test local and production submissions.
- Verify success and error states.

## 7. SEO And Launch

- Update `NEXT_PUBLIC_SITE_URL`.
- Update code-owned page metadata in each route.
- Confirm sitemap and robots output.
- Add Search Console verification if needed.
- Submit the sitemap after launch.
- Review regulated-industry copy with the client or counsel when appropriate.

## 8. Agent Handoff

Before handing the starter to future agents:

- Keep `AGENTS.md` concise and current.
- Keep README focused on human onboarding.
- Keep docs split by topic.
- Run `npm run verify`.
- Spot-check desktop, tablet, and mobile.
- Confirm no stale client-specific ethics or copy remains unless intentionally part of the template.
