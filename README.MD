# Ruzicka Psychology

Marketing site for a therapy practice, built with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

## Project structure

```
src/
  app/              routes (home, about, contact, blog) + sitemap.ts, robots.ts, opengraph-image.tsx
  components/
    ui/             primitives: Section, Container, Button — compose pages from these
    header.tsx, footer.tsx
  content/          all site copy, separated from code
    site.ts         name, email, nav, portal URL, area served
    home.ts, about.ts
    blog/*.md        blog posts as markdown with frontmatter
  lib/
    blog.ts         reads + renders the markdown posts
    seo.ts          metadata helper + Psychologist JSON-LD
```

**Editing copy** lives in `src/content/` — no JSX needed. **New blog post**: drop a `.md` file in `src/content/blog/` with `title`, `date`, `excerpt` frontmatter.

## Contact form

The contact form posts to a server action (`src/app/contact/actions.ts`) that delivers inquiries via [Web3Forms](https://web3forms.com) (free, no DNS setup).

1. Go to [web3forms.com](https://web3forms.com), enter the email that should receive inquiries (e.g. `christina@ruzickapsychology.com`), and they email you an **access key**.
2. Set `WEB3FORMS_ACCESS_KEY` (see `.env.example`) — locally in `.env.local`, and in Vercel project settings for production.

Without the key, the form shows a "please email directly" message instead of sending. Real intake/scheduling still flows through the SimplePractice **Client Portal** linked in the nav.

## Deploying

Deploy on [Vercel](https://vercel.com) — connect this GitHub repo and it builds on every push. No config needed for a standard Next.js app.
