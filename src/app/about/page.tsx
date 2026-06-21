import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Ruzicka Psychology PLLC",
  description:
    "Evidence-based psychotherapy tailored to your goals, with Dr. Christina Ruzicka, Psy.D., Licensed Clinical Psychologist.",
};

const credentials = [
  "Dr. Christina Ruzicka, Psy.D.",
  "Licensed Clinical Psychologist – New York",
  "Doctoral Degree: California School of Professional Psychology at Alliant International University, San Diego, CA",
  "Predoctoral APA Internship: University of Rochester, University Counseling Center",
  "Postdoctoral Fellowship: University of Rochester, University Counseling Center",
  "Specialized Training: Certified Imago Relationship Therapy Clinical Training",
  "Advanced Training: Perinatal Mental Health (Postpartum Support International - Certification Track)",
];

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1>Evidence-Based Psychotherapy Tailored to Your Goals</h1>

      <div className="mt-10 space-y-6 leading-relaxed">
        <p>
          If you are here, you are likely navigating a major season of
          transition. Maybe your relationship feels strained and disconnected,
          or perhaps you are a new mother trying to find your footing amidst
          intense postpartum anxiety. I want you to know that you don&apos;t
          have to carry this weight alone.
        </p>
        <p>
          My therapeutic style is relational, warm, collaborative, and active. I
          want to be engaged and connected to your world.
        </p>
        <p>
          As a clinical psychologist, I specialize in two core areas: helping
          couples move from friction to deep connection using Imago Relationship
          Therapy, and supporting women through the profound identity and
          emotional shifts of Perinatal and Postpartum Mental Health.
        </p>
        <p>
          Therapy is a profound investment of your time, vulnerability, and
          resources—and it is an investment I respect deeply. To ensure you
          receive the highest standard of clinical care, I intentionally
          dedicate my own resources to advanced training, specialized
          certifications, and continuous education. Rather than relying on a
          static, one-size-fits-all approach, I constantly refine my practice
          with the latest evidence-based frameworks, so our time together feels
          effective and uniquely tailored to your healing.
        </p>
      </div>

      <div className="mt-12 rounded-2xl bg-greige/50 p-8">
        <h2>Education &amp; Training</h2>
        <ul className="mt-6 space-y-3">
          {credentials.map((c) => (
            <li key={c} className="leading-relaxed">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
