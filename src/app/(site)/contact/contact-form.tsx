"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { track } from "@vercel/analytics";
import { buttonClasses } from "@/components/ui/button";
import { HEADER_SENTINEL_ID } from "@/components/ui/header-sentinel";
import styles from "./contact-form.module.css";

type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const initialState: InquiryState = { status: "idle" };
const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
const successTransitionMs = 420;

const fieldClass =
  "body-3 w-full rounded-none border-0 bg-contact-overlay/65 px-4 py-2.5 leading-snug text-light outline-none transition-colors placeholder:text-light/50 focus:bg-contact-overlay/75";

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function ContactForm() {
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

    if (String(formData.get("company") ?? "").trim()) {
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div aria-hidden className="absolute left-[-9999px]">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
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
              className={`${styles.fieldsShell} ${styles.formActive} ${
                pending ? styles.formSubmitting : ""
              }`}
            >
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="firstName"
                    required
                    placeholder="First name*"
                    className={fieldClass}
                  />
                  <input
                    name="lastName"
                    placeholder="Last name"
                    className={fieldClass}
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email address*"
                  className={fieldClass}
                />
                <input
                  name="therapyType"
                  placeholder="What type of therapy are you interested in?"
                  className={fieldClass}
                />
                <input
                  name="format"
                  placeholder="Would you prefer in-person or virtual therapy?"
                  className={fieldClass}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="city"
                    placeholder="What city are you based in?"
                    className={fieldClass}
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    className={fieldClass}
                  />
                </div>
                <textarea
                  name="message"
                  rows={6}
                  required
                  placeholder="Tell me a little about what brings you to therapy.*"
                  className={`${fieldClass} resize-y`}
                />
              </div>
            </div>

            {state.status === "error" && (
              <p className="body-3 text-light">{state.message}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className={buttonClasses("primary", "mt-1.5 self-start")}
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
      className={`${styles.toast} ${
        scrolled ? styles.toastScrolled : styles.toastInitial
      }`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.toastContent}>
        <p className="mono-label">Message Received</p>
        <p className={`${styles.toastDetail} body-3 mt-1`}>
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
    <div
      className={`${styles.bloom} bg-contact-overlay/65 text-light h-full w-full px-6 py-4`}
      aria-hidden
    >
      <div className={styles.bloomFlower} key={animationRun} aria-hidden>
        <object
          data={`/images/submission-flower.svg?v=${animationRun}`}
          type="image/svg+xml"
          className={styles.bloomArt}
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
