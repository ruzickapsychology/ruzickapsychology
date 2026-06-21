"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "./actions";

const initialState: InquiryState = { status: "idle" };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitInquiry, initialState);

  if (state.status === "success") {
    return (
      <div className="mt-10 rounded-2xl bg-greige/50 p-8 text-center">
        <p className="leading-relaxed">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-10 space-y-6">
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="First Name" name="firstName" required />
        <Field label="Last Name" name="lastName" />
      </div>
      <Field label="Email" name="email" type="email" required />
      <Field label="Phone" name="phone" type="tel" />
      <div>
        <label htmlFor="message" className="block text-sm tracking-wide">
          How can I help?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-2 w-full rounded-lg border border-greige bg-white/60 px-4 py-3 outline-none focus:border-rose-dark"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-rose-dark">{state.message}</p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? "Sending…" : "Submit Inquiry"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm tracking-wide">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-lg border border-greige bg-white/60 px-4 py-3 outline-none focus:border-rose-dark"
      />
    </div>
  );
}
