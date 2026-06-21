"use server";

// ── Contact form delivery: SETUP REQUIRED ──────────────────────────────────
// This form sends inquiries through Web3Forms (free, no DNS/domain setup).
// Until WEB3FORMS_ACCESS_KEY is set, the form shows a "please email directly"
// message and does NOT send — nothing breaks, it just won't deliver.
//
// To turn it on:
//   1. Go to https://web3forms.com, enter the email that should receive
//      inquiries (e.g. christina@ruzickapsychology.com). They email you a key.
//   2. Set WEB3FORMS_ACCESS_KEY:
//        - Local dev: add it to a .env.local file at the repo root
//        - Production: Vercel → Project → Settings → Environment Variables
//   3. Redeploy (or restart `npm run dev`). Submissions then land in that inbox.
//
// The access key is safe to expose — it only routes mail to the pre-registered
// address. We keep it in an env var to stay out of git, not because it's secret.
// Note: real booking/intake also flows through the SimplePractice "Client
// Portal" link in the nav, which works regardless of this form.
// ───────────────────────────────────────────────────────────────────────────

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Honeypot: bots fill hidden fields; humans don't.
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "success", message: "Thank you — your message has been sent." };
  }

  const data = {
    firstName: String(formData.get("firstName") ?? "").trim(),
    lastName: String(formData.get("lastName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  if (!data.firstName || !data.email || !data.message) {
    return {
      status: "error",
      message: "Please share your name, email, and a short message.",
    };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    console.warn("[contact] WEB3FORMS_ACCESS_KEY not set — inquiry not delivered:", data);
    return {
      status: "error",
      message:
        "The form isn't fully configured yet. Please email christina@ruzickapsychology.com directly.",
    };
  }

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `New consultation inquiry — ${data.firstName} ${data.lastName}`,
      from_name: "Ruzicka Psychology Website",
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone || "—",
      message: data.message,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Web3Forms error:", await res.text());
    return {
      status: "error",
      message:
        "Something went wrong sending your message. Please try again, or email directly.",
    };
  }

  return {
    status: "success",
    message: "Thank you — your message has been sent. I'll be in touch shortly.",
  };
}
