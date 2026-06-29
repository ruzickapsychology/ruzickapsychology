import type { Metadata } from "next";
import { BackgroundImageLayer } from "@/components/ui/background-image-layer";
import { Container } from "@/components/ui/container";
import { PortableContent } from "@/components/ui/portable-content";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo";
import { backgroundImage } from "@/lib/cms-images";
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
      <Section size="default">
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
      </Section>

      {/* therapy space */}
      {about.space ? (
        <Section size="spacious" className="bg-feature/35">
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
                  <div className="relative h-full w-full overflow-hidden">
                    <BackgroundImageLayer
                      image={about.space.exteriorImage}
                      alt={about.space.exteriorImage.alt ?? "Office exterior"}
                    />
                  </div>
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
              <div className="relative aspect-[4/3] overflow-hidden border border-muted bg-surface/45">
                <BackgroundImageLayer
                  image={about.space.interiorImage}
                  alt={about.space.interiorImage?.alt ?? "Therapy office seating area"}
                />
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* philosophy band (replaces client testimonial — see content note) */}
      {about.philosophy ? (
        <Section
          size="default"
          id="about-quote-band"
          className="relative overflow-hidden bg-fg"
        >
          <BackgroundImageLayer image={about.philosophy.backgroundImage} />
          <div className="absolute inset-0 z-0 bg-[#071819]/20" aria-hidden />
          <Container size="xl" className="site-grid relative z-10">
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
        </Section>
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
