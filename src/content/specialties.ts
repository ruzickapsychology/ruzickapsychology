export type SpecialtyIcon = "circle" | "leaves" | "bud" | "quatrefoil";

export const specialties = {
  eyebrow: "Ways We Can Work Together",
  heading: "Therapy Specialties",
  intro:
    "Focused support for individuals, couples, mothers, and groups, with care tailored to the season you are in.",
  items: [
    {
      icon: "circle" as SpecialtyIcon,
      title: "Individual Therapy",
      body: "A protected space to remove the armor, explore what's beneath, and stop repeating the patterns that keep you stuck. Uncover the clarity, confidence, and self-compassion already within.",
      details: [
        "Individual sessions are tailored to your history, goals, and current season of life. Together, we can slow down the patterns that feel automatic and make more room for choice, steadiness, and self-trust.",
        "This work may be a fit if you are navigating anxiety, relationship stress, identity shifts, grief, burnout, or the sense that old ways of coping are no longer serving you.",
      ],
    },
    {
      icon: "leaves" as SpecialtyIcon,
      title: "Couples Counseling",
      body: "Using Imago Relationship Therapy—a structured, respected method that sees conflict not as failure but as a blueprint for growth and healing. Cultivate a deeper, lasting connection together.",
      details: [
        "Couples work creates a structured space to interrupt familiar cycles and practice a different way of hearing one another. The goal is not to decide who is right, but to understand what happens between you.",
        "Sessions can support couples who feel caught in repeated arguments, emotional distance, communication breakdowns, or major transitions that have shifted the relationship.",
      ],
    },
    {
      icon: "bud" as SpecialtyIcon,
      title: "Perinatal & Postpartum Support",
      body: "A safe space to drop the “perfect mother” mask, speak honestly about postpartum life, and gain expert psychological tools. Focus on shared healing and resilience.",
      details: [
        "Perinatal and postpartum therapy offers care for the emotional, relational, and identity changes that can come with pregnancy, birth, loss, and early parenthood.",
        "Support may include working with anxiety, intrusive thoughts, mood changes, resentment, isolation, relationship strain, or the pressure to feel grateful when you are also overwhelmed.",
      ],
    },
    {
      icon: "quatrefoil" as SpecialtyIcon,
      title: "Group Therapy",
      body: "Heal in community. The Connected Couple is an 8-week skills-based masterclass that teaches a practical communication system to restore safety, passion, and understanding.",
      details: [
        "Group offerings are designed to combine education, guided practice, and the relief of realizing you are not the only one navigating these dynamics.",
        "The format may be especially helpful for couples who want structured tools, shared language, and a focused way to practice new relational habits outside of weekly individual sessions.",
      ],
    },
  ],
  modality: {
    eyebrow: "Modalities",
    heading: "Certified Imago Relationship Therapy",
    body: [
      "Imago is a structured, deeply respected approach that reframes conflict as a doorway rather than a dead end. Together we slow down the moments where you and your partner get stuck, and build a shared language for being heard.",
      "Paired with evidence-based perinatal care, every method I use is chosen for one reason: to make our time together feel effective, safe, and uniquely tailored to your healing.",
    ],
  },
} as const;
