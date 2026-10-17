"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentProps, FormEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { Button } from "@/components/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  Input,
  Textarea,
} from "@/components/form-field";
import { Eyebrow, Text } from "@/components/typography";
import { cn } from "@/lib/class-names";
import { HEADER_SENTINEL_ID } from "@/components/header-sentinel";
import styles from "./styles.module.css";

type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const initialState: InquiryState = { status: "idle" };
const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
const successTransitionMs = 420;
const safetyNoteId = "contact-form-safety-note";

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function ContactInputField({
  id,
  label,
  ...props
}: {
  id: string;
  label: string;
} & Omit<ComponentProps<typeof Input>, "id">) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {label}
        {props.required ? " (required)" : " (optional)"}
      </FieldLabel>
      <Input id={id} tone="inverse" {...props} />
    </Field>
  );
}

function ContactTextareaField({
  id,
  label,
  ...props
}: {
  id: string;
  label: string;
} & Omit<ComponentProps<typeof Textarea>, "id">) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {label}
        {props.required ? " (required)" : " (optional)"}
      </FieldLabel>
      <Textarea id={id} tone="inverse" {...props} />
    </Field>
  );
}

export function ContactForm({
  note,
  initialInterest,
}: {
  note?: string;
  initialInterest?: string;
}) {
  const [state, setState] = useState<InquiryState>(initialState);
  const [pending, setPending] = useState(false);
  const [animationRun, setAnimationRun] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastScrolled, setToastScrolled] = useState(false);
  const [successHeight, setSuccessHeight] = useState<number>();
  const submissionInFlight = useRef(false);
  const successRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      successRef.current?.focus({ preventScroll: true });
      successRef.current?.scrollIntoView({
        block: "center",
        behavior: "instant",
      });
    }
  }, [state.status]);

  useEffect(() => {
    if (state.status === "error") errorRef.current?.focus();
  }, [state.status]);

  useEffect(() => {
    if (!showToast) return;

    const timeout = window.setTimeout(() => setShowToast(false), 10000);

    return () => window.clearTimeout(timeout);
  }, [showToast]);

  useEffect(() => {
    const onScroll = () => {
      const sentinel = document.getElementById(HEADER_SENTINEL_ID);
      setToastScrolled(
        sentinel ? sentinel.getBoundingClientRect().top <= 64 : true,
      );
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInFlight.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const botcheck = formData.get("botcheck");

    if (String(formData.get("company") ?? "").trim() || botcheck) {
      submissionInFlight.current = true;
      setPending(true);
      await wait(successTransitionMs);
      setPending(false);
      submissionInFlight.current = false;
      return;
    }

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!firstName || !email || !message) {
      setState({
        status: "error",
        message: "Please share your name, email, and a short message.",
      });
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState({
        status: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (!accessKey) {
      setState({
        status: "error",
        message: "The form isn't fully configured yet. Please email directly.",
      });
      return;
    }

    submissionInFlight.current = true;
    setPending(true);
    const transitionStartedAt = window.performance.now();

    try {
      const payload = {
        access_key: accessKey,
        subject: `New consultation inquiry - ${firstName} ${lastName}`,
        from_name: "Ruzicka Psychology Website",
        botcheck: false,
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone: String(formData.get("phone") ?? "").trim() || "-",
        message: [
          message,
          "",
          `Interested in: ${String(formData.get("therapyType") ?? "").trim() || "-"}`,
          `Format: ${String(formData.get("format") ?? "").trim() || "-"}`,
          `City: ${String(formData.get("city") ?? "").trim() || "-"}`,
        ].join("\n"),
      };

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => null);

      if (!res.ok || !result?.success) {
        throw new Error(result?.message ?? "Web3Forms submission failed");
      }

      const elapsed = window.performance.now() - transitionStartedAt;
      if (elapsed < successTransitionMs) {
        await wait(successTransitionMs - elapsed);
      }

      // Measurement must never change the result of a delivered inquiry.
      try {
        track("inquiry_submitted");
      } catch {
        // Keep the successful delivery state when analytics is unavailable.
      }
      // Retain the filled form's footprint when replacing it with confirmation.
      setSuccessHeight(form.getBoundingClientRect().height);
      setAnimationRun((run) => run + 1);
      setState({
        status: "success",
      });
      setShowToast(true);
      form.reset();
    } catch {
      console.error("[contact] Inquiry delivery failed");
      setState({
        status: "error",
        message:
          "Something went wrong sending your message. Please try again, or email directly.",
      });
    } finally {
      submissionInFlight.current = false;
      setPending(false);
    }
  }

  return (
    <>
      {showToast && (
        <SuccessToastPortal
          onDismiss={() => setShowToast(false)}
          scrolled={toastScrolled}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className={styles.form}
        aria-busy={pending}
        style={successHeight ? { minHeight: successHeight } : undefined}
      >
        <div aria-hidden className={styles.honeypot}>
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
          <label htmlFor="botcheck">Do not check this box</label>
          <input
            id="botcheck"
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {state.status === "success" ? (
          <>
            <div className={cn(styles.fieldsShell, styles.successShell)}>
              <SubmissionBloom animationRun={animationRun} />
              <Text ref={successRef} tabIndex={-1} role="status" tone="inverse">
                Your message has been received. Thank you for getting in touch.
              </Text>
            </div>
            <div className={styles.actionSpacer} aria-hidden />
          </>
        ) : (
          <>
            <div
              className={cn(
                styles.fieldsShell,
                styles.formActive,
                pending && styles.formSubmitting,
              )}
            >
              <div className={styles.fieldsStack}>
                <div className={styles.fieldGrid}>
                  <ContactInputField
                    id="contact-first-name"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    label="First name"
                    placeholder="First name*"
                  />
                  <ContactInputField
                    id="contact-last-name"
                    name="lastName"
                    autoComplete="family-name"
                    label="Last name"
                    placeholder="Last name"
                  />
                </div>
                <ContactInputField
                  id="contact-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  label="Email address"
                  placeholder="Email address*"
                />
                <ContactInputField
                  id="contact-therapy-type"
                  name="therapyType"
                  label="Therapy interest"
                  defaultValue={initialInterest}
                  placeholder="What type of therapy are you interested in?"
                />
                <ContactInputField
                  id="contact-format"
                  name="format"
                  label="Preferred appointment format"
                  placeholder="Would you prefer in-person or virtual therapy?"
                />
                <div className={styles.fieldGrid}>
                  <ContactInputField
                    id="contact-city"
                    name="city"
                    autoComplete="address-level2"
                    label="City"
                    placeholder="What city are you based in?"
                  />
                  <ContactInputField
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    label="Phone number"
                    placeholder="Phone number"
                  />
                </div>
                <ContactTextareaField
                  id="contact-message"
                  name="message"
                  rows={6}
                  required
                  label="Scheduling or general question"
                  aria-describedby={safetyNoteId}
                  placeholder="Share a scheduling question or general note.*"
                />
              </div>
              <FieldDescription
                id={safetyNoteId}
                tone="inverse"
                className={styles.privacyNote}
              >
                {note ? <>{note} </> : null}
                <Link href="/privacy">Read the privacy notice</Link> before
                sending.
              </FieldDescription>
            </div>

            {state.status === "error" && (
              <FieldError ref={errorRef} tone="inverse" tabIndex={-1}>
                {state.message}
              </FieldError>
            )}

            <Button
              type="submit"
              disabled={pending}
              tone="inverse"
              className={styles.submit}
            >
              {pending ? "Sending…" : "Submit →"}
            </Button>
          </>
        )}
      </form>
    </>
  );
}

function SuccessToastPortal({
  onDismiss,
  scrolled,
}: {
  onDismiss: () => void;
  scrolled: boolean;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <SuccessToast onDismiss={onDismiss} scrolled={scrolled} />,
    document.body,
  );
}

function SuccessToast({
  onDismiss,
  scrolled,
}: {
  onDismiss: () => void;
  scrolled: boolean;
}) {
  return (
    <div
      className={cn(
        styles.toast,
        scrolled ? styles.toastScrolled : styles.toastInitial,
      )}
      role="status"
      aria-live="polite"
    >
      <div className={styles.toastContent}>
        <Eyebrow variant="label" tone="inherit" className={styles.toastLabel}>
          Message Received
        </Eyebrow>
        <Text variant="detail" tone="inherit" className={styles.toastDetail}>
          Thank you for getting in touch
        </Text>
      </div>
      <button
        type="button"
        className={styles.toastClose}
        onClick={onDismiss}
        aria-label="Dismiss message"
      >
        ×
      </button>
    </div>
  );
}

function SubmissionBloom({ animationRun }: { animationRun: number }) {
  return (
    <div className={styles.bloom} aria-hidden>
      <div className={styles.bloomFlower} key={animationRun} aria-hidden>
        <Image
          src={`/images/submission-flower.svg?v=${animationRun}`}
          alt=""
          className={styles.bloomArt}
          width={397}
          height={500}
          unoptimized
        />
      </div>
    </div>
  );
}
