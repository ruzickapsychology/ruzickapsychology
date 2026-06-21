import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact — Ruzicka Psychology PLLC",
  description:
    "Request a consultation. Complete the inquiry form to discuss therapeutic solutions aligned with your goals.",
};

export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1>Request a Consultation</h1>
      <p className="mt-5 leading-relaxed">
        Kindly complete the inquiry form to facilitate a confidential discussion
        regarding therapeutic solutions aligned with your individual goals.
      </p>
      <ContactForm />
    </div>
  );
}
