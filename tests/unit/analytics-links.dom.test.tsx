// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "../setup/dom";
import { track } from "@vercel/analytics";
import { TrackedExternalLink } from "@/components/tracked-external-link";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

describe("contact link measurement", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    ["phone_click", "tel:+15856670970"],
    ["email_click", "mailto:hello@example.com"],
  ])("sends only the %s event name", (event, href) => {
    render(
      <TrackedExternalLink href={href} event={event} target="_self">
        Contact
      </TrackedExternalLink>,
    );
    fireEvent.click(screen.getByRole("link"));
    expect(track).toHaveBeenCalledExactlyOnceWith(event);
  });

  it("does not count a canceled navigation", () => {
    render(
      <TrackedExternalLink
        href="https://example.com"
        event="client_portal_click"
        onClick={(event) => event.preventDefault()}
      >
        Portal
      </TrackedExternalLink>,
    );
    fireEvent.click(screen.getByRole("link"));
    expect(track).not.toHaveBeenCalled();
  });
});
