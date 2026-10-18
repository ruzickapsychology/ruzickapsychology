// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "../setup/dom";
import type { HomePageContent } from "@/data/cms";
import { HomeSpecialties } from "@/page-modules/home/specialties";

const specialties: HomePageContent["specialties"] = {
  eyebrow: "Ways to work together",
  heading: "Therapy specialties",
  items: [
    {
      title: "Individual therapy",
      slug: "individual-therapy",
      pageStatus: "published",
      icon: "leaves",
      summary: "Published service",
      details: [],
    },
    {
      title: "Group therapy",
      slug: "group-therapy",
      pageStatus: "hubOnly",
      icon: "quatrefoil",
      summary: "Hub-only service",
      details: [],
    },
  ],
};

describe("retained homepage specialty layouts", () => {
  it.each(["quadrant", "botanical"] as const)(
    "keeps content and publication-aware links when selecting %s",
    (layout) => {
      const { container } = render(
        <HomeSpecialties specialties={specialties} layout={layout} />,
      );
      expect(
        screen.getByRole("heading", { name: specialties.heading }),
      ).toBeVisible();
      expect(
        screen.getByRole("link", { name: /Individual therapy/ }),
      ).toHaveAttribute("href", "/specialties/individual-therapy");
      expect(screen.getByText("Hub-only service")).toBeVisible();
      expect(
        screen.queryByRole("link", { name: /Group therapy/ }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /View all specialties/ }),
      ).toHaveAttribute("href", "/specialties");
      expect(container.querySelector("#home-specialties")).not.toBeNull();
      if (layout === "quadrant") {
        expect(
          container.querySelector('[data-divider-grid="2"]'),
        ).not.toBeNull();
        expect(
          container.querySelector('[data-slot="specialty-glyph"]'),
        ).toHaveAttribute("width", "38");
        expect(container.querySelector("[data-specimen-cabinet]")).toBeNull();
      } else {
        expect(
          container.querySelector("[data-specimen-cabinet]"),
        ).not.toBeNull();
        expect(
          container.querySelector('[data-slot="divider-grid"]'),
        ).toBeNull();
      }
    },
  );
});
