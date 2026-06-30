# Forms And Analytics

## Contact Form

The contact form is `src/app/(site)/contact/contact-form/index.tsx`.

It is a client component that:

- Validates required fields in the browser.
- Uses a local honeypot field named `company` and the Web3Forms reserved
  `botcheck` checkbox honeypot.
- Submits directly to `https://api.web3forms.com/submit`.
- Uses `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`.
- Labels every form control for assistive technology and shows keyboard focus
  styles on fields and submit/dismiss controls.
- Reminds visitors to keep messages brief, avoid sensitive clinical details,
  and use emergency services for immediate help.
- Shows inline errors for validation or delivery failures.
- Shows a success flower state and toast after submission.
- Tracks `inquiry_submitted` with Vercel Analytics only after a successful human submission.

This direct-submit path is intentional. It keeps the site static and avoids maintaining a server action for simple email delivery.

## Web3Forms Setup

1. Create an access key in Web3Forms for the recipient email.
2. Add it to `.env.local` and Vercel as `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`.
3. Submit a local test inquiry.
4. Confirm the email arrives and the success state appears.

Because Web3Forms access keys are designed for client-side forms, the key is public. Do not put secret email-service API keys in a `NEXT_PUBLIC_*` variable.

## Field Structure

Current fields:

- First name.
- Last name.
- Email.
- Therapy type.
- Preferred format.
- City.
- Phone.
- Message.
- Hidden `company` honeypot.
- Hidden `botcheck` checkbox honeypot reserved by Web3Forms.

If fields change, update the payload mapping and keep the email message readable.

## Analytics Events

Vercel Analytics is enabled in `src/app/layout.tsx`.

Tracked events:

- `consultation_cta_click` - primary consultation CTAs.
- `client_portal_click` - Client Portal links.
- `inquiry_submitted` - successful contact form delivery.

Use `src/components/cta-link/index.tsx` for tracked internal CTAs and `src/components/tracked-external-link/index.tsx` for tracked external links. Keep event names stable unless analytics reporting is intentionally reset.

## Success And Error States

Success should:

- Keep the form region visually stable.
- Fade smoothly from fields to success art.
- Show an ephemeral toast near the top nav.
- Be dismissible.

Errors should:

- Use approved brand colors with sufficient contrast.
- Explain the action the visitor can take.
- Preserve entered fields so the visitor can correct and resubmit.
