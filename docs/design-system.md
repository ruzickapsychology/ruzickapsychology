# Design System

The design system should feel calm, editorial, and tactile without becoming decorative clutter. Pages should be spacious, grid-aligned, and easy to scan.

## Theme Tokens

Theme values live in the `@theme` block of `src/app/globals.css`. Tailwind CSS v4 generates utilities from these tokens.

| Token                     |                       Hex | Use                                           |
| ------------------------- | ------------------------: | --------------------------------------------- |
| `bg`                      |                 `#eae6dd` | Paper page background                         |
| `fg`                      |                 `#3a232a` | Primary ink, headings, dark CTAs              |
| `body`                    |                 `#514a4c` | Default body copy                             |
| `surface`                 |                 `#fbf8f1` | Raised panels and cards                       |
| `muted`                   |  `rgb(241 238 235 / 0.9)` | Hairline borders and grid strokes             |
| `accent`                  |                 `#8c4651` | Links, eyebrows, emphasis                     |
| `accent-soft`             |                 `#e3c7cb` | Soft hover and selection color                |
| `feature`                 |                 `#efe2d6` | Warm feature bands                            |
| `light`                   |                 `#f1eeeb` | Text on dark/image sections                   |
| `cream`                   |                 `#e5ded9` | Alternate light text and translucent overlays |
| `icon`                    |                 `#c79da4` | Therapy specialty animated icons              |
| `contact-overlay`         |                 `#251f12` | Contact form field wash                       |
| `quote-overlay`           |                 `#071819` | Quote image wash                              |
| `footer-badge`            |                 `#685b5f` | Footer rotating badge text                    |
| `primary-hover`           |                 `#52333b` | Primary CTA hover                             |
| `nav-home-overlay`        |     `rgb(18 46 58 / 0.3)` | Home initial nav overlay                      |
| `nav-contact-overlay`     |    `rgb(37 31 18 / 0.25)` | Contact initial nav and toast overlay         |
| `nav-quote-overlay`       |      `rgb(7 24 25 / 0.3)` | Nav overlay above quote imagery               |
| `nav-solid-overlay`       |  `rgb(217 211 198 / 0.8)` | Scrolled nav and toast overlay                |
| `contact-responsive-wash` |    `rgb(37 31 18 / 0.35)` | Contact image wash on tablet/mobile           |
| `hover-wash`              | `rgb(241 238 235 / 0.24)` | Shared quadrant/card hover wash               |

Use semantic utilities such as `text-icon`, `bg-feature/35`, `border-muted`, and `text-light`. Avoid raw hex values in components.

`src/lib/theme.ts` mirrors the core palette for the OpenGraph image runtime, which cannot read CSS variables.

## Typography

Fonts are loaded in `src/app/layout.tsx`.

- Heading/body serif: Libre Baskerville.
- Eyebrow and small sans labels: Manrope.
- Mono utility labels and buttons: IBM Plex Mono.

Current content styles:

- Hero/display headings: native `h1`.
- Section headings: `h2` or `.heading-section`.
- Module headings: `.heading-module`.
- Item headings: `h3` or `.heading-item`.
- Body 1: `.body-1`, 18px emphasis copy.
- Body 2: `.body-2`, 16px default paragraphs and page body.
- Body 3: `.body-3`, 14px detailed notes, form fields, compact descriptions.
- Labels/eyebrows/meta: `.eyebrow`, `.mono-label`, 13px.

Do not invent one-off font sizes unless a new reusable style is needed.

## Layout

Use:

```tsx
<Section size="spacious" tone="default">
  <Container size="xl" className="site-grid">
    ...
  </Container>
</Section>
```

`Section` sizes:

- `compact` - short utility sections.
- `default` - normal content bands.
- `page` - page headers and long-form pages.
- `spacious` - major marketing sections.

`Container` sizes:

