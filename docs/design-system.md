# Design System

The design system should feel calm, editorial, and tactile without becoming decorative clutter. Pages should be spacious, grid-aligned, and easy to scan.

## Theme Tokens

Theme values live in the `:root` contract in `src/app/globals.css`. The site uses plain CSS and colocated CSS Modules; there is no utility-CSS build step.

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

Use the semantic custom properties directly in CSS Modules, for example `var(--color-icon)`, `var(--color-feature)`, `var(--color-muted)`, and `var(--color-light)`. Avoid raw hex values in components.

`src/config/theme.ts` mirrors the core palette for the OpenGraph image runtime, which cannot read CSS variables.

## Typography

Fonts are loaded in `src/app/layout.tsx`.

- Heading/body serif: Libre Baskerville.
- Eyebrow and small sans labels: Manrope.
- Mono utility labels and buttons: IBM Plex Mono.

Current content styles:

Headings use `--leading-heading` (1.16) to give multiline serif text room for
ascenders and descenders. Keep this separate from the tighter navigation leading;
do not compensate with route-specific line heights or manual line breaks.

- `Heading`: `display`, `section`, `content`, `module`, and `item`.
- `Eyebrow`: `section`, `overline`, `label`, and `meta`.
- `Text`: `lead`, `body`, `supporting`, `detail`, and `quote`.
- `ContentHeader` composes those roles for every page or section
  introduction.
- `PortableContent` owns `intro`, `body`, `compact`, and `article` prose.

Section eyebrows are short, standalone labels. Titles should make sense without
the eyebrow and describe the section directly. Avoid splitting a sentence across
the two roles or ending a display heading with an ellipsis or list-introducing
colon. Keep ellipses for actual truncation or ongoing states such as “Sending…”.

The semantic element and visual role are explicit: a card may use
`<Heading as="h2" size="item">`, while a page title uses
`<Heading as="h1" size="display">`. Public page modules must not contain raw
headings or paragraphs, and page-module CSS must not restyle typography roles.

Reusable CSS Modules should consume the root typography tokens
(`--text-*`, `--text-heading-*`, `--leading-*`, and `--tracking-*`) or compose
the global typography roles instead of repeating their numeric values.

## Layout

Use:

```tsx
<Section size="spacious" tone="default">
  <GridContainer size="xl">...</GridContainer>
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

Shared content widths use the `--measure-sm` through `--measure-xl` tokens.
Common 4px-based spacing uses the root `--space-*` scale; leave genuinely
one-off visual adjustments local to their component.

`--page-gutter` is 16px below 640px and `clamp(24px, 4vw, 40px)` from 640px.
`Container` applies it to both sides, respecting larger device safe-area insets.
Navigation, footer, page headers, and section content use this same container.
Unboxed stacked content must not add another horizontal inset. Bordered cards
retain their own internal panel padding; centered reading widths on larger
screens are intentional and do not change the gutter rule.

`Grid` and `GridContainer` are the shared responsive grid system. `Stack`
owns vertical rhythm, and `ContentSection` owns the standard
Section/Container anatomy. Place a composed `ContentHeader` inside when the
section needs an introduction.

For a heading followed by content, use `ContentSection`'s default stack layout
or a plain `Container`: `ContentHeader` owns the intervening space. Do not add a
single-column grid gap to the header's bottom margin. When a grid or Stack owns
spacing instead, use `ContentHeader gap="none"`.

Section padding per edge is 32/48/64px (compact/default/spacious) below 640px,
48/64/80px from 640px, and 64/80/128px from 1024px. Default header-to-content
spacing is 32/40/60px at those breakpoints. Card padding is separate and uses
`--panel-padding` (24px mobile, 32px from 640px). Page introductions retain their
fixed-navigation clearance; never apply that offset to a section's bottom edge.

`DividerGrid` owns padding on each item's immediate content element. Stacked
items have no horizontal inset: the enclosing `Container` already supplies the
page gutter. At the grid's actual multi-column breakpoint, items gain shared
`--panel-padding` horizontally. Do not add padding in a nested card or route
class; keep links as the immediate content element so the entire padded area
remains clickable. Two-column grids honor their `sm` or `md` breakpoint for both
columns and dividers; three-column grids stack below 768px; four-column grids use one/two/four columns at 0/640/1024px.

## CTA Variants

- Primary CTA: `<Button>`, dark pill with light text from
  `src/components/button/styles.module.css`.
- Secondary button CTA: `<Button variant="secondary">`, light pill with a
  subtle border.
- Outline button CTA: `<Button variant="outline">`, transparent pill with an
  ink stroke.
- Button-styled links use `buttonVariants({ variant })`.
- `Button`, `buttonVariants`, and `CtaLink` support `size="compact"` for constrained navigation actions with a minimum 44px target. `CtaLink` also supports `tone="inverse"` for focus visibility over dark imagery.
- The public header switches from its mobile menu to desktop navigation at 1024px so the wordmark and availability-aware contact action fit without crowding.
- Secondary CTA: underlined `.mono-label` text link with the arrow glyph, such as `Learn more ->` when represented in code as the chosen arrow character.
- External CTA: same text treatment plus the shared up-right arrow icon.

Avoid rogue button styles. If a new pill/button CTA style is needed, add it to
`src/components/button/styles.module.css`, expose it through `Button` and
`buttonVariants()`, and document it here.

## Component Recipes

### Normal Page Header

```tsx
<PageHeader>
  <PageHeaderContent variant="overview">
    <PageHeaderEyebrow>{page.eyebrow}</PageHeaderEyebrow>
    <PageHeaderTitle>{page.heading}</PageHeaderTitle>
    <PageHeaderDescription>{page.intro}</PageHeaderDescription>
  </PageHeaderContent>
