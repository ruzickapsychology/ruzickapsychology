"use client";

import { useActionState, useEffect } from "react";
import { track } from "@vercel/analytics";
import { submitInquiry, type InquiryState } from "./actions";
import { site } from "@/content/site";

const initialState: InquiryState = { status: "idle" };

const fieldClass =
  "w-full rounded-[14px] border border-fg/20 bg-white/55 px-5 py-4 text-[15px] text-fg outline-none transition-colors placeholder:text-accent/50 focus:border-accent";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitInquiry, initialState);

  useEffect(() => {
    if (state.status === "success") track("inquiry_submitted");
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="rounded-[24px] border border-muted bg-surface p-10">
        <h2 className="text-[28px]">Thank you for reaching out.</h2>
        <p className="mt-4 leading-relaxed">
          Your message has been received. I&apos;ll personally review it and
          respond within 1–2 business days to find a time for your free,
          15-minute introductory call.
        </p>
        <p className="mt-4 leading-relaxed">
          If you&apos;d like to get started sooner, you&apos;re welcome to
          request an appointment directly through the secure client portal:
        </p>
        <a
          href={site.portalUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("client_portal_click", { source: "contact_success" })}
          className="btn btn-secondary mt-6"
        >
          Open the Client Portal
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input name="firstName" required placeholder="First Name*" className={fieldClass} />
        <input name="lastName" placeholder="Last Name*" className={fieldClass} />
      </div>
      <input
        type="email"
        name="email"
        required
        placeholder="Email Address*"
        className={fieldClass}
      />
      <input
        name="therapyType"
        placeholder="What type of therapy are you interested in?"
        className={fieldClass}
      />
      <input
        name="format"
        placeholder="Would you prefer in-person or virtual therapy?"
        className={fieldClass}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="city" placeholder="What city are you based in?" className={fieldClass} />
        <input type="tel" name="phone" placeholder="Phone number" className={fieldClass} />
      </div>
      <textarea
        name="message"
        rows={6}
        required
        placeholder="Tell me a little about what brings you to therapy.*"
        className={`${fieldClass} resize-y`}
      />

      {state.status === "error" && (
        <p className="text-sm text-accent">{state.message}</p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary mt-1.5 self-start">
        {pending ? "Sending…" : "Submit →"}
      </button>
    </form>
  );
}