- `sm` - narrow text.
- `md` - article and FAQ width.
- `lg` - medium content.
- `xl` - full marketing grid.

`site-grid` is the shared grid system. Keep hero elements, cards, forms, footer columns, and media aligned to it.

## CTA Variants

- Primary CTA: `buttonClasses("primary")`, dark pill with light text from `src/components/ui/button/button.module.css`.
- Secondary button CTA: `buttonClasses("secondary")`, light pill with a subtle border.
- Outline button CTA: `buttonClasses("outline")`, transparent pill with an ink stroke.
- Secondary CTA: underlined `.mono-label` text link with the arrow glyph, such as `Learn more ->` when represented in code as the chosen arrow character.
- External CTA: same text treatment plus the shared up-right arrow icon.

Avoid rogue button styles. If a new pill/button CTA style is needed, add it to `src/components/ui/button/button.module.css`, expose it through `buttonClasses()`, and document it here.

## Component Recipes

### Normal Page Header

```tsx
<Section size="page">
  <Container size="md">
    <div className="text-center">
      <h1>{page.heading}</h1>
      <p className="body-2 mx-auto mt-4 max-w-[520px]">{page.intro}</p>
    </div>
  </Container>
</Section>
```

### Full-Bleed Image Section

```tsx
<Section size="spacious" className="bg-fg relative overflow-hidden">
  <BackgroundImageLayer image={section.backgroundImage} />
  <div className="bg-quote-overlay/20 absolute inset-0 z-0" aria-hidden />
  <Container size="xl" className="site-grid relative z-10">
    ...
  </Container>
</Section>
```

Use `next/image` directly for above-the-fold hero images. Use `BackgroundImageLayer` below the fold.

### CTA Module

```tsx
<Section size="spacious" className="bg-feature/35 relative overflow-hidden">
  <BackgroundImageLayer image={cta.backgroundImage} />
  <Container size="xl" className="site-grid relative z-10">
    <div className="grid-center-xl border-muted bg-feature/90 rounded-none border px-8 py-20 text-center sm:px-12">
      <h2>{cta.heading}</h2>
      <p className="body-1 mx-auto mt-4.5 max-w-[430px]">{cta.body}</p>
    </div>
  </Container>
</Section>
```

### Grid Module

Use `grid-card-2`, `grid-card-4`, `rp-q`, and `border-muted`. Hover wash behavior is centralized in CSS. Do not hand-code new divider colors.

### Accordion Module

Use native `<details>` and `<summary>` unless a stronger interaction need appears. Keep dividers `border-muted`, use the shared plus/X icon treatment, and keep collapsed content readable.

### Blog List And Detail

Use `src/lib/blog.ts` helpers. Blog cards should be tappable as a whole and use the shared hover wash. Blog detail pages should use `Section size="page"` with `Container size="md"`.

## Mobile Rules

- Start single-column by default.
- Collapse complex grids at `md` unless documented otherwise.
- Keep tap targets comfortable.
- Do not rely on hover for essential information.
- Check 375px, 768px, and desktop widths after layout changes.

## Motion

Motion should be gentle and meaningful. Animations live in `globals.css` or purpose-built components. Always preserve `prefers-reduced-motion` behavior.

## CSS Ownership

Use a hybrid CSS model:

- `src/app/globals.css` owns theme tokens, typography, grid primitives, shared hover states, and cross-page content utilities such as `.prose`.
- Colocated `*.module.css` files own component-only selectors, button variants, local keyframes, and one-off state transitions.
- Every reusable component under `src/components` gets its own folder. The folder entrypoint should be `index.tsx`/`index.ts`; generated CSS Module declaration files may sit beside their CSS.
- CSS Module declarations are generated by automation. Run `npm run verify` before handoff if you add or rename CSS Module classes.
- Run `npm run components:validate` to enforce the component-folder rule.

Do not place component-only selectors in `globals.css` just because it is convenient. If a selector is only used by one component, colocate it.
