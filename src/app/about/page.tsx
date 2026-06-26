import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PortableContent } from "@/components/ui/portable-content";
import { pageMetadata } from "@/lib/seo";
import { backgroundImage, overlayBackgroundImage } from "@/lib/cms-images";
import { getAboutPage } from "@/lib/cms";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Evidence-based psychotherapy tailored to your goals, with Dr. Christina Ruzicka, Psy.D., Licensed Clinical Psychologist in Rochester, NY.",
  path: "/about",
});

export default async function About() {
  const about = await getAboutPage();
  if (!about) return null;

  return (
    <div className="rp-fade pt-16">
      {/* bio */}
      <section className="py-16 sm:py-20">
        <Container
          size="xl"
          className="site-grid items-start"
        >
          <div className="grid-split-media mx-auto w-full max-w-[360px] rounded-full border border-muted p-2 md:sticky md:top-24 lg:justify-self-center">
            <div
              className="aspect-square w-full overflow-hidden rounded-full bg-cover bg-center"
              style={{
                backgroundImage: backgroundImage(about.portraitImage),
                backgroundPosition: "center 20%",
              }}
            />
          </div>
          <div className="grid-split-copy">
            <p className="eyebrow">{about.credentials}</p>
            <h1 className="heading-section mt-3.5">
              {about.heading}
            </h1>
            <PortableContent value={about.intro} className="prose mt-7" />

            {about.credentialGroups?.length ? (
              <div className="mt-11 border-b border-muted">
                {about.credentialGroups.map((group) => (
                  <Credentials key={group.heading} group={group} license={group.license} />
                ))}
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* therapy space */}
      {about.space ? (
        <section className="bg-feature/35 py-24 sm:py-32">
          <Container size="xl" className="site-grid">
            <div className="grid-center-md text-center">
              <p className="eyebrow">{about.space.eyebrow}</p>
              <h2 className="heading-item mt-4">{about.space.heading}</h2>
              <p className="body-2 mx-auto mt-4 max-w-[480px]">
                {about.space.body}
              </p>
            </div>

            <div className="grid-card-2 grid-full mt-12 gap-5 md:gap-7">
              <div className="aspect-[4/3] border border-muted bg-surface/45">
                {about.space.exteriorImage?.asset?.url ? (
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                      backgroundImage: backgroundImage(about.space.exteriorImage),
                    }}
                    role="img"
                    aria-label={about.space.exteriorImage.alt ?? "Office exterior"}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-8 text-center">
                    <div>
                      <p className="mono-label text-accent">Exterior Photo</p>
                      <p className="body-3 mt-4 max-w-[260px] text-body/75">
                        Placeholder for the building exterior.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div
                className="aspect-[4/3] border border-muted bg-cover bg-center"
                style={{
                  backgroundImage: backgroundImage(about.space.interiorImage),
                }}
                role="img"
                aria-label={about.space.interiorImage?.alt ?? "Therapy office seating area"}
              />
            </div>
          </Container>
        </section>
      ) : null}

      {/* philosophy band (replaces client testimonial — see content note) */}
      {about.philosophy ? (
        <section
          id="about-quote-band"
          className="bg-cover bg-center py-16 sm:py-20"
          style={{
            backgroundImage: overlayBackgroundImage(
              about.philosophy.backgroundImage,
              "linear-gradient(rgb(7 24 25 / 0.2), rgb(7 24 25 / 0.2))",
            ),
          }}
        >
          <Container size="xl" className="site-grid">
            <div className="grid-center-xl px-8 py-12 text-center sm:px-12 sm:py-14">
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
          </Container>
        </section>
      ) : null}
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
