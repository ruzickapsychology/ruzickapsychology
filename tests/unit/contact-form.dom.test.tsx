// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../setup/dom";
import { track } from "@vercel/analytics";
import { ContactForm } from "@/page-modules/contact/contact-form";

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY = "test-only-key";
});
vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

function fillRequired() {
  fireEvent.change(screen.getByLabelText("First name (required)"), {
    target: { value: "Test" },
  });
  fireEvent.change(screen.getByLabelText("Email address (required)"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(
    screen.getByLabelText("Scheduling or general question (required)"),
    { target: { value: "Scheduling question" } },
  );
}
function submit() {
  fireEvent.submit(
    screen.getByRole("button", { name: "Submit →" }).closest("form")!,
  );
}

describe("contact form delivery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("keeps labels, prefilled interest and privacy guidance available", () => {
    render(
      <ContactForm
        initialInterest="Couples therapy"
        note="Keep your message brief."
      />,
    );
    expect(screen.getByLabelText("First name (required)")).toHaveAttribute(
      "autocomplete",
      "given-name",
    );
    expect(screen.getByDisplayValue("Couples therapy")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Read the privacy notice" }),
    ).toHaveAttribute("href", "/privacy");
    expect(
      screen.getByLabelText("Scheduling or general question (required)"),
    ).toHaveAccessibleDescription(/Keep your message brief/);
  });

  it("tracks once after successful delivery and preserves a focused success confirmation", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);
    fillRequired();
    const form = screen
      .getByRole("button", { name: "Submit →" })
      .closest("form")!;
    fireEvent.submit(form);
    fireEvent.submit(form);
    const confirmation = await screen.findByText(
      "Your message has been received. Thank you for getting in touch.",
    );
    await waitFor(() => expect(confirmation).toHaveFocus());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledExactlyOnceWith("inquiry_submitted");
    fireEvent.click(screen.getByRole("button", { name: "Dismiss message" }));
    expect(confirmation).toBeInTheDocument();
    expect(track).toHaveBeenCalledTimes(1);
  });

  it("confirms delivery even when analytics throws", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.mocked(track).mockImplementationOnce(() => {
      throw new Error("Analytics unavailable");
    });
    render(<ContactForm />);
    fillRequired();
    const form = screen
      .getByRole("button", { name: "Submit →" })
      .closest("form")!;
    const reset = vi.spyOn(form, "reset");
    submit();
    const confirmation = await screen.findByText(
      "Your message has been received. Thank you for getting in touch.",
    );
    await waitFor(() => expect(confirmation).toHaveFocus());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(reset).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("preserves entered fields and focuses a safe error after failed delivery", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: "private vendor response" }),
      }),
    );
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ContactForm />);
    fillRequired();
    submit();
    const error = await screen.findByRole("alert");
    await waitFor(() => expect(error).toHaveFocus());
    expect(screen.getByLabelText("First name (required)")).toHaveValue("Test");
    expect(track).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledExactlyOnceWith(
      "[contact] Inquiry delivery failed",
    );
  });

  it.each(["company", "botcheck"])(
    "does not deliver or track when %s is filled",
    async (field) => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      const { container } = render(<ContactForm />);
      fillRequired();
      const input = container.querySelector(`input[name="${field}"]`)!;
      if (field === "botcheck") fireEvent.click(input);
      else fireEvent.change(input, { target: { value: "bot" } });
      submit();
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Submit →" })).toBeEnabled(),
      );
      expect(fetchMock).not.toHaveBeenCalled();
      expect(track).not.toHaveBeenCalled();
    },
  );
});
