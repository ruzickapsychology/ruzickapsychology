# Launch & Growth Runbook

Steps that have to be done in external dashboards (DNS, Google) — the code side is
already wired. Work top to bottom.

## 1. Go live on the real domain (move off Squarespace)

The codebase is domain-ready (`NEXT_PUBLIC_SITE_URL` defaults to
`https://www.ruzickapsychology.com`; sitemap, robots, canonical URLs, and OG image
all use it).

1. **Deploy to Vercel** — import the `GoonTwo/ruzickapsychology` repo in Vercel.
   It auto-detects Next.js; no build config needed. You'll get a
   `*.vercel.app` URL to confirm it works.
2. **Add the domain in Vercel** — Project → Settings → Domains → add
   `ruzickapsychology.com` and `www.ruzickapsychology.com`. Vercel shows the DNS
   records it wants.
3. **Point DNS at Vercel** at your domain registrar (where the domain is
   registered — may be Squarespace/Google Domains/etc.):
   - `A` record for the apex `@` → Vercel's IP (Vercel shows it, currently `76.76.21.21`)
   - `CNAME` for `www` → `cname.vercel-dns.com`
   - Removing the old Squarespace records is what actually moves the site.
4. **Set env vars in Vercel** (Project → Settings → Environment Variables),
   Production scope: `NEXT_PUBLIC_SITE_URL`, `WEB3FORMS_ACCESS_KEY`,
   `GOOGLE_SITE_VERIFICATION` (see step 3 below). Redeploy after adding them.
5. DNS can take minutes-to-hours to propagate. Vercel issues HTTPS automatically.

> Note: Vercel's free Hobby plan is for non-commercial use. A paying practice's
> site should be on the Pro plan (~$20/mo).

## 2. Google Business Profile (highest-leverage for local clients)

Not code — but the biggest driver of "therapist near me" discovery.

1. Create/claim the profile at https://business.google.com.
2. Category: **Psychologist** (or **Mental health service**). Add service area
   (Rochester / Monroe County), hours, phone, the website URL, and photos.
3. Verify (postcard/phone/video as Google offers).
4. Keep NAP (name, address, phone) **identical** to the website footer — consistency
   helps local ranking.

## 3. Google Search Console

1. Go to https://search.google.com/search-console, add the property for
   `https://www.ruzickapsychology.com`.
2. Choose the **HTML tag** verification method. Copy the `content="..."` token.
3. Put that token in the `GOOGLE_SITE_VERIFICATION` env var in Vercel and redeploy.
   The site renders the verification `<meta>` tag automatically — then click Verify.
4. Submit the sitemap: `https://www.ruzickapsychology.com/sitemap.xml`.

---

# Acquisition analytics (already wired)

Vercel Analytics is enabled. Beyond page views and referrers, these custom events
fire automatically so you can see the funnel:

| Event | Fires when |
|---|---|
| `consultation_cta_click` | A "Request a Consultation" button is clicked |
| `client_portal_click` | The Client Portal link is opened (nav or contact success) |
| `inquiry_submitted` | The contact form is submitted successfully |

View them in Vercel → Project → Analytics (events show once there's live traffic).
This answers "how many visitors move toward booking, and where did they come from?"

## Auto-responder

The contact form shows an **instant on-screen confirmation** with next steps and the
Client Portal link (see `src/app/contact/contact-form.tsx`) — no setup required.

To also email the person an automatic reply: Web3Forms has an autoresponder feature
in its dashboard (may require their paid tier). Alternatively, switch delivery to an
email API (e.g. Resend) later — the server action in
`src/app/contact/actions.ts` is the single place to change.
