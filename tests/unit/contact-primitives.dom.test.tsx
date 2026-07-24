// @vitest-environment jsdom
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "../setup/dom";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  Input,
  Textarea,
} from "@/components/form-field";
import { Button, buttonVariants } from "@/components/button";

describe("form and action primitives", () => {
  it("preserves native input identity, ref, constraints and description association", () => {
    const inputRef = createRef<HTMLInputElement>();
    const descriptionRef = createRef<HTMLParagraphElement>();
    render(
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          ref={inputRef}
          type="email"
          name="email"
          required
          autoComplete="email"
          aria-describedby="email-note"
          className="custom-control"
        />
        <FieldDescription id="email-note" ref={descriptionRef}>
          Scheduling only
        </FieldDescription>
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    expect(inputRef.current).toBe(input);
    expect(descriptionRef.current).toBe(screen.getByText("Scheduling only"));
    expect(input).toHaveAttribute("data-tone", "default");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("autocomplete", "email");
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription("Scheduling only");
    expect(input).toHaveClass("custom-control");
  });
  it("supports inverse textarea and focusable error refs without leaking tone attributes", () => {
    const textareaRef = createRef<HTMLTextAreaElement>();
    const errorRef = createRef<HTMLParagraphElement>();
    render(
      <>
        <Textarea
          ref={textareaRef}
          tone="inverse"
          aria-label="Message"
          aria-invalid="true"
          aria-describedby="message-error"
          rows={6}
          defaultValue="Question"
        />
        <FieldError
          ref={errorRef}
          id="message-error"
          tone="inverse"
          tabIndex={-1}
        >
          Please retry
        </FieldError>
      </>,
    );
    const textarea = screen.getByRole("textbox");
    expect(textareaRef.current).toBe(textarea);
    expect(textarea).toHaveValue("Question");
    expect(textarea).toHaveAttribute("rows", "6");
    expect(textarea).toHaveAttribute("data-tone", "inverse");
    expect(textarea).not.toHaveAttribute("tone");
    expect(textarea).toHaveAccessibleDescription("Please retry");
    errorRef.current?.focus();
    expect(screen.getByRole("alert")).toHaveFocus();
  });
  it("shares the inverse button treatment with links and retains native defaults", () => {
    render(
      <>
        <Button>Default</Button>
        <Button tone="inverse" type="submit" disabled>
          Send
        </Button>
        <a href="/contact" className={buttonVariants({ tone: "inverse" })}>
          Contact
        </a>
      </>,
    );
    expect(screen.getByRole("button", { name: "Default" })).toHaveAttribute(
      "type",
      "button",
    );
    expect(screen.getByRole("button", { name: "Default" })).toHaveAttribute(
      "data-tone",
      "default",
    );
    const submit = screen.getByRole("button", { name: "Send" });
    expect(submit).toBeDisabled();
    expect(submit).toHaveAttribute("type", "submit");
    expect(submit).toHaveAttribute("data-tone", "inverse");
    expect(screen.getByRole("link")).toHaveAttribute("class", submit.className);
  });
});
