export const pricing = {
  eyebrow: "Investment",
  heading: "Pricing",
  intro:
    "Therapy is a meaningful investment in your relationships and your future. We'll make sure you understand the process and costs upfront.",
  fees: {
    heading: "Session Fees",
    items: [
      { label: "Individual Therapy", detail: "50 minutes", price: "$225" },
      { label: "Couples / Imago Therapy", detail: "60 minutes", price: "$275" },
      { label: "Consultation Call", detail: "15 minutes", price: "Free" },
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
  reimbursementGuide: {
    eyebrow: "Out-of-network benefits",
    heading: "Are You Eligible for Insurance Reimbursement?",
    intro:
      "Follow these steps below to get the information you need from your insurance company.",
    items: [
      {
        eyebrow: "Step 1",
        title: "Call your insurance company",
        body: [
          "Use the member-services number on your insurance card and ask to speak with someone about outpatient behavioral health benefits.",
        ],
      },
      {
        eyebrow: "Step 2",
        title: "Find out if you have out-of-network benefits",
        body: [
          "Ask whether your plan reimburses outpatient psychotherapy with a licensed psychologist and whether you need a referral or prior authorization.",
        ],
      },
      {
        eyebrow: "Step 3",
        title: "Find out if you owe a deductible before the coverage kicks in",
        body: [
          "Ask for your out-of-network deductible, how much you have already met, and whether reimbursement begins only after the deductible is satisfied.",
        ],
      },
      {
        eyebrow: "Step 4",
        title: "Find out how much your plan will reimburse you",
        body: [
          "Ask what percentage of the plan's allowed amount is reimbursed, how to submit a superbill, and where you can find the claim form.",
        ],
      },
    ],
  },
  cta: {
    heading: "Have a question about fit or fees?",
    body: "Start with a complimentary 15 minute call. No pressure, no commitment.",
    cta: "Book a consultation",
  },
} as const;
