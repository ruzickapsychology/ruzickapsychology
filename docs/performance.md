# Performance Playbook

The site is designed to be fast on mobile while preserving tactile imagery and grain.

## Image Rules

Use `next/image` for:

- Above-the-fold hero images.
- Meaningful images with fixed layout dimensions.
- Any image where alt text matters to the user.

Use `BackgroundImageLayer` for:

- Below-the-fold full-bleed image bands.
- Cover-cropped decorative section imagery.
- Sanity images that should lazy load and receive responsive `sizes`.

Use CSS `background-image` only for:

- Tiny repeated texture assets.
- Simple gradients or overlays.
- Rare controlled cases where `next/image` cannot represent the visual.

Do not use raw Sanity image URLs without a width and format strategy.

## Sanity Image Delivery

`next.config.ts` uses a custom loader:

```ts
images: {
  loader: "custom",
  loaderFile: "./src/lib/next-image-loader.ts",
}
```

The loader appends `w`, `q`, and `auto=format` to Sanity CDN URLs. This lets the browser request appropriately sized modern image formats.

`src/lib/cms-images.ts` exposes the small normalized image values used by `next/image` wrappers, including blur placeholders from Sanity metadata.

## Eager vs Lazy

Set `loading="eager"` and `fetchPriority="high"` only for the primary LCP image on a page.

Everything below the first viewport should be lazy by default. `BackgroundImageLayer` uses `next/image` under the hood and should remain the default for below-the-fold image bands.

## Layout Stability

- Give fixed-format media stable dimensions using `aspect-*`, `min-h-*`, or explicit wrappers.
- Avoid swapping a form for a success state with a different measured footprint.
- Reserve space for badges, icons, and animated elements that appear near the top of the page.

## Lighthouse Workflow

Local Lighthouse can be noisy. For production confidence:

1. Run `npm run verify:release` for the full code, Playwright, and Lighthouse path.
2. Test local desktop and mobile layouts.
3. Deploy to Vercel.
4. Re-run PageSpeed Insights against the production URL.
5. Re-run once if the first result is unusually slow, because cold CDN and lab variance can distort a single run.

Prioritize real impact:

- LCP image size and priority.
- Avoiding large below-the-fold images in the initial viewport.
- Reducing JavaScript added to every route.
- Preventing layout shifts.
- Keeping third-party scripts minimal.

## Common Fixes

- Lighthouse flags Sanity image delivery: check whether a CSS background is loading a large image; convert it to `next/image` or `BackgroundImageLayer`.
- LCP is slow on mobile: confirm only the hero image is eager, hero `sizes` is correct, and the source is served with `auto=format`.
- CLS appears after form submit: preserve container height and transition opacity instead of swapping to a taller state.
- Too much JS: keep interactions local and avoid adding client components to server-rendered pages unless needed.
