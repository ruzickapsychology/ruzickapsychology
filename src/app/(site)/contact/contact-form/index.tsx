"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { buttonClasses } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { HEADER_SENTINEL_ID } from "@/components/ui/header-sentinel";
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

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContactForm({ note }: { note?: string }) {
  const [state, setState] = useState<InquiryState>(initialState);
  const [pending, setPending] = useState(false);
  const [animationRun, setAnimationRun] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastScrolled, setToastScrolled] = useState(false);

  useEffect(() => {
    if (state.status === "success") track("inquiry_submitted");
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

    const form = event.currentTarget;
    const formData = new FormData(form);

    const botcheck = formData.get("botcheck");

    if (String(formData.get("company") ?? "").trim() || botcheck) {
      setPending(true);
      await wait(successTransitionMs);
      setPending(false);
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

      setAnimationRun((run) => run + 1);
      setState({
        status: "success",
      });
      setShowToast(true);
      form.reset();
    } catch (error) {
      console.error("[contact] Web3Forms client error:", error);
      setState({
        status: "error",
        message:
          "Something went wrong sending your message. Please try again, or email directly.",
      });
    } finally {
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

      <form onSubmit={handleSubmit} className={styles.form}>
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
            <div className={styles.fieldsShell}>
              <SubmissionBloom animationRun={animationRun} />
            </div>
            <div className={styles.actionSpacer} aria-hidden />
          </>
        ) : (
          <>
            <div
              className={classNames(
                styles.fieldsShell,
                styles.formActive,
                pending && styles.formSubmitting,
              )}
            >
              <div className={styles.fieldsStack}>
                <div className={styles.fieldGrid}>
                  <FormField
                    id="contact-first-name"
                    name="firstName"
                    required
                    label="First name"
                    placeholder="First name*"
                    className={styles.field}
                  />
                  <FormField
                    id="contact-last-name"
                    name="lastName"
                    label="Last name"
                    placeholder="Last name"
                    className={styles.field}
                  />
                </div>
                <FormField
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  label="Email address"
                  placeholder="Email address*"
                  className={styles.field}
                />
                <FormField
                  id="contact-therapy-type"
                  name="therapyType"
                  label="Therapy interest"
                  placeholder="What type of therapy are you interested in?"
                  className={styles.field}
                />
                <FormField
                  id="contact-format"
                  name="format"
                  label="Preferred appointment format"
                  placeholder="Would you prefer in-person or virtual therapy?"
                  className={styles.field}
                />
                <div className={styles.fieldGrid}>
                  <FormField
                    id="contact-city"
                    name="city"
                    label="City"
                    placeholder="What city are you based in?"
                    className={styles.field}
                  />
                  <FormField
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    label="Phone number"
                    placeholder="Phone number"
                    className={styles.field}
                  />
                </div>
                <FormField
                  id="contact-message"
                  name="message"
                  rows={6}
                  required
                  label="Scheduling or general question"
                  aria-describedby={note ? safetyNoteId : undefined}
                  placeholder="Share a scheduling question or general note.*"
                  className={classNames(styles.field, styles.textarea)}
                  multiline
                />
              </div>
              {note ? (
                <p id={safetyNoteId} className={styles.privacyNote}>
                  {note}
                </p>
              ) : null}
            </div>

            {state.status === "error" && (
              <p className={styles.error}>{state.message}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className={buttonClasses(
                "primary",
                classNames(styles.submit, styles.submitFocus),
              )}
            >
              {pending ? "Sending…" : "Submit →"}
            </button>
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
      className={classNames(
        styles.toast,
        scrolled ? styles.toastScrolled : styles.toastInitial,
      )}
      role="status"
      aria-live="polite"
    >
      <div className={styles.toastContent}>
        <p className={styles.toastLabel}>Message Received</p>
        <p className={styles.toastDetail}>
          Expect a reply within 2 business days
        </p>
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
