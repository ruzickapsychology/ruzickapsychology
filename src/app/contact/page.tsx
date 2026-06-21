import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Ruzicka Psychology PLLC",
  description:
    "Request a consultation. Complete the inquiry form to discuss therapeutic solutions aligned with your goals.",
};

export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-4xl">Request a Consultation</h1>
      <p className="mt-5 leading-relaxed">
        Kindly complete the inquiry form to facilitate a confidential discussion
        regarding therapeutic solutions aligned with your individual goals.
      </p>

      <form className="mt-10 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="First Name" name="firstName" />
          <Field label="Last Name" name="lastName" />
        </div>
        <Field label="Email" name="email" type="email" />
        <Field label="Phone" name="phone" type="tel" />
        <div>
          <label htmlFor="message" className="block text-sm tracking-wide">
            How can I help?
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="mt-2 w-full rounded-lg border border-beige bg-white/60 px-4 py-3 outline-none focus:border-rose"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-rose px-8 py-3 text-sm tracking-wide text-cream transition hover:bg-rose-dark"
        >
          Submit Inquiry
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
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
        className="mt-2 w-full rounded-lg border border-beige bg-white/60 px-4 py-3 outline-none focus:border-rose"
      />
    </div>
  );
}
