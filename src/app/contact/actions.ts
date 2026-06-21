"use server";

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Honeypot: bots fill hidden fields; humans don't.
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "success", message: "Thank you — your message has been sent." };
  }

  const data = {
    firstName: String(formData.get("firstName") ?? "").trim(),
    lastName: String(formData.get("lastName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  if (!data.firstName || !data.email || !data.message) {
    return {
      status: "error",
      message: "Please share your name, email, and a short message.",
    };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "christina@ruzickapsychology.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "Ruzicka Psychology <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set — inquiry not delivered:", data);
    return {
      status: "error",
      message:
        "The form isn't fully configured yet. Please email christina@ruzickapsychology.com directly.",
    };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: data.email,
      subject: `New consultation inquiry — ${data.firstName} ${data.lastName}`,
      text: [
        `Name: ${data.firstName} ${data.lastName}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "—"}`,
        "",
        data.message,
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error:", await res.text());
    return {
      status: "error",
      message:
        "Something went wrong sending your message. Please try again, or email directly.",
    };
  }

  return {
    status: "success",
    message: "Thank you — your message has been sent. I'll be in touch shortly.",
  };
}
