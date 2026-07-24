// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "../setup/dom";
import { Button } from "@/components/button";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderEyebrow,
  ContentHeaderTitle,
} from "@/components/content-header";
import {
  DisclosureContent,
  DisclosureItem,
  DisclosureList,
  DisclosureTitle,
  DisclosureTrigger,
} from "@/components/disclosure-list";
import { Field, FieldLabel, Input } from "@/components/form-field";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
} from "@/components/page-header";

describe("shared component contracts", () => {
  it("forwards native button props and exposes its variant contract", () => {
    render(
      <Button variant="outline" aria-label="Retry request" disabled>
        Retry
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Retry request" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toBeDisabled();
  });

  it("keeps content-header hierarchy explicit and semantic", () => {
    render(
      <ContentHeader align="left" tone="inverse">
        <ContentHeaderEyebrow>Context</ContentHeaderEyebrow>
        <ContentHeaderTitle>Section title</ContentHeaderTitle>
        <ContentHeaderDescription>Supporting copy.</ContentHeaderDescription>
      </ContentHeader>,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Section title" }),
    ).toHaveAttribute("data-slot", "content-header-title");
    expect(screen.getByText("Context")).toHaveAttribute(
      "data-slot",
      "content-header-eyebrow",
    );
    expect(screen.getByText("Supporting copy.")).toHaveAttribute(
      "data-slot",
      "content-header-description",
    );
  });

  it("guarantees an h1 through the page-header title primitive", () => {
    render(
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Page title</PageHeaderTitle>
        </PageHeaderContent>
      </PageHeader>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Page title" }),
    ).toHaveAttribute("data-slot", "page-header-title");
  });

  it("composes accessible form controls without hiding their structure", () => {
    render(
      <Field>
        <FieldLabel htmlFor="email">Email address</FieldLabel>
        <Input id="email" type="email" />
      </Field>,
    );

    expect(screen.getByLabelText("Email address")).toHaveAttribute(
      "data-slot",
      "input",
    );
  });

  it("preserves native disclosure semantics through compound children", () => {
    render(
      <DisclosureList>
        <DisclosureItem>
          <DisclosureTrigger>
            <DisclosureTitle>Question</DisclosureTitle>
          </DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </DisclosureItem>
      </DisclosureList>,
    );

    expect(screen.getByText("Question").closest("summary")).toHaveAttribute(
      "data-slot",
      "disclosure-trigger",
    );
    expect(screen.getByText("Answer")).toHaveAttribute(
      "data-slot",
      "disclosure-content",
    );
  });
});
