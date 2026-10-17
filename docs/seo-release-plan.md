# Website SEO and contact release plan

Implement audit packages 1–6 on `codex/seo-fufu-starter-sync` in one focused PR. Complete verifiable website improvements now; keep only unconfirmed clinical or practice-specific facts pending in `docs/christina-review.md`.

## Baseline

Reviewed October 16, 2026 at `e86bfa9`. The working tree was clean and `verify:quick` passed (26 tests). Production still served the old homepage metadata and psychiatric schema; `/privacy` and the checked couples, perinatal, and group service routes returned 404. The live sitemap had 10 URLs. The repository already implements service routes, corrected entity schema, privacy, authorship, and analytics. Code completion, CMS publication, and deployment must be tracked separately.

## Packages and ownership

| Priority | Package                            | Owner and files                                                                                  | Completion evidence                                                                                         |
| -------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| 1        | Release reconciliation             | Coordinator: Git, deployment inventory, docs, integration tests, generated files                 | Known PR base, published-content inventory, preview and release checks                                      |
| 2        | Contact usability                  | Contact agent: `src/page-modules/contact/**`, dedicated contact tests                            | Visible labels, contrast, tappable phone/email, privacy link, preserved validation and success/error states |
| 3        | Practice facts and CMS publication | CMS agent: migration scripts, `src/content/**`, CMS validation and dedicated migration tests     | Reviewed field-level diff, revision guards, backups, narrow safe scope; no invented facts                   |
| 4        | Navigation and consultation paths  | Navigation agent: header/footer/CTA components, `src/config/site.ts`, dedicated navigation tests | Phone access, clear existing-client portal label, FAQ discoverability, correct availability behavior        |
| 5        | Search and editorial completion    | Search agent: SEO config, route metadata, sitemap, blog rendering, dedicated SEO tests           | Stable URLs, coherent metadata/schema, meaningful internal links and consultation path                      |
| 6        | Measurement and privacy            | Coordinator: analytics helpers/integration, privacy notice and provider checks                   | Stable events without form payloads or sensitive URL parameters; accurate disclosures                       |

## Execution rules

- All agents edit the same branch and checkout. No agent switches branches, stages, commits, pushes, runs generators, or runs whole-repo checks. Coordinator serializes those operations.
- Assign at most three implementation agents concurrently. Request cross-owner edits rather than making them independently.
- Read AGENTS.md and relevant topic docs; read the installed Next.js guide before framework changes. Keep Sanity as runtime source of truth.
- Preserve existing availability states, public URLs, accessibility and security behavior. No new landing-page sprawl, sticky bar, testimonials, tracking vendor, or speculative workshop dates.
- Keep related changes reviewable. Coordinator may amend related follow-ups and use force-with-lease only after pausing all Git writers.
- No broad seed reset. Migrations default to preview, show exact old/new values, protect reviewed revisions and drafts, and back up affected documents before writes. Clinical/insurance confirmation flags are not inferred from general implementation authorization.
- Preview deployments using production content do not isolate CMS mutations. Coordinate schema/code/content rollout; rollback includes affected CMS values as well as code.

## Acceptance and release

Run focused tests, then `verify:ci` and `verify:release` with edits frozen. Review mobile/desktop and keyboard behavior. Validate routes, real 404s, canonical URLs, sitemap, JSON-LD, internal links, availability states, mocked form success/failure/honeypot handling, and analytics payloads. Confirm deployed HTTP behavior after a release. Record unavailable checks accurately rather than marking them passed.

Keep a single focused PR. Christina's review log contains only material clinical claims and practice facts that cannot reasonably be independently established; routine copy, code, accessibility, metadata, and design decisions do not require her approval.

## Deferred

New workshop dates/registration/Event markup until confirmed; page-specific social images; additional service/location pages only with distinct value. Directory/Maps/NPI work is outside this code PR. No word-count quotas or llms.txt ranking project. Google retired FAQ rich results in May 2026; useful FAQ content remains valuable.

## Original release record

