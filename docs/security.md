# Security

## Public Runtime

- The marketing site is statically rendered where possible.
- Contact submissions go directly to Web3Forms. Never expose a private server credential through a `NEXT_PUBLIC_` variable.
- Keep the contact honeypot, client-side validation, and explicit success/error states.

## Sanity

- `/studio` remains embedded and must stay outside the public `(site)` layout.
- Dataset write tokens are local/CI secrets and must never be committed or exposed to the browser.
- Content migrations should default to dry-run, stop when conflicting drafts exist, and require explicit confirmation for reviewed clinical or insurance claims.

## External Content

- Treat CMS links as untrusted input. Render only allow-listed Portable Text marks and add safe `rel` values to external links.
- Keep the Content Security Policy aligned with Sanity Studio, Sanity image delivery, Google Maps, Vercel analytics, and Web3Forms. Add a source only when a shipped feature needs it.

## Dependencies

Use `npm audit` as a triage signal, then inspect whether each advisory reaches the production bundle. Do not apply forced major-version changes without testing the application and Studio.
