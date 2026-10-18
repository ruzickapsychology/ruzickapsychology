// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "../setup/dom";
import { BlogPostPage } from "@/page-modules/blog-post";
import type { SiteSettings } from "@/data/cms";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

const post = {
  title: "Article",
  slug: "article",
  excerpt: "An article.",
  date: "2026-01-01",
  readTime: "1 min read",
  body: [],
};
const ctaContent = {
  heading: "Get in touch",
  body: "Ask about therapy.",
  cta: "Request a consultation",
};
const site: SiteSettings = {
  name: "Practice",
  legalName: "Practice",
  practitioner: "Practitioner",
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

describe("blog consultation path", () => {
  it("uses CMS consultation copy and links to contact when accepting", () => {
    render(
      <BlogPostPage
        post={post}
        olderPost={null}
        site={{ ...site, consultationCtaLabel: "Ask about therapy" }}
        ctaContent={ctaContent}
      />,
    );
    expect(
      screen.getByRole("link", { name: "Ask about therapy" }),
    ).toHaveAttribute("href", "/contact");
  });

  it("uses waitlist copy instead of promising a consultation", () => {
    render(
      <BlogPostPage
        post={post}
        olderPost={null}
        site={{ ...site, availabilityStatus: "waitlist" }}
        ctaContent={ctaContent}
      />,
    );
    expect(
      screen.getByRole("link", { name: "Join the waitlist" }),
    ).toHaveAttribute("href", "/contact");
    expect(
      screen.queryByRole("link", { name: "Request a consultation" }),
    ).not.toBeInTheDocument();
  });

  it("shows the closed notice without an inquiry CTA", () => {
    render(
      <BlogPostPage
        post={post}
        olderPost={null}
        site={{ ...site, availabilityStatus: "closed" }}
        ctaContent={ctaContent}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Practice currently full" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /consultation|waitlist/i }),
    ).not.toBeInTheDocument();
  });

  it("does not infer availability when site settings are missing", () => {
    render(
      <BlogPostPage
        post={post}
        olderPost={null}
        site={null}
        ctaContent={ctaContent}
      />,
    );
    expect(
      screen.queryByRole("link", { name: "Request a consultation" }),
    ).not.toBeInTheDocument();
  });
});
