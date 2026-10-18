# Illustrated arrival

A miniature paper doorway on the About page turns a static office photograph into a small act of arrival. The hand-drawn arch, pressed flower mark, fine botanical lines, and dimensional door use the site's existing colors and typography. Nothing moves until the visitor chooses **Step inside**.

Open `/about#therapy-space`. Choose **Step inside** to reveal the existing Sanity office photograph. Choose **Online** for a matching window-and-laptop illustration and the CMS description of virtual appointments. The address remains sourced from site settings.

## Evidence

- [Desktop, invitation](review-1440.jpg)
- [Desktop, door open](review-1440-open.jpg)
- [Tablet, invitation](review-768.jpg)
- [Tablet, door open](review-768-open.jpg)
- [Mobile, invitation](review-375.jpg)
- [Mobile, door open](review-375-open.jpg)

The screenshots show the rendered component at 1440, 768, and 375 pixels. Site navigation and the development indicator are hidden only during evidence capture so they do not overlap the section screenshot.

## Implementation and checks

- No added packages; original SVG line art and a CSS perspective transition.
- The existing optimized, lazy-loaded Sanity photo is the only photographic asset.
- Native button interactions support touch, Enter, and Space. Mode state uses `aria-pressed`; the door uses `aria-expanded`. A polite live region announces the meeting details.
- Reduced motion removes the door and photograph transitions entirely.
- The door control sits directly beneath the illustration so mobile visitors can see the result while activating it.
- `npm run verify:quick` passed: component boundaries, ESLint, TypeScript, and 105 unit tests.
- Added browser coverage for keyboard operation, switching meeting modes, reduced motion, and mobile overflow. The coordinating task runs full CI before PR handoff.

## Deliberate limits

This is an exploration, not a deployment. The arch is an artistic invitation, not a factual rendering of the actual building. The office image comes from the existing CMS asset; its provenance and currency should be confirmed before shipping. No exterior photograph, parking guidance, access instructions, clinical claims, or new service promises were invented. There are no CMS mutations, analytics additions, external submissions, or autoplay effects.
