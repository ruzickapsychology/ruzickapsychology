# Review of all 92 previously blocked tickets — October 17, 2026

Historical snapshot: later [ticket inventory cleanup](seo-ticket-cleanup-2026-10.md) separates non-ticket questions and reference material. Use the canonical tracker for current workflows.

Reviewed against branch `codex/seo-ready-improvements`, current published pages and repository evidence. This is triage, not implementation or authorization to contact third parties. Original source recommendations and dated comparisons remain in the canonical tracker.

## Disposition

| Result        | Items |
| ------------- | ----: |
| Blocked       |    53 |
| Ready         |     6 |
| Needs scoping |    13 |
| Backlog       |    13 |
| Archived      |     5 |
| Done          |     2 |

39 items leave Blocked; 53 retain specific missing inputs. Six Ready tasks have explicit acceptance criteria. Two Done items recognize existing website guardrails, not new implementation or verification of private facts.

## Ready now

- **SEO-02-04:** Write a <=750-character GBP description draft using current published facts and source links; omit insurance, unverified free-consultation and unsupported certification claims. This scoped task ends at a reviewable draft; publishing still needs GBP access.
- **SEO-05-01:** Create a directory-update fact sheet from current runtime facts, with source/date/status per field and an explicit unresolved section linking hours, insurance, workshop and clinical-scope decisions; never use seed fixtures to override live values.
- **SEO-12-02:** Narrowly update the About education entry to identify Doctor of Psychology (Psy.D.), retain CSPP/Alliant institution, and add 2020 using a reviewed CMS field patch; cite the profile.
- **SEO-14-02:** Add a general virtual-appointments FAQ using the existing New York availability wording and links to relevant service pages; do not introduce legal mandates, exceptions or a platform/security claim.
- **SEO-15-02:** Prepare a targeted reviewed CMS patch removing the conflicting code/duration advice from the reimbursement guide only, replacing it with the existing neutral insurer-benefit questions. Keep actual session duration/code confirmation under SEO-15-01.
- **SEO-37-02:** Add an accessible Get directions external link adjacent to the existing map, deriving its destination from the same CMS address and using shared link styling. Scope this ticket to map/directions; retain unverified parking details under SEO-33-05.

## Evidence and limits

