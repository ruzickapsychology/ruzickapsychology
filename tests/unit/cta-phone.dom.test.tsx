// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "../setup/dom";
import { track } from "@vercel/analytics";
import { CtaSection } from "@/components/cta-section";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

describe("consultation phone option", () => {
  beforeEach(() => vi.clearAllMocks());

  it("uses the supplied practice number and sends only one phone event", () => {
    render(
      <CtaSection
        heading="Get in touch"
        cta="Request a consultation"
        phone="+1 (585) 667-0970"
      />,
    );
    const phone = screen.getByRole("link", { name: "Call +1 (585) 667-0970" });
    expect(phone).toHaveAttribute("href", "tel:+15856670970");
    expect(phone).toHaveAttribute("target", "_self");
    expect(
      screen.getByRole("link", { name: "Request a consultation" }),
    ).toHaveAttribute("href", "/contact");
    fireEvent.click(phone);
    expect(track).toHaveBeenCalledExactlyOnceWith("phone_click");
  });

  it("does not restore a consultation action when the availability CTA is disabled", () => {
    render(
      <CtaSection heading="Practice currently full" phone="(585) 667-0970" />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("keeps the contact action usable when no CMS phone is available", () => {
    render(<CtaSection heading="Get in touch" cta="Request a consultation" />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(
      screen.queryByRole("link", { name: /^Call / }),
    ).not.toBeInTheDocument();
  });
});
