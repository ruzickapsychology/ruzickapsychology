import Link from "next/link";

const services = [
  {
    title: "Individual Therapy",
    body: "Navigate life's transitions, manage anxiety, and reconnect with your personal values. A tailored, evidence-based space dedicated entirely to your personal growth and emotional resilience.",
  },
  {
    title: "Group Therapy & Support",
    body: "Strengthen your communication, navigate conflict with compassion, and rebuild intimacy. Grounded support designed to help you and your partner cultivate a deeper, lasting connection.",
  },
  {
    title: "Maternal Mental Health",
    body: "Honoring the profound transition into motherhood. Specialized therapeutic support for postpartum anxiety, depression, identity shifts, and the intense demands of early parenting.",
  },
  {
    title: "Couples Therapy",
    body: "Heal in community. Specialized, collaborative groups designed to provide a safe, shared space where you can connect with others navigating similar life transitions and challenges.",
  },
];

const steps = [
  {
    label: "Step 1: Connect",
    body: "Reach out via the contact form or client portal to request a free, 15-minute introductory phone call.",
  },
  {
    label: "Step 2: Consult",
    body: "We will speak briefly to discuss your goals, answer any logistical questions, and ensure we are a great clinical fit.",
  },
  {
    label: "Step 3: Begin",
    body: "We will schedule your initial intake appointment and begin working collaboratively toward your healing.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="bg-beige/40">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed">
            Evidence-based psychotherapy tailored to your unique story.
            Specialized support for couples seeking connection, and women
            navigating maternal mental health and postpartum anxiety.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-rose px-8 py-3 text-sm tracking-wide text-cream transition hover:bg-rose-dark"
          >
            Request a Consultation
          </Link>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-3xl">Professional Therapy Services</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="rounded-2xl bg-beige/40 p-8">
              <h3 className="text-xl">{s.title}</h3>
              <p className="mt-3 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-beige/40">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-20 md:grid-cols-[1fr_1.4fr] md:items-start">
          <h2 className="text-3xl">Meet Dr. Christina Ruzicka</h2>
          <div>
            <p className="leading-relaxed">
              My approach is relational, warm, collaborative, and active —
              engaged with your world. As a clinical psychologist, I adapt
              evidence-based methods to your unique story. I help couples move
              from friction to deeper connection with Imago Relationship Therapy
              and support women through Perinatal and Postpartum mental health.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-rose underline-offset-4 transition hover:text-rose-dark hover:underline"
            >
              Inside the Practice →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-3xl">How We Begin</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.label}>
              <h3 className="text-lg text-rose">{step.label}</h3>
              <p className="mt-2 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-4xl">Ready to take the first step?</h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed">
            Submit the inquiry form to request your free, 15-minute introductory
            phone call. I look forward to connecting with you.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-rose px-8 py-3 text-sm tracking-wide text-cream transition hover:bg-rose-dark"
          >
            Request a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
