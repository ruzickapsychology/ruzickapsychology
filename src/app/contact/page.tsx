import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Request a consultation. Complete the inquiry form to discuss therapeutic solutions aligned with your goals.",
  path: "/contact",
});

export default function Contact() {
  return (
    <Container size="sm" className="py-20">
      <h1>Request a Consultation</h1>
      <p className="mt-5 leading-relaxed">
        Kindly complete the inquiry form to facilitate a confidential discussion
        regarding therapeutic solutions aligned with your individual goals.
      </p>
      <ContactForm />
    </Container>
  );
}
