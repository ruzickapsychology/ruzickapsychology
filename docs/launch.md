# Launch And Growth Runbook

Steps that happen outside the codebase for launch, search, and acquisition.

## 1. Deploy To Vercel

1. Import the GitHub repo in Vercel.
2. Confirm the preview deployment builds.
3. Add production environment variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
   - `GOOGLE_SITE_VERIFICATION`, when Search Console is ready
4. Redeploy after adding env vars.
5. Open the preview URL and check `/`, `/studio`, `/contact`, and `/blog`.

If the build fails with missing Sanity env vars, add the `NEXT_PUBLIC_SANITY_*` values in the Vercel project and redeploy.

## 2. Go Live On The Real Domain

The codebase is domain-ready through `NEXT_PUBLIC_SITE_URL`; sitemap, robots, canonical URLs, and OpenGraph output use it.

1. In Vercel Project Settings, add `ruzickapsychology.com` and `www.ruzickapsychology.com`.
2. Vercel will show the DNS records it needs.
3. At the domain registrar, point DNS to Vercel:
   - Apex `A` record for `@` to Vercel's IP, currently `76.76.21.21`.
   - `CNAME` for `www` to `cname.vercel-dns.com`.
4. Remove old site host records when ready to cut over.
5. Wait for DNS propagation. Vercel issues HTTPS automatically.

Vercel's free Hobby plan is for non-commercial use. A paying practice site should be on the Pro plan.

## 3. Sanity Studio

Studio is available at `/studio`.

Before launch:

1. Confirm the production Vercel deployment has the Sanity public env vars.
2. Confirm the dataset has seeded documents or edited production content.
3. Confirm singleton pages and practice settings are present.
4. Confirm image assets and alt text are present.

## 4. Contact Form

The contact form submits directly to Web3Forms with `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`.

Before launch:

1. Confirm the access key belongs to the intended recipient inbox.
2. Submit a test inquiry from production.
3. Confirm the email arrives.
4. Confirm the success toast and flower state display.
5. Confirm the privacy/minimization and emergency note appears near submit.
6. Confirm the `botcheck` honeypot remains hidden and normal submissions still work.
7. Confirm the fallback error is readable if delivery fails.

## 5. Google Business Profile

Highest leverage for local discovery.

1. Create or claim the profile at https://business.google.com.
2. Category: Psychologist, or Mental health service if more appropriate.
3. Add service area, hours, phone, website URL, and photos.
4. Verify through the method Google offers.
5. Keep NAP details identical to the website.

## 6. Google Search Console

1. Go to https://search.google.com/search-console.
2. Add `https://www.ruzickapsychology.com`.
3. Choose the HTML tag verification method.
4. Put the token in `GOOGLE_SITE_VERIFICATION` in Vercel.
5. Redeploy and click Verify.
6. Submit `https://www.ruzickapsychology.com/sitemap.xml`.

## 7. Analytics

Vercel Analytics is enabled. Custom events:

| Event                    | Fires When                       |
| ------------------------ | -------------------------------- |
| `consultation_cta_click` | A consultation CTA is clicked    |
| `client_portal_click`    | The Client Portal link is opened |
| `inquiry_submitted`      | The contact form succeeds        |

Review events in Vercel Project Analytics after real traffic starts.

## 8. Post-Launch Checks

- Run PageSpeed Insights for mobile and desktop.
- Confirm sitemap loads.
- Confirm robots.txt loads.
- Confirm all primary nav routes load.
- Confirm all blog posts load.
- Confirm Studio is accessible to the right editors.
- Confirm forms, analytics, and portal links work.
