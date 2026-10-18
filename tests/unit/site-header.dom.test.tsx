// @vitest-environment jsdom

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "../setup/dom";
import { track } from "@vercel/analytics";
import type { SiteSettings } from "@/data/cms";
import { usePathname } from "next/navigation";
import { HEADER_SENTINEL_ID } from "@/components/header-sentinel";
import { initialAvailabilityMessaging } from "@/config/availability";
import { SiteHeader } from "@/components/site-header";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string | { pathname?: string };
    children: ReactNode;
  }) => (
    <a
      href={typeof href === "string" ? href : (href.pathname ?? "")}
      {...props}
    >
      {children}
    </a>
  ),
}));

vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}));

describe("SiteHeader mobile navigation", () => {
  let mediaChangeListeners: Set<(event: MediaQueryListEvent) => void>;

  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue("/");
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    mediaChangeListeners = new Set();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: (
          _type: string,
          listener: (event: MediaQueryListEvent) => void,
        ) => mediaChangeListeners.add(listener),
        removeEventListener: (
          _type: string,
          listener: (event: MediaQueryListEvent) => void,
        ) => mediaChangeListeners.delete(listener),
        dispatchEvent: vi.fn(),
      })),
    });
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });
  });

  it.each([
    ["accepting", "Request a consultation"],
    ["waitlist", "Join the waitlist"],
    ["closed", "Current availability"],
  ] as const)(
    "uses the %s inquiry action in desktop and mobile navigation",
    async (status, label) => {
      const user = userEvent.setup();
      render(
        <SiteHeader
          siteSettings={
            {
              name: "Ruzicka Psychology PLLC",
              consultationCtaLabel: "Request a consultation",
              availabilityStatus: status,
              availabilityMessaging: initialAvailabilityMessaging,
              portalUrl: "https://example.com/portal",
            } as SiteSettings
          }
        />,
      );
      const desktop = screen.getByRole("navigation", {
        name: "Primary navigation",
      });
      expect(
        within(desktop).getByRole("link", { name: label }),
      ).toHaveAttribute("href", "/contact");
      expect(
        within(desktop).queryByRole("link", { name: /^Contact$/ }),
      ).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Open menu" }));
      const dialog = await screen.findByRole("dialog");
      const action = within(dialog).getByRole("link", { name: label });
      expect(action).toHaveAttribute("href", "/contact");
      expect(
        within(dialog).getByRole("link", { name: "Existing Client Portal" }),
      ).toHaveAttribute("href", "https://example.com/portal");
      await user.click(action);
      expect(track).toHaveBeenCalledWith("consultation_cta_click");
      expect(
        screen.getByRole("button", { name: "Close menu" }),
      ).toHaveAttribute("aria-expanded", "false");
    },
  );

  it("opens as a modal, traps focus, and restores interaction on Escape", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SiteHeader />
        <main>Page content</main>
        <footer>Footer content</footer>
      </>,
    );

    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", {
      name: "Navigation menu",
    });
    const firstLink = within(dialog).getByRole("link", { name: "About" });

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(firstLink).toHaveFocus();
    expect(screen.getByRole("main")).toHaveProperty("inert", true);
    expect(screen.getByRole("contentinfo")).toHaveProperty("inert", true);
    expect(document.body).toHaveStyle({ overflow: "hidden" });

    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(trigger).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("main")).toHaveProperty("inert", false);
    expect(screen.getByRole("contentinfo")).toHaveProperty("inert", false);
  });

  it("restores the page when an open menu crosses the desktop breakpoint", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SiteHeader />
        <main>Page content</main>
        <footer>Footer content</footer>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: "hidden" });

    act(() => {
      for (const listener of mediaChangeListeners) {
        listener({
          matches: true,
          media: "(min-width: 1024px)",
        } as MediaQueryListEvent);
      }
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveProperty("inert", false);
    expect(screen.getByRole("contentinfo")).toHaveProperty("inert", false);
    expect(document.body).toHaveStyle({ overflow: "" });
  });

  it.each(["/contact", "/contact/"])(
    "makes %s solid while scrolling through the form and transparent again at top",
    (pathname) => {
      vi.mocked(usePathname).mockReturnValue(pathname);
      render(
        <>
          <SiteHeader />
          <div id={HEADER_SENTINEL_ID} />
        </>,
      );
      const sentinel = document.getElementById(HEADER_SENTINEL_ID)!;
      vi.spyOn(sentinel, "getBoundingClientRect").mockReturnValue({
        top: 1500,
      } as DOMRect);
      const header = screen.getByRole("banner");
      expect(header).toHaveAttribute("data-background", "contact");
      act(() => {
        Object.defineProperty(window, "scrollY", {
          configurable: true,
          value: 64,
        });
        window.dispatchEvent(new Event("scroll"));
      });
      expect(header).toHaveAttribute("data-background", "solid");
      act(() => {
        Object.defineProperty(window, "scrollY", {
          configurable: true,
          value: 0,
        });
        window.dispatchEvent(new Event("scroll"));
      });
      expect(header).toHaveAttribute("data-background", "contact");
    },
  );

  it.each(["/", "/index", "/index/"])(
    "renders %s transparent in the initial server HTML",
    (pathname) => {
      vi.mocked(usePathname).mockReturnValue(pathname);
      expect(renderToString(<SiteHeader />)).toContain(
        'data-background="home"',
      );
    },
  );

  it.each(["/", "/index", "/index/"])(
    "keeps %s transparent before its hero has laid out",
    (pathname) => {
      vi.mocked(usePathname).mockReturnValue(pathname);
      render(
        <>
          <SiteHeader />
          <div id={HEADER_SENTINEL_ID} />
        </>,
      );
      // A sentinel in streamed, hidden content initially has a zero rect.
      const header = screen.getByRole("banner");
      expect(header).toHaveAttribute("data-background", "home");

      act(() => {
        Object.defineProperty(window, "scrollY", {
          configurable: true,
          value: 1000,
        });
        window.dispatchEvent(new Event("scroll"));
      });
      expect(header).toHaveAttribute("data-background", "solid");

      act(() => {
        Object.defineProperty(window, "scrollY", {
          configurable: true,
          value: 0,
        });
        window.dispatchEvent(new Event("scroll"));
      });
      expect(header).toHaveAttribute("data-background", "home");
    },
  );

  it("keeps homepage transparency tied to its hero sentinel", () => {
    render(
      <>
        <SiteHeader />
        <div id={HEADER_SENTINEL_ID} />
      </>,
    );
    const sentinel = document.getElementById(HEADER_SENTINEL_ID)!;
    vi.spyOn(sentinel, "getBoundingClientRect").mockReturnValue({
      top: 1000,
    } as DOMRect);
    act(() => {
      Object.defineProperty(window, "scrollY", {
        configurable: true,
        value: 128,
      });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("banner")).toHaveAttribute(
      "data-background",
      "home",
    );
  });
});
