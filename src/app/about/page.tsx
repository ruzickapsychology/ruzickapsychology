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
      <section className="py-16 sm:py-20">
        <Container
          size="xl"
          className="grid items-start gap-12 md:grid-cols-[445px_1fr] md:gap-16"
        >
          <div className="mx-auto w-full max-w-[360px] rounded-full border border-muted p-2 md:sticky md:top-24">
            <div
              className="aspect-square w-full overflow-hidden rounded-full bg-cover bg-center"
              style={{
                backgroundImage: "url(/images/portrait-large.jpg)",
                backgroundPosition: "center 20%",
              }}
            />
          </div>
          <div>
            <p className="eyebrow">{about.credentials}</p>
            <h1 className="heading-section mt-3.5">
              {about.heading}
            </h1>
            <div className="prose mt-7">
              {about.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-11 border-b border-muted">
              <Credentials group={about.education} />
              <Credentials group={about.training} license={about.training.license} />
            </div>
          </div>
        </Container>
      </section>

      {/* therapy space */}
      <section className="bg-feature/35 py-24 sm:py-32">
        <Container size="xl">
          <div className="mx-auto max-w-[680px] text-center">
            <p className="eyebrow">{about.space.eyebrow}</p>
            <h2 className="heading-item mt-4">{about.space.heading}</h2>
            <p className="body-2 mx-auto mt-4 max-w-[480px]">
              {about.space.body}
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-7">
            <div className="flex aspect-[4/3] items-center justify-center border border-muted bg-surface/45 p-8 text-center">
              <div>
                <p className="mono-label text-accent">Exterior Photo</p>
                <p className="body-3 mt-4 max-w-[260px] text-body/75">
                  Placeholder for the building exterior.
                </p>
              </div>
            </div>
            <div
              className="aspect-[4/3] border border-muted bg-cover bg-center"
              style={{ backgroundImage: "url(/images/therapy-room.jpg)" }}
              role="img"
              aria-label="Therapy office seating area"
            />
          </div>
        </Container>
      </section>

      {/* philosophy band (replaces client testimonial — see content note) */}
      <section
        id="about-quote-band"
        className="bg-cover bg-center px-6 py-16 sm:py-20"
        style={{
          backgroundImage:
            "linear-gradient(rgb(7 24 25 / 0.2), rgb(7 24 25 / 0.2)), url(/images/bouquet.jpg)",
        }}
      >
        <div className="mx-auto max-w-[1120px] px-8 py-12 text-center sm:px-12 sm:py-14">
          <p className="mb-6 font-sans text-[13px] font-semibold uppercase tracking-[0.24em] text-light/90">
            {about.philosophy.eyebrow}
          </p>
          <p className="heading-module mx-auto max-w-[680px] leading-snug text-light">
            “{about.philosophy.quote}”
          </p>
          <p className="mono-label mt-7 normal-case tracking-[0.08em] text-light/75">
            —{about.philosophy.attribution}
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
    <details className="group border-t border-muted">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
        <span className="body-1 font-heading leading-tight text-fg">
          {group.heading}
        </span>
        <span className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </summary>
      <div className="pb-7 pr-10">
        {group.items.map((item) => (
          <p key={item.title} className="body-3 mb-4">
            <strong className="font-bold text-fg">{item.title}</strong>
            <br />
            {item.detail}
          </p>
        ))}
        {license && (
          <p className="body-3 mt-1 text-body/70">
            {license}
          </p>
        )}
      </div>
    </details>
  );
}