</PageHeader>
```

Use `variant="overview"` for centered Pricing, Specialties, FAQ, and Blog index
introductions. Use `variant="editorial"` (the default) for left-aligned service,
article, and privacy introductions. Alignment comes from the shared component,
not route CSS.

`PageHeader` contains only breadcrumbs, eyebrow, H1, and lead copy. Page
modules always belong in a following `ContentSection`.

When a `ContentSection` immediately follows `PageHeader`, `PageShell` removes
the content section’s leading padding. The page header already owns the space
between its introduction and the next section; do not add another page-specific
offset.

### Full-Bleed Image Section

```tsx
<Section size="spacious" className={styles.imageSection}>
  <BackgroundImageLayer image={section.backgroundImage} />
  <div className={styles.imageOverlay} aria-hidden />
  <GridContainer size="xl" className={styles.imageContent}>
    ...
  </GridContainer>
</Section>
```

Use `next/image` directly for above-the-fold hero images. Use `BackgroundImageLayer` below the fold.

### CTA Module

```tsx
<Section size="spacious" className={styles.ctaSection}>
  <BackgroundImageLayer image={cta.backgroundImage} />
  <GridContainer size="xl" className={styles.ctaContent}>
    <div className={styles.ctaPanel}>
      <ContentHeader>
        <ContentHeaderTitle>{cta.heading}</ContentHeaderTitle>
        <ContentHeaderDescription>{cta.body}</ContentHeaderDescription>
      </ContentHeader>
    </div>
  </GridContainer>
</Section>
```

### Grid Module

Use `Grid`, `GridContainer`, `DividerGrid`, and the documented card-grid
components. Do not recreate column transitions or divider logic in route CSS.

### Accordion Module

Use `DisclosureList`, `DisclosureItem`, `DisclosureTrigger`,
`DisclosureTitle`, and `DisclosureContent`. These preserve native
`<details>`/`<summary>` behavior while keeping the hierarchy explicit.

### Blog List And Detail

Use `AuthorCard` once before article prose for compact attribution. It reuses the
About portrait and credentials, with the author name linking to About.
`CircularPortrait size="xs"` reserves an 80px portrait with a matching `sizes`
hint; larger `sm` and `md` variants remain available for biography sections.

Use `src/data/blog.ts` helpers. Blog cards should be tappable as a whole and use the shared hover wash. Blog detail pages should use `Section size="page"` with `Container size="md"`.

## Mobile Rules

The site footer uses two columns of navigation links below 768px, with the client
portal spanning both columns. Contact information follows a divider. Hide the
decorative badge at this size; restore the three-part footer from 768px. Keep
navigation links at least 44px tall and preserve visible keyboard focus.

- Start single-column by default.
- Collapse complex grids at `md` unless documented otherwise.
- Keep tap targets comfortable.
- Do not rely on hover for essential information.
- Check 375px, 768px, and desktop widths after layout changes.

## Motion

Motion should be gentle and meaningful. Animations live in `globals.css` or purpose-built components. Always preserve `prefers-reduced-motion` behavior.

`SpecialtyMotion` coordinates specialty icons on non-hover devices. Only the
fully visible glyph nearest 40% of the viewport height plays one cycle; glyphs behind
the fixed header are excluded. Scrolling, resizing, route content changes, and
motion-preference changes update the selection. Hover-capable devices retain
hover/focus animation. Reduced motion disables both modes.

## CSS Ownership

Use a hybrid CSS model:

- `src/app/globals.css` owns theme tokens, typography, grid primitives, shared hover states, and cross-page content utilities such as `.prose`.
- Colocated `styles.module.css` files own component-only selectors, button variants, local keyframes, and one-off state transitions.
- Route-specific selectors live with their render module under
  `src/page-modules/`; `src/app/**/page.tsx` files do not import CSS.
- Every reusable component under `src/components` gets its own folder. The folder entrypoint should be `index.tsx`/`index.ts`; generated CSS Module declaration files may sit beside their CSS.
- Component folders are direct children of `src/components`; do not add
  category directories.
- Primitive roots expose stable `data-slot` attributes. Structured components
  use compound exports instead of large configuration prop surfaces.
- CSS Module declarations are generated by automation. Run `npm run verify` before handoff if you add or rename CSS Module classes.
- Run `npm run components:validate` to enforce the component-folder rule.

Do not place component-only selectors in `globals.css` just because it is convenient. If a selector is only used by one component, colocate it.

## Text over artwork

Use `BackgroundImageLayer readability="light"` for dark text directly over
artwork. Its shared 90% warm-surface wash covers the entire reading area at every
breakpoint, including when text wraps or the image crop changes. Keep content
positioned above the image and wash. Do not reduce the wash behind longer copy
or rely on text shadows. Existing CTA panels provide their own light surface;
do not stack an additional wash beneath those panels. Light text over photos
requires a dark overlay, checked against the brightest area behind the text.

Validate body text, eyebrow, links, and hover/focus states against the weakest
background contrast (4.5:1 for normal text, 3:1 for large text), not average image
color. Check actual rendered crops on mobile and desktop.

Use `ImmersivePageHeader readability="dark"` for light hero text over photography.
It applies the shared `--color-image-dark-wash` (55% quote-overlay ink) between
the media and content. Verify the rendered crop when changing photography; the
wash is a readability treatment, not permission to skip contrast measurement.
