# Browser UX review — October 16, 2026

Reviewed the production build in Danny's Chrome browser at `localhost:3110`. The hosted preview required Vercel access, so this is evidence for the branch build, not a claim that production code has deployed. Agents used separate tabs and sequential review slots because Chrome viewport overrides are browser-wide.

## Review assignments

| Owner            | Category                                 | Coverage                                                                                                                    |
| ---------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Navigation agent | Responsive shell and keyboard navigation | Home at 1440×900, 768×1024, 390×844, 320×740; menu, footer, skip link, focus cycling and Escape                             |
| Contact agent    | Inquiry journey                          | Desktop 1728×842; contact at 390×844 and 320×740; labels, privacy, native required validation, phone/email links and footer |
| Content agent    | Readability and onward navigation        | Specialties, couples service, blog index/article, service FAQ; article and FAQ at 390px                                     |
| Coordinator      | Independent integration review           | Desktop/mobile About and Pricing, mobile Privacy; rebuilt contact and article fixes                                         |

## Findings and corrections

| Priority | Finding                                                                             | Correction                                                                                                                        |
| -------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| P2       | Contact form labels showed through the scrolled header and overlapped its wordmark  | Use the existing opaque page-background token for the solid header                                                                |
| P2       | Native required-field validation could scroll a field under the fixed header        | Add field scroll margin for the header offset                                                                                     |
| P2       | Romantic-attraction article had paragraph-styled section titles and a literal `---` | Reviewed formatting-only Sanity migration: three styles become `h2`, one delimiter span becomes empty; clinical wording unchanged |
| P3       | Desktop contact introduction was vertically centered far below the form top         | Top-align the two panels                                                                                                          |
| P3       | Mobile About portrait touched its credential line                                   | Use the existing large grid-gap variant                                                                                           |
| P3       | Privacy content started flush against an abrupt background-color boundary           | Keep its content on the same default background as its introduction                                                               |

At 320px the homepage heading leaves “NY” on a separate line. This remains a minor typography observation; the full heading and consultation CTA fit without horizontal overflow.

## Passed checks and limits

Desktop/tablet navigation fits; mobile menu fits 320px, cycles focus, closes with Escape and restores focus. The skip link is visible on focus and moves focus to main content. Contact labels, privacy notice, submit control and footer remain readable at narrow widths; phone/email destinations are correct. Empty submission is blocked by native validation. No personal data or real inquiry was submitted.

Reviewed service cards, breadcrumbs, related links, consultation links, article author information, FAQ wrapping and accordion keyboard behavior were coherent. Pricing amounts and mobile text fit; portrait crop is clear. This is a sampled desktop/mobile Chrome review, not an exhaustive cross-browser or every-route audit. Existing automated tests separately exercise mocked delivery success/error states.

The article repair uses `--article-formatting-only`, exact source-text preconditions, a reviewed plan, revision guards, draft protection and a private backup under ignored `.local/seo-release/`. No broad article replacement was published. Christina's review log is unchanged because these corrections need no new practice or clinical facts.

## Final validation

`verify:ci` passed with the nonsecret mocked form key used by GitHub CI: 64 unit tests, 87 browser checks, one intentional skip, plus formatting, lint, typecheck, content validation, generated-file checks and production build. The previous hosted failure was a missing build-time form key, causing the runtime configuration guard to run before the mocked delivery; CI now supplies a test-only placeholder, without weakening the production guard.

Rebuilt Chrome screenshots confirmed the opaque header, desktop contact alignment, About spacing, continuous privacy background and article headings. The initial scroll margin exposed the field but clipped its label; increased clearance passed the new mobile label-position regression. Chrome interrupted the final screenshot with an extension-panel block; a visual recheck of that last clearance adjustment remains to be captured after dismissal.

## Contact visual correction after user review

The user correctly identified that the solid brown introduction and form panels disrupted the floral composition. Removed both panel fills and their padding; a continuous dark image wash now provides contrast, with a lighter translucent tint inside inputs. Desktop paired fields fit side by side again. Checked the rebuilt desktop and 390px mobile views in Chrome and restored the browser viewport. The earlier claim that the panels looked appropriate was too generous; contrast alone did not make the composition successful.