Current public HTML was checked for About, Pricing and the individual/couples service pages. The practitioner-owned [Psychology Today profile](https://www.psychologytoday.com/us/therapists/christina-ruzicka-rochester-ny/912736) supplies the degree/year evidence and exposes a real insurance contradiction. Seed fixtures are proposed/reference content, not proof of current runtime facts. Code evidence is cited per item.

Uncertain practice facts are not inferred from generic industry practice. Existing published scope may be reused without inventing new claims. Access blockers mean authenticated editing/ownership evidence was not established here; no login or correction submission was attempted. Draft-only scope never counts as completed publication. Christina flags refer to the present scoped action; optional future expansions may introduce new dependencies.

New clinical or billing facts still need confirmation. Removing contradictory reimbursement advice does not choose a billing code or change session terms. Public professional guidance informs scoping but does not establish this practice’s agreements, status or legal compliance.

## Each ticket

### SEO-01-01

**Blocked → Backlog.** Review solicitation is an optional practice policy, not accepted implementation work. No approved policy exists; AGENTS.md prohibits adding testimonials without explicit review.

**Next action:** Revisit only if Christina wants a review-request program; then obtain her adviser-approved policy before outreach.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-01-02

**Blocked → Backlog.** A passive review link is an optional marketing decision dependent on SEO-01-01, not a technical blocker to current website improvements.

**Next action:** Keep as a future decision; do not add a review link until the practice opts in and approves the policy.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-01-03

**Blocked → Backlog.** Former-client/workshop solicitation has no established approved process and is optional. There is no reason to make this a required website milestone.

**Next action:** Reopen only as part of an approved review policy under SEO-01-01; never infer permission to solicit.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-01-05

**Blocked → Needs scoping.** About already publishes real practitioner and office images; lack of an 8–12-photo inventory is not a blanket blocker. Exact Google profile access and asset reuse permissions still need inspection.

**Next action:** Inventory existing CMS photos and identify useful missing views. Define an upload set and access owner; publication remains dependent on authorized profile access and cleared images. Discard arbitrary quantity target.

**Direct Christina confirmation for scoped action:** No.

### SEO-02-01

**Blocked → Blocked.** Website address does not establish storefront eligibility. Google requires permanent signage for businesses displaying their address (https://support.google.com/business/answer/3038177?hl=en); actual signage/client access and authorized profile access remain unknown.

**Next action:** Confirm eligibility/signage and any suite or floor with the practice, inspect current profile, then change address visibility only if eligible.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-02-02

**Blocked → Blocked.** Published individual/couples/perinatal services provide enough evidence to propose matching categories; no new clinical-scope approval is needed for those existing offers. The actual profile controls/category availability and authorized write access have not been established in this audit.

**Next action:** Prepare a minimal category proposal from current published services; retain Psychologist, inspect available categories, and apply only supported matches once authorized profile access is available. No need to add every example category.

**Direct Christina confirmation for scoped action:** No.

### SEO-02-03

**Blocked → Blocked.** Existing individual, couples and perinatal service descriptions can be reused; the workshop conflict in docs/christina-review.md does not block drafting those services. Publication requires authorized GBP access; workshop identity remains a separate dependency.

**Next action:** Draft non-workshop service entries from current runtime pages, then publish with profile access. Keep the workshop entry pending SEO-09-01 rather than inventing a name or schedule.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-02-04

**Blocked → Ready.** This ticket asks for a description, which can be drafted from existing published practice/location/service facts. Unknown insurance, free-consultation wording and stronger credential wording can be omitted rather than blocking the whole draft.

**Next action:** Write a <=750-character GBP description draft using current published facts and source links; omit insurance, unverified free-consultation and unsupported certification claims. This scoped task ends at a reviewable draft; publishing still needs GBP access.

**Direct Christina confirmation for scoped action:** No.

**Acceptance:** Draft is <=750 characters; each factual claim cites current runtime content; no new insurance, pricing, credential, availability or clinical claims; publishing dependency and omitted optional facts are explicit.

### SEO-02-05

**Blocked → Blocked.** The recorded SimplePractice request route resolves to an unavailable page per the original live audit; the working portal is for existing clients and must not be relabeled booking. Actual new-client booking enablement and GBP write access are dependencies.

**Next action:** Confirm or configure a working new-client request destination, verify its behavior, then add it using authorized GBP access. Website /contact can be considered separately as an inquiry destination, not represented as instant booking.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-02-07

**Blocked → Needs scoping.** This mixes unresolved hours with unverified profile features. Google retired legacy profile chat/call history July 31 2024 (https://support.google.com/business/answer/14919056?hl=en); the PDF messaging task cannot be accepted literally.

**Next action:** Inspect currently supported profile controls; discard legacy chat enablement, identify concrete accuracy edits, and keep hours changes dependent on SEO-03-01 plus authorized access.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-03-01

**Blocked → Blocked.** docs/christina-review.md explicitly records conflicting website/seed hours. src/content/site.ts lists Mon–Thu 9–5/Friday virtual/evenings by request; audit live Contact hours differ. No reliable basis exists for choosing a schedule.

**Next action:** Resolve one appointment-hours decision under SEO-03-01, then publish consistently where appropriate. External profile changes also require authorized access; do not infer Friday closed or use special hours blindly.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-03-02

**Blocked → Blocked.** docs/christina-review.md explicitly records conflicting website/seed hours. src/content/site.ts lists Mon–Thu 9–5/Friday virtual/evenings by request; audit live Contact hours differ. No reliable basis exists for choosing a schedule.

**Next action:** Resolve one appointment-hours decision under SEO-03-01, then publish consistently where appropriate. External profile changes also require authorized access; do not infer Friday closed or use special hours blindly.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-03-03

**Blocked → Blocked.** docs/christina-review.md explicitly records conflicting website/seed hours. src/content/site.ts lists Mon–Thu 9–5/Friday virtual/evenings by request; audit live Contact hours differ. No reliable basis exists for choosing a schedule.

**Next action:** Resolve one appointment-hours decision under SEO-03-01, then publish consistently where appropriate. External profile changes also require authorized access; do not infer Friday closed or use special hours blindly.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-04-01

**Blocked → Blocked.** docs/christina-review.md explicitly says current Aetna/Headway participation, eligible services and superbill policy are unresolved. Published out-of-network wording cannot resolve contradictory billing facts.

**Next action:** Obtain the current insurance statement once under SEO-04-01, then reuse it on Pricing/FAQ and authorized directories. Existing website insurance blocks need content resolution, not speculative new UI.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-04-02

**Blocked → Blocked.** docs/christina-review.md explicitly says current Aetna/Headway participation, eligible services and superbill policy are unresolved. Published out-of-network wording cannot resolve contradictory billing facts.

**Next action:** Obtain the current insurance statement once under SEO-04-01, then reuse it on Pricing/FAQ and authorized directories. Existing website insurance blocks need content resolution, not speculative new UI.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-04-03

**Blocked → Blocked.** docs/christina-review.md explicitly says current Aetna/Headway participation, eligible services and superbill policy are unresolved. Published out-of-network wording cannot resolve contradictory billing facts.

**Next action:** Obtain the current insurance statement once under SEO-04-01, then reuse it on Pricing/FAQ and authorized directories. Existing website insurance blocks need content resolution, not speculative new UI.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-05-01

**Blocked → Ready.** src/data/cms.ts already centralizes runtime practice fields and docs/christina-review.md identifies genuine unknowns. A useful source-of-truth sheet does not need to pretend every fact is confirmed.

**Next action:** Create a directory-update fact sheet from current runtime facts, with source/date/status per field and an explicit unresolved section linking hours, insurance, workshop and clinical-scope decisions; never use seed fixtures to override live values.

**Direct Christina confirmation for scoped action:** No.

**Acceptance:** Name/address/phone/site/current published credentials and services cite sources; disputed facts are clearly pending with dependency IDs; no invented facts or external updates; includes instructions to reuse confirmed values and avoid publishing unresolved ones.

### SEO-05-02

**Blocked → Blocked.** Healthgrades correction needs authorized listing ownership/edit or correction-submission access. Insurance uncertainty does not block correction of demonstrably wrong name/address/phone; the prior insurance-only blocker was too broad.

**Next action:** Prepare exact current-vs-canonical corrections for public identity/contact fields from SEO-05-01 and inspect correction route. Submit only once authorized access/outreach is established; leave insurance unchanged pending SEO-04-01.

**Direct Christina confirmation for scoped action:** No.

### SEO-05-03

**Blocked → Blocked.** Sharecare correction needs authorized listing ownership/edit or correction-submission access. Insurance uncertainty does not block correction of demonstrably wrong name/address/phone; the prior insurance-only blocker was too broad.

**Next action:** Prepare exact current-vs-canonical corrections for public identity/contact fields from SEO-05-01 and inspect correction route. Submit only once authorized access/outreach is established; leave insurance unchanged pending SEO-04-01.

**Direct Christina confirmation for scoped action:** No.

### SEO-05-04

**Blocked → Blocked.** WebMD/Vitals correction needs authorized listing ownership/edit or correction-submission access. Insurance uncertainty does not block correction of demonstrably wrong name/address/phone; the prior insurance-only blocker was too broad.

**Next action:** Prepare exact current-vs-canonical corrections for public identity/contact fields from SEO-05-01 and inspect correction route. Submit only once authorized access/outreach is established; leave insurance unchanged pending SEO-04-01.

**Direct Christina confirmation for scoped action:** No.

### SEO-05-05

**Blocked → Needs scoping.** Different years-of-experience counts may use different start dates or calculation conventions; discrepancy alone does not prove either is wrong. No current comparison or field definition has been inspected.

**Next action:** Compare current public listings and their field definitions against dated published education/license evidence. If still materially inconsistent, ask for the intended experience basis before changing listings; do not guess a number.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-05-06

**Blocked → Blocked.** docs/christina-review.md explicitly asks whether the different Imago phone is intentional. License registration dates can be independently checked with NYSED, but that does not authorize replacing a potentially intentional number or contacting the directory.

**Next action:** Verify public license date read-only; ask one focused question about intended public phone, then prepare corrections. Sending request requires explicit outreach authorization.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-05-07

**Blocked → Archived.** This umbrella duplicates specific tracked decisions: insurance SEO-04-01, phone SEO-05-06, credential SEO-28-01 and office rental SEO-29-01. Keeping another blocked ticket overcounts the same dependencies.

**Next action:** Retain the source recommendation as context; resolve sensitive questions in their individual tickets and avoid putting unnecessary personal details into public artifacts.

**Direct Christina confirmation for scoped action:** No.

### SEO-06-01

**Blocked → Blocked.** Current website service descriptions can be reused, but a complete trained-and-desired clinical scope is a practice decision. docs/christina-review.md requires clinical review for substantive changes.

**Next action:** Confirm only proposed expansions or contradictory directory claims; do not request blanket reapproval of unchanged published services.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-06-02

**Blocked → Needs scoping.** The ticket bundles website copy, externally controlled listings and optional knowsAbout markup. Existing published service facts are sufficient for consistency research; a new comprehensive clinical list is not needed to identify exact mismatches.

**Next action:** Inventory concrete mismatches using current runtime service descriptions; propose separate bounded corrections. Any new scope claims depend on SEO-06-01, external changes on authorized access, and schema addition requires a demonstrated purpose rather than keyword stuffing.

**Direct Christina confirmation for scoped action:** No.

### SEO-06-04

**Blocked → Backlog.** This is a conditional future clinical-positioning idea, not a necessary missing feature. Current absence does not justify making unsupported LGBTQ+/ENM specialty claims or blocking release.

**Next action:** Revisit only if the practice chooses to advertise these offers and confirms the relevant scope/training; retain ordinary inclusive language without inventing a specialty.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-07-01

**Blocked → Blocked.** NPPES registration changes require an authorized account owner and correct taxonomy/billing details; site code cannot establish the intended registered classification. Read-only verification can prepare evidence but cannot complete the change.

**Next action:** Inspect the public NPI record and record proposed corrections; have the owner confirm taxonomy and submit through authorized NPPES access. Do not infer the exact taxonomy from marketing copy.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-07-02

**Blocked → Blocked.** PLLC branding does not establish how the individual provider actually bills. No billing setup evidence exists in repository; this inferred audit concern requires the account owner/billing adviser.

**Next action:** Ask the billing owner whether current sole-proprietor designation matches actual setup; change nothing until that determination is recorded.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-07-03

**Blocked → Blocked.** The need for an organizational NPI depends on actual billing and payer arrangements absent from the repository; an accountant/billing adviser decision cannot be inferred from the business name.

**Next action:** Obtain the billing/adviser determination, then close as no change or define the required registration work.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-09-01

**Blocked → Blocked.** docs/christina-review.md records incompatible monthly Stronger Together and eight-week Connected Couple offerings. Existing group page is not evidence for actual dates, format or availability.

**Next action:** Resolve offering identity/schedule with Christina once; prefer updating existing destination and only add/redirect a new URL if justified. Do not fabricate events.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-09-02

**Blocked → Blocked.** Existing page already explains general couples learning and no-crisis fit, but the disputed workshop identity and clinical inclusion/exclusion criteria cannot be inferred safely from generic content.

**Next action:** Reuse existing explanatory text where applicable; obtain only missing offering-specific suitability/exclusion facts after SEO-09-01, then make a bounded content update.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-09-03

**Blocked → Blocked.** The group service has FAQs but only promises fees before registration. docs/christina-review.md identifies unresolved program identity, actual fee, pricing basis and cancellation terms; code cannot establish these transaction terms.

**Next action:** Obtain the active offering, fee per person/couple/series and cancellation policy; then update the existing group page and FAQ, preserving current FAQ coverage.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-09-04

**Blocked → Blocked.** Existing Learn more links already reach /specialties/group-therapy and its inquiry CTA. A real registration destination and enrollment process are not established; the generic SimplePractice request path was unavailable in the original comparison.

**Next action:** Retain working inquiry links; obtain and test the real workshop enrollment route before labeling a control Register. Existing navigation work does not depend on that decision.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-09-05

**Blocked → Blocked.** Classification determines actual practice intake, billing and consent, not just UI copy. docs/christina-review.md explicitly leaves clinical group versus educational workshop unresolved.

**Next action:** Christina/adviser must identify each actual offering and its required workflow; then create concrete site changes from that decision.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-09-06

**Blocked → Backlog.** There is no published scheduled event to mark up. This is a conditional future capability, not an active task waiting on invented dates; /specialties/group-therapy currently invites inquiries.

**Next action:** Reopen only when a real event is scheduled. At that time reuse the same visible date/time/location for Event schema and separately arrange Google profile access. Track actual dates under the workshop fact dependency.

**Direct Christina confirmation for scoped action:** No.

### SEO-12-02

**Blocked → Ready.** Psy.D. is already published on About and in src/content/about.ts. The linked practitioner-owned Psychology Today profile explicitly identifies CSPP, Psy.D., graduated 2020: https://www.psychologytoday.com/us/therapists/christina-ruzicka-rochester-ny/912736 (read 2026-10-17). This is a stable publicly supplied credential fact, not a new clinical claim. Fresh public HTML GET also confirms About still has Doctoral Degree without a year.

**Next action:** Narrowly update the About education entry to identify Doctor of Psychology (Psy.D.), retain CSPP/Alliant institution, and add 2020 using a reviewed CMS field patch; cite the profile.

**Direct Christina confirmation for scoped action:** No.

**Acceptance:** About shows the exact degree/institution/year from the cited profile; migration preview changes only that education entry, handles drafts/revisions and preserves all other CMS content. Verify rendered About after publication; no reseed.

### SEO-12-05

**Blocked → Blocked.** About already avoids an awarded-certification claim with Certification Track. Neither repo nor published profile establishes current completion status; guessing a more specific status could create a credential misrepresentation.

**Next action:** Obtain current PSI status/permitted description through the shared SEO-28-01 dependency; preserve current cautious wording meanwhile.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-12-06

**Blocked → Needs scoping.** The combined ticket mixes an independent editorial improvement with an unknown list. About already describes relational style and Imago; the published welcome article explicitly mentions psychodynamic theory (src/content/blog/welcome-to-the-practice.md). Professional memberships are not evidenced.

**Next action:** Scope a short About approach paragraph from existing published copy if it adds clarity; leave membership publication contingent on actual memberships rather than blocking the editorial review. Do not add unverified memberships or new methods.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-14-02

**Blocked → Ready.** Fresh public HTML GET on 2026-10-17 verifies /specialties/individual-therapy says virtual therapy to clients located in New York, and /specialties/couples-therapy says both partners located in New York. Reusing that published service scope in the general FAQ requires no hypothetical multistate decision; stronger legal wording remains SEO-26-01/02.

**Next action:** Add a general virtual-appointments FAQ using the existing New York availability wording and links to relevant service pages; do not introduce legal mandates, exceptions or a platform/security claim.

**Direct Christina confirmation for scoped action:** No.

**Acceptance:** General FAQ accurately repeats existing New York virtual availability, links existing services and avoids expanding eligibility. Reviewed targeted CMS patch preserves other FAQ items. Explicit physical-location-at-each-session legal wording remains open under SEO-26-01/02, not silently completed.

### SEO-14-03

**Blocked → Blocked.** A real conflict exists: current FAQ says out of network, while the practitioner Psychology Today profile says Aetna is accepted (https://www.psychologytoday.com/us/therapists/christina-ruzicka-rochester-ny/912736, read 2026-10-17). No inference resolves which services/current arrangements apply.

**Next action:** Resolve the single insurance fact dependency SEO-04-01, then update existing FAQ rather than add a duplicate.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-14-04

**Blocked → Blocked.** No cancellation notice period or fee policy exists in the inspected FAQ/pricing fixtures; docs/christina-review.md explicitly requests it. Such terms cannot be inferred from standard therapy practice.

**Next action:** Obtain exact notice period, fee and exceptions, then publish one consistent answer with Pricing.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-14-07

**Blocked → Blocked.** The couples/group copy supports partner attendance for those services, but no source establishes whether a baby or partner may attend an individual/perinatal appointment or what restrictions apply.

**Next action:** Ask specifically about individual/perinatal partner or infant attendance; do not make the already-established couples participation itself a blocker.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-14-08

**Blocked → Blocked.** The source and hub refer to Stronger Together while group detail/fixtures describe The Connected Couple eight-week series. docs/christina-review.md records that unresolved identity conflict.

**Next action:** Resolve whether these are separate/current offerings, then add a factual FAQ linking the actual offering; do not infer equivalence.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-14-10

**Blocked → Needs scoping.** This mixes a generally verifiable scope-of-profession fact with unknown practice referral arrangements. NYSED describes psychologists as providing psychotherapy and assessment (https://www.op.nysed.gov/professions/psychology/consumer-information); it does not establish this practice has a particular medication referral partner.

**Next action:** Scope a concise non-prescribing FAQ after verifying current New York prescribing scope from primary guidance; omit promises about arranging referrals unless actually confirmed. If referral detail is desired, retain that specific dependency.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-14-11

**Blocked → Blocked.** Street address and embedded map are already available, but building entry, parking rules and accommodation limitations are not established by code or a map. docs/christina-review.md requests these facts.

**Next action:** Obtain exact arrival/access facts or reliable building documentation, then reuse a single practical-access answer on Contact/FAQ; do not promise accessibility from an address.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-15-01

**Blocked → Blocked.** docs/christina-review.md records conflicting 50/60-minute claims. Choosing billable code, session duration or fee requires practice/biller facts, not a developer inference.

**Next action:** Obtain actual duration/fee and whether any public code guidance is needed. Separately remove misleading generic code advice under SEO-15-02 without choosing a replacement code.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-15-02

**Blocked → Ready.** The current source fixture src/content/pricing.ts already removes specific CPT instructions from the reimbursement guide and asks insurers about outpatient psychotherapy benefits. A safe fix can remove the unsupported 90837/60-minute claim without choosing another code or changing the advertised 50-minute service. scripts/migrate-seo-service-pages.ts bundles this with insurance, so it must not be applied broadly. Fresh public HTML GET on 2026-10-17 verifies the conflicting 90837/60-minute advice remains live on Pricing; fixture-only neutral wording is proposed content, not completion evidence.

**Next action:** Prepare a targeted reviewed CMS patch removing the conflicting code/duration advice from the reimbursement guide only, replacing it with the existing neutral insurer-benefit questions. Keep actual session duration/code confirmation under SEO-15-01.

**Direct Christina confirmation for scoped action:** No.

**Acceptance:** Rendered reimbursement guide no longer equates the advertised service with 90837/60 minutes, contains no substitute billing-code claim, and fees, session-length display, insurance copy and drafts are unchanged. Exact CMS before/after/revision guards demonstrate the narrow scope.

### SEO-15-03

**Blocked → Blocked.** src/content/pricing.ts contains both on request and Each month I provide; FAQ says can provide. An actual service-policy difference remains, explicitly recorded in docs/christina-review.md.

**Next action:** Confirm automatic versus on-request delivery once, then apply that same wording in Pricing/FAQ. Avoid inventing a policy merely to make text consistent.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-16-06

**Blocked → Needs scoping.** Three independent graph properties were incorrectly bundled. src/config/seo.ts lacks all three; hours are genuinely unresolved, but geolocation can be independently checked and price representation evaluated against the visible published fees. Schema absence alone does not justify adding every optional property.

**Next action:** Separate evidence-led geo/visible-fee evaluation from opening hours. Add only accurately sourced properties with a concrete value; leave hours dependent on SEO-03-01 and avoid implying workshop pricing or an overall range not represented on the page.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-16-08

**Blocked → Needs scoping.** src/config/seo.ts maps existing externalProfiles into sameAs. The only gap is a canonical Google practice-profile URL. That is a public identity-verification task, not inherently a Christina decision or account-write dependency; current searches did not establish a stable owned-profile URL.

**Next action:** Find and verify the exact Google listing against name/address/site, then add its stable URL through existing profile data. Do not use a generic map query, coordinates or an unrelated tenant profile as sameAs.

**Direct Christina confirmation for scoped action:** No.

### SEO-16-11

**Blocked → Needs scoping.** Existing Person knowsAbout and Psychology Today/Imago links already cover the published services. Adding Headway requires public identity verification; it does not inherently require expanding clinical topics. Current search did not establish a canonical Headway profile.

**Next action:** Evaluate only the missing Headway identity/link, using name/license/location cross-checks. Retain existing topics unless an actual mismatch is identified; any new clinical scope remains dependent on SEO-06-01.

**Direct Christina confirmation for scoped action:** No.

### SEO-16-14

**Blocked → Archived.** Duplicates the Event markup portion of SEO-09-06. No real dated event is published, so a second blocked ticket overcounts the same future capability.

**Next action:** Track future Event markup once under SEO-09-06 when an actual event is scheduled; require dates and details to match visible content.

**Direct Christina confirmation for scoped action:** No.

### SEO-17-01

**Blocked → Blocked.** Provider/legal acceptability is distinct from engineering controls. docs/christina-review.md explicitly requests practice/adviser approval; src/lib/analytics-privacy.ts cannot prove it.

**Next action:** Provide adviser with the actual provider, pages, event names and minimized payload inventory, then record specific exclusions/provider decisions; do not block unrelated engineering checks on this consultation.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-17-02

**Blocked → Needs scoping.** Vercel Analytics and Speed Insights are installed through SiteAnalytics; sanitizeAnalyticsEvent strips queries/fragments/credentials and excludes Studio. Installation is already implemented, while an unspecified sensitive-pages policy is not a concrete change.

**Next action:** Close the installation portion as evidenced; separately inventory/test actual requests and decide whether any engineering gap exists. Keep practice-specific exclusions/provider acceptability under SEO-17-01. Do not reinstall analytics or substitute GA4 merely because the PDF lists examples.

**Direct Christina confirmation for scoped action:** No.

### SEO-17-03

**Blocked → Blocked.** src/app/layout.tsx supports Google verification, but actual Search Console/Bing ownership status requires authorized account evidence; neither absent meta tags nor code proves DNS verification. This is an access dependency, not Christina clinical confirmation.

**Next action:** Obtain authorized webmaster account access or dated owner verification evidence from whoever manages the domain; then verify each property and address actual gaps.

**Direct Christina confirmation for scoped action:** No.

### SEO-19-02

**Blocked → Backlog.** This is an optional marketing channel, expressly conditional on desire and maintenance. No website defect depends on an Instagram/Facebook account.

**Next action:** Revisit if a channel owner and purpose are chosen; then verify profile URLs and add links. Do not create social accounts or imply ongoing content work is an active blocked engineering task.

**Direct Christina confirmation for scoped action:** No.

### SEO-20-06

**Blocked → Backlog.** Technical accessibility improvements are independently actionable and already tested. No accessibility statement or specific legal representation is currently selected; the broad adviser question is an optional future decision, not an active implementation blocker.

**Next action:** Revisit if the practice wants an accessibility statement or receives specific advice. Describe actual tested scope accurately; do not wait for this decision to fix demonstrable accessibility defects.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-22-01

**Blocked → Blocked.** The proposed public request endpoint was verified unavailable in the original comparison. Current inquiry/contact options work; account configuration and the intended booking workflow are unknown.

**Next action:** Obtain the intended working request route and enrollment behavior from the practice/account owner, verify it end-to-end, then reconsider whether two equally weighted CTAs improve the flow. Do not copy the broken PDF URL.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-22-03

**Blocked → Archived.** The audit inferred a contradiction from TherapyFinder saying online booking is disabled, but the actual public SimplePractice request route was also unavailable. Those facts are consistent; absence of booking is not itself a directory error.

**Next action:** Retain source evidence; reopen only if a working approved online booking flow is launched and the directory still misstates it. Do not enable booking merely to satisfy an inferred cleanup.

**Direct Christina confirmation for scoped action:** No.

### SEO-23-01

**Blocked → Backlog.** A new peer-endorsement block is optional and has no demonstrated usability need. The linked Psychology Today profile already exposes four endorsements. Republishing needs exact-quote permissions/review, not a coding dependency to chase now.

**Next action:** Defer unless a specific trust/content need justifies the block. If promoted, obtain selected-quote permissions and professional review; do not solicit client testimonials.

**Direct Christina confirmation for scoped action:** No.

### SEO-23-02

**Blocked → Backlog.** Existing About text and footer license establish credentials without extra badges. Logo-use eligibility and current PSI status remain unknown, but adding logos is optional rather than an active site defect.

**Next action:** Retain text credentials. Reopen only for a justified visual/content need; check organization usage rules and specific credential eligibility at that point. Do not imply PSI certification with a logo.

**Direct Christina confirmation for scoped action:** No.

### SEO-24-01

**Blocked → Blocked.** The site already has /privacy and provider disclosures. What remains is practice/adviser review of actual data flows and notice wording; a developer cannot infer that consultation occurred.

**Next action:** Obtain review of the existing notice against the concrete form/analytics inventory and turn requested changes into scoped tickets. Do not replace the notice just because the PDF asks whether one is needed.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-24-02

**Blocked → Blocked.** The concrete missing input is the practice’s actual NPP, not a generic mystery about website placement. HHS says covered providers must prominently post their notice on service websites: https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/model-notices-privacy-practices/index.html . docs/christina-review.md requests the approved notice; /privacy explicitly describes website processing only.

**Next action:** Obtain the existing practice NPP and confirmation it is current; publish that document in an accessible location. Research/placement planning can proceed without Christina.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-24-03

**Blocked → Blocked.** src/page-modules/contact/contact-form/index.tsx sends identifying contact data plus therapy interest and a message directly to Web3Forms. Code inspection establishes the data flow but cannot establish the practice’s agreements or adviser decision. docs/christina-review.md explicitly reserves provider approval.

**Next action:** Provide the adviser a factual data-flow inventory now; obtain the intended inquiry process and agreement/provider decision before claiming compliance or switching the intake channel.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-24-04

**Blocked → Blocked.** Footer and form already link /privacy; src/page-modules/privacy/index.tsx describes Web3Forms, Sanity, Maps and analytics. Remaining NPP/provider implementation depends specifically on SEO-24-02/03, rather than missing website links.

**Next action:** Preserve completed website notice/links. Implement only the actual NPP or provider changes returned by SEO-24-02/03; do not add a duplicate privacy page.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-25-01

**Blocked → Blocked.** Existing CMS safetyNotice is rendered by SiteFooter and the Contact form uses its existing note. No record establishes Christina/adviser approval; this ticket explicitly asks for that approval rather than engineering.

**Next action:** Bundle the current exact wording into the practice-notice review; do not imply the absence of a recorded sign-off means the current notice must be replaced.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-25-02

**Blocked → Needs scoping.** The footer/form placement already exists (SiteFooter safetyNotice, ContactForm note). The remaining proposal combines approval tracked by SEO-25-01 with an unaccepted new Resources page. Neither justifies keeping another entire placement ticket blocked.

**Next action:** Credit existing notice placement. Decide whether a Resources page has a user need and define its audience/content separately; approval remains tracked once in SEO-25-01.

**Direct Christina confirmation for scoped action:** No.

### SEO-25-04

**Blocked → Backlog.** Global emergency guidance already appears on every article through SiteFooter. A second per-article disclaimer is an optional editorial decision, with no established requirement or demonstrated gap; it is not an accepted implementation waiting only on Christina.

**Next action:** If article context justifies an inline educational-use notice, scope a concise reusable treatment and review its actual copy. Do not duplicate crisis text throughout every article by default.

**Direct Christina confirmation for scoped action:** No.

### SEO-26-01

**Blocked → Blocked.** NYSED telepractice guidance can establish jurisdictional principles, but not this practitioner’s other authorizations/exceptions. docs/christina-review.md explicitly requests her actual scope. See https://www.op.nysed.gov/professions/psychology/professional-practice/guideline-engaging-telepractice .

**Next action:** Keep the current New York service scope. Ask only whether any documented exceptions/other authorizations should affect the practice’s wording.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-26-02

**Blocked → Blocked.** Current service FAQs already say clients/both partners located in New York (src/content/specialties.ts records seed evidence; existing audit records live wording). Stronger absolute session-time wording still depends on the specific exception decision in SEO-26-01.

**Next action:** After SEO-26-01, update the existing FAQs consistently; do not expand eligibility or infer the absence of other licensure.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-26-03

**Blocked → Blocked.** A SimplePractice portal link does not prove that SimplePractice video is the platform actually used; docs/christina-review.md explicitly asks for the platform.

**Next action:** Obtain the actual platform name; add a factual FAQ detail without unsupported security guarantees.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-26-04

**Blocked → Done.** Direct public HTTP checks on 2026-10-17 confirm /specialties/individual-therapy says clients located in New York and /specialties/couples-therapy says both partners located in New York; /about offers virtual appointments throughout New York. Current conservative website scope is implemented. Possible future interstate expansion is not an unfinished implementation requirement.

**Next action:** Preserve the existing New York scope. Reopen only if Christina requests expansion with documented authority; SEO-26-01/02 retain the separate wording/exception question.

**Direct Christina confirmation for scoped action:** No.

### SEO-27-01

**Blocked → Needs scoping.** General GFE obligations are independently researchable rather than entirely waiting for counsel: CMS describes uninsured/self-pay estimates and model notices at https://www.cms.gov/initiatives/no-surprise-billing/overview/policies-resources/provider-requirements-resources . The unresolved practice inputs are its existing notice/process and workshop classification, not whether a missing route proves noncompliance.

**Next action:** Prepare a CMS-model-based placement/content proposal for self-pay services and enumerate the exact practice-process and workshop questions. Keep any assertions about the actual intake process pending.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-27-02

**Blocked → Blocked.** Pricing has no GFE notice, and the actual practice notice/intake process requested in docs/christina-review.md is missing. Adding a page cannot establish external SimplePractice intake compliance or workshop classification.

**Next action:** Use SEO-27-01’s researched proposal; obtain the actual approved notice/process, then add accessible Pricing placement and separately coordinate external intake. A dedicated page is optional.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-28-01

**Blocked → Blocked.** About currently says PSI Certification Track, but current certification completion cannot be inferred from that historical copy. docs/christina-review.md does not provide a current certificate. Public candidate-language research is possible independently.

**Next action:** Check PSI’s public credential usage guidance, then obtain Christina’s current earned credential/status before changing the claim.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-28-02

**Blocked → Blocked.** The requested external edit depends on present certification status and current third-party wording. Prior copy alone is insufficient to decide what credential should replace it; outreach also requires explicit authorization.

**Next action:** Resolve SEO-28-01, inspect the current listing, prepare exact correction text, and obtain outreach authorization before sending.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-28-03

**Blocked → Needs scoping.** This is a broad external-claims audit, not a specific blocked correction. The website already describes perinatal training without asserting PMH-C; current directory text has not been compared.

**Next action:** Read current Psychology Today/Headway claims, compare them with published About qualifications, and identify exact unsupported or inconsistent claims. Only credential-status changes then depend on SEO-28-01.

**Direct Christina confirmation for scoped action:** No.

### SEO-28-04

**Blocked → Done.** Direct public HTTP check of /about on 2026-10-17 confirms Postpartum Support International — Certification Track, without PMH-C. The source contradiction remains preserved in the tracker transcript; unresolved external status/edits are separately tracked in SEO-28-01/02/03. This closes only the website avoidance requirement, not credential confirmation.

**Next action:** Keep the cautious current wording and avoid duplicating the same external credential dependency here. Do not interpret this as confirmation of current certification status.

**Direct Christina confirmation for scoped action:** No.

### SEO-29-01

**Blocked → Blocked.** Moving/deleting a third-party office-rental listing changes a nonclinical business offering. No repository evidence establishes its intended destination or whether the listing is still desired.

**Next action:** Inspect current public listing and draft a recommendation; obtain Christina’s desired destination and listing access before changing it.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-29-02

**Blocked → Blocked.** The known Stronger Together versus Connected Couple conflict is unresolved in docs/christina-review.md. A new group listing would assert an unconfirmed offering/classification.

**Next action:** Resolve workshop identity, active availability and clinical-versus-education classification, then prepare directory copy; account access remains a separate operational dependency.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-31-01

**Blocked → Backlog.** Contact already renders OfficeHours from site.hours, while footer has phone/privacy/safety. Repeating hours globally is optional and adds footer density; no demonstrated need justifies treating this as blocked active work.

**Next action:** Keep hours on Contact. Reconsider a compact footer link to Contact only if navigation evidence supports it; any changes to actual hours remain in SEO-03-01.

**Direct Christina confirmation for scoped action:** No.

### SEO-32-03

**Blocked → Backlog.** A homepage insurance line is optional duplication of Pricing/FAQ, and unresolved insurance facts are already tracked under SEO-04. The user rejected a similarly sparse standalone homepage credentials section.

**Next action:** Do not add a new homepage block. Reconsider a natural inline link to Pricing if user testing indicates a discoverability gap; never infer new Aetna coverage.

**Direct Christina confirmation for scoped action:** No.

### SEO-32-04

**Blocked → Archived.** HomePage already renders CMS-driven SpecialtyCards with summaries and links to published service pages. An additional Who I help bullet block duplicates that navigation; hypothetical new services remain resources until accepted.

**Next action:** Retain the existing specialty cards. Future service work should extend those cards rather than add a second list or claim unconfirmed populations.

**Direct Christina confirmation for scoped action:** No.

### SEO-32-06

**Blocked → Blocked.** An actual next date, location, price and registration path are private practice/event inputs absent from code and explicitly pending in docs/christina-review.md.

**Next action:** Obtain a real scheduled offering and working enrollment route before adding date/register UI; do not manufacture an event from the workshop roadmap.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-33-03

**Blocked → Blocked.** About already describes existing populations; the missing referral-out criteria are a clinical decision not inferable from marketing copy.

**Next action:** Ask specifically for referral-out criteria rather than reconfirming every published population, then integrate concise accurate guidance.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-33-05

**Blocked → Blocked.** Office address can support a directions link, but parking permission, entrance accessibility and accommodations cannot safely be inferred from an address/map. docs/christina-review.md explicitly reserves these practical facts.

**Next action:** Obtain exact parking/entrance/accessibility details. Independently verified transit directions can be researched, but should not promise accessible building access.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-34-02

**Blocked → Blocked.** Couples/Imago association already exists; the unresolved part is Stronger Together versus Connected Couple and clinical classification documented in docs/christina-review.md. Choosing one from conflicting copy would invent the offering.

**Next action:** Resolve only the workshop identity/classification conflict, then align hub/detail terminology. Do not rework the already-clear Imago association.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-35-01

**Blocked → Blocked.** Cancellation notice periods and fees are a private practice policy; neither Pricing nor repository evidence provides an approved policy.

**Next action:** Obtain exact cancellation/rescheduling period and fees, then publish them on Pricing using existing content structure.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-35-03

**Blocked → Blocked.** Workshop price and per-person/per-couple basis are missing, and workshop identity itself is unresolved. No safe amount or basis can be inferred.

**Next action:** Obtain price/basis for each active confirmed offering, then add the corresponding Pricing/service detail.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-37-02

**Blocked → Ready.** Contact already includes an embedded map and complete CMS address; the remaining practical improvement that needs no private fact is a directly usable directions link. Parking/accessibility facts remain separately blocked under SEO-33-05. src/page-modules/contact/index.tsx:199 renders only iframe plus overlay.

**Next action:** Add an accessible Get directions external link adjacent to the existing map, deriving its destination from the same CMS address and using shared link styling. Scope this ticket to map/directions; retain unverified parking details under SEO-33-05.

**Direct Christina confirmation for scoped action:** No.

**Acceptance:** Link uses the exact currently rendered CMS address, works by keyboard on mobile/desktop without interacting with the iframe, has a descriptive label, and adds no inferred parking/accessibility claim.

### SEO-38-04

**Blocked → Backlog.** This is explicitly conditional on a sustained newsletter/workshop program. No such program is accepted; lack of that product decision is not a blocked website implementation.

**Next action:** Keep signup out of scope until there is a real mailing program, owner and cadence. Then scope consent/provider/content work; do not create an empty signup flow.

**Direct Christina confirmation for scoped action:** Yes.

### SEO-39-05

**Blocked → Archived.** Duplicates SEO-25-04’s article-specific disclaimer. Global footer already carries safetyNotice on article routes. Keeping a second blocked ticket overstates the dependency and work.

**Next action:** Track any justified article disclaimer once under SEO-25-04; preserve this source recommendation as a cross-reference.

**Direct Christina confirmation for scoped action:** No.