- Production deployment points to `ed3450c`; this branch's baseline `e86bfa9` had a successful preview but had not reached production. No existing PR was open for this branch.
- Packages 1–6 completed within the verified scope; only the practice-specific content in `christina-review.md` remains pending.
- Published CMS validation passed; all four service documents are ready. Existing address documents still use supported legacy normalization.
- Homepage heading and contact safety note updated through reviewed, revision-guarded migrations. The contact draft remains unpublished; only its allowlisted form-note field changed. Post-apply verification found no remaining differences.
- Local migration plans and backups live in ignored `.local/seo-release/`; never add them to the PR. A code rollback alone does not revert CMS changes. To roll back content, compare each current field to the plan's `after`, then restore only that field's `before` value (or unset if previously missing), guarded by the current revision. Preserve unrelated subsequent edits; never replace the whole document from backup.
- CLI catch handlers log error messages rather than authenticated request objects, protecting credentials from diagnostic output.
- Final code passed `npm run verify:release`: formatting, generated-file drift, lint, typecheck, content validation, build, 61 unit tests and 85 browser tests (one intentional skip). Desktop/mobile review also caught and fixed the contact header overlapping form content after scrolling.
- Lighthouse: accessibility 100, SEO 100, best practices 96, performance 85–86 across three runs. Performance remains below the advisory 95 target; the release command passed its required assertions.
- The final code preview deployed successfully. Hosted preview access requires Vercel authentication, so route assertions were verified against the local production build. Production code remains unchanged until merge/deployment.
- SimplePractice's `/request` URL redirects to `/request/unavailable?reason=clinician%20does%20not%20exist`; do not advertise it as a working new-client booking route. Retain the existing-client portal and contact inquiry path.
- Deliverable: [PR #14](https://github.com/ruzickapsychology/ruzickapsychology/pull/14), one shared branch and one integration commit. This plan's final update is documentation only.
- Follow-up Chrome visual review and corrections are recorded in `ux-review.md`, grouped by agent and UX category. The article repair is formatting only; substantive clinical replacements remain pending.

## Audit follow-up — October 16, 2026

The original release above was merged as PR #14. Fresh production checks found
the four service pages, privacy page, corrected schema, analytics, phone links,
and consultation paths live. The sitemap contains 15 URLs. Search-tool cached
pages still showed the older site, so completion was checked with direct HTTP
and browser requests.

This follow-up improves FAQ/contact metadata and the welcome article's search
summary; adds an optional CMS-managed shared footer safety notice; and completes
the remaining article heading repair. It does not change insurance, billing,
hours, workshop claims, or clinical prose. Page-specific social imagery remains
optional polish, and the unavailable SimplePractice request URL remains unused.

Two reviewed, revision-guarded migrations were applied to production Sanity:

- About: visible license number, verified Imago certification wording, and the
  accurate South Avenue location heading.
- Practice settings: verified Psychology Today and Imago profile links, plus
  emergency guidance consistent with the existing contact/perinatal pages.
- Blog: three existing “Doing the Work” section headings changed to `h2`, with
  all wording, keys, and marks preserved.

Post-apply previews returned no changes for both scopes. Plans and backups are
in ignored `.local/seo-release/followup/`; use the field-level rollback guidance
above if needed. New metadata/footer rendering still requires code deployment.
Christina's input log now covers the actual 50/60-minute billing contradiction,
monthly Stronger Together vs. eight-week Connected Couple discrepancy,
insurance/superbills, practical FAQs, virtual care, and practice notices.

Validation: component and provider checks, formatting, lint, typecheck, Sanity
content validation, 82 unit tests, production build, and 87 browser tests passed
(one existing intentional skip). Mobile/desktop footer screenshots were reviewed.
`verify:ci` stopped at its committed-file drift gate because this change
intentionally updates `schema.json` and `sanity.types.ts`; those diffs contain only
the new safety field/query, were reviewed, and the remaining CI commands passed
when run directly. Content validation retains the existing legacy address warnings.
