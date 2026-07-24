// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "../setup/dom";
import { ContentSection } from "@/components/content-section";
import { Grid } from "@/components/grid";

describe("section layout composition", () => {
  it("forwards section semantics while applying split layout and gap to the inner grid", () => {
    render(
      <ContentSection
        aria-label="Therapy approach"
        id="approach"
        layout="editorial"
        gap="lg"
        containerClassName="custom-layout"
      >
        <div>Introduction</div>
        <div>Details</div>
      </ContentSection>,
    );
    const section = screen.getByRole("region", { name: "Therapy approach" });
    expect(section).toHaveAttribute("id", "approach");
    expect(section).not.toHaveAttribute("gap");
    const content = section.querySelector(
      '[data-slot="content-section-content"]',
    );
    expect(content).toHaveAttribute("data-layout", "editorial");
    expect(content).toHaveAttribute("data-gap", "lg");
    expect(content).toHaveClass("custom-layout");
    expect(content?.children).toHaveLength(2);
  });

  it("keeps the default section container free of grid behavior", () => {
    render(<ContentSection aria-label="Article">Article text</ContentSection>);
    const content = screen.getByRole("region", {
      name: "Article",
    }).firstElementChild;
    expect(content).not.toHaveAttribute("data-layout");
    expect(content).not.toHaveAttribute("data-gap");
  });

  it("exposes the portrait layout on the regular grid with native attributes", () => {
    render(
      <Grid layout="portrait" aria-label="Practitioner" className="custom-grid">
        <div>Portrait</div>
        <div>Biography</div>
      </Grid>,
    );
    const grid = screen.getByLabelText("Practitioner");
    expect(grid).toHaveAttribute("data-layout", "portrait");
    expect(grid).toHaveClass("custom-grid");
  });
});
