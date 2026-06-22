# Redesign: modern-feminine direction

A demo branch exploring a cleaner, warmer, more emotion-led direction, benchmarked
against [manhattanmoderntherapy.com](https://manhattanmoderntherapy.com/). The goal
is **clean, comfortable, slightly feminine** — not a copy. This doc captures the
extracted design system, our adapted system, and the checklist to finish porting.

## What the reference does well

- **Empathy-first hero** — leads with how the visitor *feels* ("Looking like you have
  it all together doesn't mean you feel that way"), not with credentials or services.
- **A short triad value band** — "Feel seen. Feel steady. Feel whole again." Three
  words, large type, lots of air.
- **Display-serif + clean-sans pairing** — an elegant high-contrast serif for emotion,
  a quiet geometric sans for everything else. This contrast is what reads "modern +
  feminine" rather than "clinical" or "fussy."
- **Generous whitespace**, thin rules instead of heavy cards, and italic accents.

### Reference design tokens (extracted)

| Role | Reference | Note |
|---|---|---|
| Ink / text | `rgba(60,33,40)` → `#3C2128` | deep plum-aubergine |
| Background | `#E9E2DB` / `#F9F7F5` | warm cream + near-white |
| Accent | `#CE9BA3` | dusty rose / blush |
| Secondary accent | `#B6C5D3` | soft dusty blue |
| Emphasis | `#884650` | wine / deep mauve (links, eyebrows) |
| Display font | Moulin Light | licensed — not usable |
| Sans font | Sailec Regular | licensed — not usable |
| Accent font | Lora (italic) | free (Google) — reused |

## Rebrand surface (the theme contract)

The whole site is themed through **semantic roles**, not color names, so trying a
new direction is fast and self-contained. To rebrand, edit only:

1. **`src/app/globals.css`** — the `@theme` block (the marked "theme contract"):
   the role palette (`--color-bg/-fg/-surface/-muted/-accent/-accent-soft/-feature`),
   the three font families, and `--radius-btn`.
2. **`src/app/layout.tsx`** — the three `next/font/google` imports if the fonts change.
3. **`src/lib/theme.ts`** — mirror of the role palette for the OG image (edge runtime
   can't read CSS vars). Keep it in sync with `globals.css`.

Markup never references a color name. It uses role utilities (`bg-surface`,
`text-accent`, `border-muted`, `text-fg`) and `Section` tones (`default`, `raised`,
`muted`, `feature`, `contrast`). Changing the values above re-skins every page with
no JSX edits.

## Layout & responsive system

Every page is built from two primitives, so spacing and width are consistent and
never hand-tuned per page:

- **`Section`** owns vertical rhythm + background `tone`. Use the `size` prop, never
  inline `py-*`: `compact` (`py-12 sm:py-16`), `default` (`py-16 sm:py-20`),
  `spacious` (`py-20 sm:py-28 md:py-32`). All sizes scale down on mobile.
- **`Container`** owns max-width + gutter: `sm`/`md`/`lg` (`max-w-2xl/3xl/5xl`) with a
  responsive `px-6 sm:px-8` gutter. The `Header` uses `Container size="lg"` too, so the
  global content width lives in one place.

**Pattern:** `<Section tone size><Container size>…</Container></Section>`. Content pages
(about, contact, blog) follow this exactly — no page sets its own padding.

**Breakpoint rule:** mobile-first, single column by default. **Multi-column content
grids collapse at `md`** (`md:grid-cols-2`, `md:grid-cols-3`). Typography is fluid via
`clamp()` (no per-breakpoint font sizes needed). Content caps at `max-w-5xl` and centers
on wide screens.

## Our adapted system (implemented in `globals.css`)

Our old palette was already plum/cream/rose — close. The new direction **warms and
deepens** it and adds the calming dusty blue as a true secondary.

**Colors** (semantic `@theme` roles, usable as `bg-*`/`text-*`/`border-*`):

| Role | Current hex | Use |
|---|---|---|
| `fg` | `#3c2128` | text; dark `contrast` bands (`bg-fg text-bg`); primary button |
| `bg` | `#f9f7f5` | default page background |
| `surface` | `#e9e2db` | raised / alternating sections (`raised` tone) |
| `muted` | `#dbd4cd` | hairline borders, subtle fills |
| `accent` | `#884650` | links, eyebrows, emphasis |
| `accent-soft` | `#ce9ba3` | secondary button, soft fills |
| `feature` | `#b6c5d3` | calming feature band (`feature` tone) |

**Type** — the key change. Licensed Moulin/Sailec are replaced with free Google
equivalents that capture the same feel:

| Role | Was | Now | Why |
|---|---|---|---|
| Display (h1–h3) | Marcellus | **Cormorant Garamond** (300) | high-contrast, elegant, feminine — Moulin stand-in |
| Body | PT Serif | **Mulish** (400/600/700) | clean humanist sans — Sailec stand-in |
| Accent | — | **Lora** italic | eyebrows, pull-quotes, attributions |

Helpers: `.eyebrow` (Lora italic, rose-dark — the section kicker), `.display-statement`
(Cormorant for the big emotional bands). Buttons are now uppercase pill CTAs.

**Section primitive** gained tones: `offwhite` (default), `cream`, `blue`, `greige`,
`ink`. Rhythm alternates offwhite → blue → cream so the page breathes.

## Homepage flow (implemented in `app/page.tsx`)

1. **Hero** — eyebrow + large empathy headline + subhead + CTA (offwhite, very airy).
2. **Triad band** — "Feel heard. Feel steady. Feel like yourself again." (blue tint).
3. **Specialties** — the 4 services as numbered, rule-topped entries (not boxed cards).
4. **The practice** — two-column intro to Dr. Ruzicka + link to About (cream).
5. **Philosophy pull-quote** — large Lora/Cormorant statement in her own voice.
6. **How we begin** — the 3-step intake (blue).
7. **Closing CTA** — emotional statement on ink + consultation CTA.

## Porting checklist

Done on this branch:

- [x] Extract reference design system (colors, type, structure)
- [x] New `@theme` tokens + type scale + `.eyebrow` / `.display-statement` helpers
- [x] Swap fonts to Cormorant Garamond + Mulish + Lora (`layout.tsx`)
- [x] Add `offwhite` / `blue` section tones
- [x] Rebuild the homepage to the new emotion-led flow

To finish before merging to `main`:

- [ ] **About page** — apply eyebrow + display headline; reflow `intro`/`credentials`
      with the new rhythm (currently inherits tokens but keeps old layout).
- [ ] **Contact page + form** — restyle inputs/labels to the sans; verify the success
      state and uppercase buttons read well.
- [ ] **Blog** (`/blog`, `/blog/[slug]`) — confirm `.prose` + Cormorant headings look
      right at long-read sizes; tune `.prose` line-length.
- [ ] **Header** — `font-heading` is now Cormorant; consider a Lora-italic or
      letter-spaced wordmark so the logo doesn't read too thin.
- [ ] **OG image** (`opengraph-image.tsx`) — refresh to the new ink/offwhite + a
      Cormorant-style face if we want it on-brand.
- [ ] **Imagery** — the look wants 1–2 soft, real photographs (office / Dr. Ruzicka).
      Use real photos; do **not** AI-generate her likeness.
- [x] **Responsive system** — `Section` size scale + responsive gutter; all content
      pages use `Section`/`Container`; grids collapse at `md`. (Visual spot-check at
      375px still worth doing in-browser before merge.)
- [ ] **Accessibility** — verify rose-dark/blue contrast on their backgrounds (AA);
      respect `prefers-reduced-motion` if any motion is added later.

## A note on the testimonials section

The reference leans heavily on client testimonials. For a licensed psychologist this
is **ethically restricted** — APA guidance discourages soliciting testimonials from
current therapy clients. This redesign deliberately replaces that beat with a
**first-person philosophy pull-quote** in Dr. Ruzicka's voice, which hits the same
emotional-trust note without the ethics risk. Only add real testimonials if counsel
confirms they're appropriate (e.g. from non-clients / professional referrers).
