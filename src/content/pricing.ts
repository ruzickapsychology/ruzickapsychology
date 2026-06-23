export const pricing = {
  eyebrow: "Pricing",
  heading: "Investment",
  intro:
    "Clear, honest fees and the space to ask questions. Good therapy is an investment in the rest of your life.",
  // PLACEHOLDER fees (from design mock) — confirm real values before launch.
  fees: {
    heading: "Session Fees",
    items: [
      { label: "Individual Therapy", detail: "50 minutes", price: "$225" },
      { label: "Couples / Imago Therapy", detail: "60 minutes", price: "$275" },
      { label: "Consultation Call", detail: "15 minutes", price: "Complimentary" },
    ],
    note: "Payment by card at the time of session. Detailed monthly superbills provided on request.",
  },
  insurance: {
    heading: "Insurance",
    body: [
      "I am an out-of-network provider. Practicing this way keeps your care private and fully tailored to you, rather than to the limits of an insurance plan.",
      "Each month I provide a superbill you can submit to your insurer for possible out-of-network reimbursement. I'm glad to walk you through how to ask about your benefits.",
      "A limited number of sliding-scale spaces are reserved for those with genuine financial need—please don't hesitate to ask.",
    ],
  },
  cta: {
    heading: "Have a question about fit or fees?",
    body: "Start with a free fifteen-minute call. No pressure, no commitment.",
    cta: "Schedule a consultation",
  },
} as const;
