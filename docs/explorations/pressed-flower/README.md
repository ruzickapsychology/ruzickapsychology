# Pressed flower keepsake

Exploration 01 adds a small botanical discovery immediately above the public-site footer. Opening it reveals a two-page paper folio with an original vector rose mounted with translucent tape, the live CMS philosophy quotation, and a working phone-wallpaper download.

## Try it

Run `npm run dev -- --port 3201`, open any public page, and scroll to “Something to take with you.” Open the keepsake, use “Keep this moment” to export a 1170 × 2532 PNG, then close with Escape or the Close button.

## Design and behavior

The folio uses the existing paper, aubergine, rose, typography, and button system. The original SVG artwork is under 5 KB and is lazy loaded. No packages, external requests, tracking, or CMS mutations were added. A native modal dialog supplies background inertness and focus restoration. Reduced motion removes the entrance animation. The layout becomes a vertical folio below 768px.

The note and attribution come directly from `about.philosophy`; missing CMS copy hides the entire feature. The captured dataset contains the Carl Jung quotation already used by the site. It is not presented as Christina's writing. New interface copy (the section invitation, collection label, and save instructions) is exploration copy for editorial review.

## Evidence

- `closed-1440.jpg`, `closed-768.jpg`, `closed-375.jpg`: integrated footer discovery.
- `open-1440.jpg`, `open-768.jpg`, `open-375.jpg`: open folio at each width.
- `wallpaper.png`: actual browser export, not a mockup.
- `checks.json`: browser error, overflow, download, and focus-restoration checks.

Each proof was visually inspected. `verify:quick` passed all 105 unit tests, lint, typecheck, and component validation. Full CI results are recorded in the PR. Feature browser tests exercise keyboard controls, native modality, PNG download, Escape/focus restoration, and reduced motion on desktop and mobile Chromium.

## Before shipping

Approve the illustration and interface wording, and check phone saving on physical iOS Safari (Chromium export was verified). This is an independent exploration and has not been merged or deployed.
