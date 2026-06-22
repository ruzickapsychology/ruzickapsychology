import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
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
    <Section tone="default">
      <Container size="sm">
        <h1>Request a Consultation</h1>
        <p className="mt-5 leading-relaxed">
          Kindly complete the inquiry form to facilitate a confidential
          discussion regarding therapeutic solutions aligned with your
          individual goals.
        </p>
        <ContactForm />
      </Container>
    </Section>
  );
}
