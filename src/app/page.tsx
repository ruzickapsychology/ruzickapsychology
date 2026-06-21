import Link from "next/link";

const services = [
  {
    title: "Individual Therapy",
    body: "One-on-one sessions to work through anxiety, depression, life transitions, and personal growth.",
  },
  {
    title: "Couples Therapy",
    body: "Support for communication, connection, and navigating conflict together.",
  },
  {
    title: "Telehealth",
    body: "Secure online sessions so you can meet from wherever you feel most comfortable.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-16 px-6 py-20">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-700">
          Ruzicka Psychology
        </p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Therapy that meets you where you are.
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Compassionate, evidence-based care for individuals and couples.
          In-person and online sessions available.
        </p>
        <div className="mt-2 flex gap-3">
          <Link
            href="#contact"
            className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Book a consultation
          </Link>
          <Link
            href="#services"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Learn more
          </Link>
        </div>
      </header>

      <section id="services" className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Services</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
            >
              <h3 className="font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold">Get in touch</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Ready to begin? Reach out to schedule a free 15-minute consultation.
        </p>
        <a
          href="mailto:hello@ruzickapsychology.com"
          className="w-fit rounded-full bg-emerald-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          hello@ruzickapsychology.com
        </a>
      </section>

      <footer className="mt-auto border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800">
        © {new Date().getFullYear()} Ruzicka Psychology. All rights reserved.
      </footer>
    </main>
  );
}
