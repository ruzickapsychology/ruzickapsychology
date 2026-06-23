export type SpecialtyIcon = "circle" | "leaves" | "bud" | "quatrefoil";

export const specialties = {
  eyebrow: "Ways we can work together",
  heading: "Therapy offerings",
  items: [
    {
      icon: "circle" as SpecialtyIcon,
      title: "Individual Therapy",
      body: "A protected space to remove the armor, explore what's beneath, and stop repeating the patterns that keep you stuck. Uncover the clarity, confidence, and self-compassion already within.",
    },
    {
      icon: "leaves" as SpecialtyIcon,
      title: "Couples Counseling",
      body: "Using Imago Relationship Therapy—a structured, respected method that sees conflict not as failure but as a blueprint for growth and healing. Cultivate a deeper, lasting connection together.",
    },
    {
      icon: "bud" as SpecialtyIcon,
      title: "Perinatal & Postpartum Support",
      body: "A safe space to drop the “perfect mother” mask, speak honestly about postpartum life, and gain expert psychological tools. Focus on shared healing and resilience.",
    },
    {
      icon: "quatrefoil" as SpecialtyIcon,
      title: "Group Therapy",
      body: "Heal in community. The Connected Couple is an 8-week skills-based masterclass that teaches a practical communication system to restore safety, passion, and understanding.",
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
