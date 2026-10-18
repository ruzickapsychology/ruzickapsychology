// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "../setup/dom";
import { FAQPage } from "@/page-modules/faq";
import type { SiteSettings } from "@/data/cms";
vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));
const faq = {
  heading: "FAQs",
  items: [],
  cta: {
    heading: "Get in touch",
    body: "Ask about therapy.",
    cta: "Request a consultation",
  },
};
const site: SiteSettings = {
  name: "Practice",
  legalName: "Practice",
  practitioner: "Practitioner",
  phone: "(585) 667-0970",
  email: "hello@example.com",
  address: {
    streetAddress: "Street",
    addressLocality: "City",
    addressRegion: "NY",
    postalCode: "12345",
    addressCountry: "US",
  },
  hours: [],
  consultationCtaLabel: "Request a consultation",
  availabilityStatus: "accepting",
  areaServed: [],
  availabilityMessaging: {
    waitlist: {
      heroCta: "Waitlist",
      contactHeading: "Waitlist",
      contactIntro: "Waitlist",
      ctaHeading: "Waitlist available",
      ctaBody: "Ask about the waitlist.",
      homeCtaLabel: "Join the waitlist",
      pricingCtaHeading: "Waitlist",
      pricingCtaBody: "Waitlist",
      pricingCtaLabel: "Waitlist",
    },
    closed: {
      heroCta: "Specialties",
      contactHeading: "Closed",
      contactIntro: "Closed",
      ctaHeading: "Practice currently full",
      ctaBody: "Please check back.",
      pricingCtaHeading: "Closed",
      pricingCtaBody: "Closed",
      panelHeading: "Closed",
      panelBody: "Closed",
      contactMethodsLabel: "Administrative questions",
    },
  },
};

describe("FAQ consultation availability", () => {
  it("shows inquiry and phone options when accepting", () => {
    render(<FAQPage faq={faq} site={site} />);
    expect(
      screen.getByRole("link", { name: "Request a consultation" }),
    ).toHaveAttribute("href", "/contact");
    expect(
      screen.getByRole("link", { name: "Call (585) 667-0970" }),
    ).toHaveAttribute("href", "tel:5856670970");
  });
  it("uses waitlist messaging without promising a consultation", () => {
    render(
      <FAQPage faq={faq} site={{ ...site, availabilityStatus: "waitlist" }} />,
    );
    expect(
      screen.getByRole("link", { name: "Join the waitlist" }),
    ).toHaveAttribute("href", "/contact");
    expect(
      screen.queryByRole("link", { name: "Request a consultation" }),
    ).not.toBeInTheDocument();
  });
  it("shows the closed notice with neither phone nor inquiry actions", () => {
    render(
      <FAQPage faq={faq} site={{ ...site, availabilityStatus: "closed" }} />,
    );
    expect(
      screen.getByRole("heading", { name: "Practice currently full" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
  it("does not infer availability without settings", () => {
    render(<FAQPage faq={faq} site={null} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
