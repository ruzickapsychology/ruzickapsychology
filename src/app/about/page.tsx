import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/seo";
import { about } from "@/content/about";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Evidence-based psychotherapy tailored to your goals, with Dr. Christina Ruzicka, Psy.D., Licensed Clinical Psychologist in Rochester, NY.",
  path: "/about",
});

export default function About() {
  return (
    <div className="rp-fade pt-16">
      {/* bio */}
      <section className="pt-16 sm:pt-20">
        <Container
          size="xl"
          className="grid items-start gap-12 md:grid-cols-[445px_1fr] md:gap-16"
        >
          <div
            className="aspect-[1/0.94] w-full overflow-hidden rounded-[20px] bg-cover md:sticky md:top-24"
            style={{
              backgroundImage: "url(/images/portrait-large.jpg)",
              backgroundPosition: "center 20%",
            }}
          />
          <div>
            <p className="eyebrow">{about.credentials}</p>
            <h1 className="mt-3.5">{about.heading}</h1>
            <div className="mt-7 space-y-5 text-lg leading-relaxed">
              {about.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-11 grid gap-10 border-t border-muted pt-9 sm:grid-cols-2">
              <Credentials group={about.education} />
              <Credentials group={about.training} license={about.training.license} />
            </div>
          </div>
        </Container>
      </section>

      {/* what to expect */}
      <section className="py-24 sm:py-28">
        <Container size="xl">
          <div className="mb-14 text-center">
            <p className="eyebrow">{about.expect.eyebrow}</p>
            <h2 className="mt-4">{about.expect.heading}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {about.expect.steps.map((step) => (
              <div
                key={step.n}
                className="rounded-[24px] border border-muted bg-surface p-8"
              >
                <div className="mono-label mb-4 text-[12px] text-accent">
                  {step.n}
                </div>
                <h3 className="mb-3 text-[22px]">{step.title}</h3>
                <p className="text-[15px] leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* philosophy band (replaces client testimonial — see content note) */}
      <section
        className="bg-cover bg-center px-6 py-24 sm:py-28"
        style={{ backgroundImage: "url(/images/bouquet.jpg)" }}
      >
        <div className="mx-auto max-w-[1120px] rounded-[32px] border border-light/20 bg-fg/25 px-8 py-20 text-center shadow-[0_24px_60px_rgba(58,35,40,0.25)] backdrop-blur-[2px] sm:px-12 sm:py-24">
          <p className="mb-6 font-sans text-[12px] font-semibold uppercase tracking-[0.24em] text-light/90">
            {about.philosophy.eyebrow}
          </p>
          <p className="mx-auto max-w-[680px] font-heading text-[clamp(1.6rem,4vw,34px)] leading-snug text-light">
            “{about.philosophy.quote}”
          </p>
        </div>
      </section>
    </div>
  );
}

function Credentials({
  group,
  license,
}: {
  group: { heading: string; items: ReadonlyArray<{ title: string; detail: string }> };
  license?: string;
}) {
  return (
    <div>
      <h3 className="mb-5 text-[24px]">{group.heading}</h3>
      {group.items.map((item) => (
        <p key={item.title} className="mb-4 text-[15.5px] leading-relaxed">
          <strong className="font-bold text-fg">{item.title}</strong>
          <br />
          {item.detail}
        </p>
      ))}
      {license && (
        <p className="mono-label mt-1 text-[13px] tracking-[0.04em] normal-case text-body/70">
          {license}
        </p>
      )}
    </div>
  );
}
