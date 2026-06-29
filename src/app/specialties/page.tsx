import type { Metadata } from "next";
import { BackgroundImageLayer } from "@/components/ui/background-image-layer";
import { Container } from "@/components/ui/container";
import { SpecialtyGlyph } from "@/components/ui/icons";
import { PortableContent } from "@/components/ui/portable-content";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo";
import { getSpecialtiesPage } from "@/lib/cms";

export const metadata: Metadata = pageMetadata({
  title: "Specialties",
  description:
    "Individual therapy, Imago couples counseling, perinatal and postpartum support, and group therapy in Rochester, NY.",
  path: "/specialties",
});

export default async function Specialties() {
  const specialties = await getSpecialtiesPage();
  if (!specialties) return null;

  return (
    <div className="rp-fade pt-16">
      <Section size="spacious">
        <Container size="xl" className="site-grid">
          <div className="grid-center-md mb-15 text-center">
            <p className="eyebrow">{specialties.eyebrow}</p>
            <h1 className="mt-4">{specialties.heading}</h1>
            <p className="body-2 mx-auto mt-4.5 max-w-[520px]">
              {specialties.intro}
            </p>
          </div>
          <div className="grid-card-2 grid-full">
            {specialties.items.map((s, i) => (
              <div
                key={s.title}
                className={`rp-q px-2 py-10 md:px-10 md:py-14 ${
                  i < 2 ? "border-b border-muted" : ""
                } ${i % 2 === 0 ? "md:border-r md:border-muted" : ""} ${
                  i === 2 ? "border-b md:border-b-0" : ""
                } border-muted`}
              >
                <div className="mb-5 text-[#C79DA4]">
                  <SpecialtyGlyph icon={s.icon} />
                </div>
                <h3 className="mb-3.5">{s.title}</h3>
                <p className="body-2">{s.summary}</p>
                {s.details.length ? (
                  <div className="body-3 mt-4 space-y-3 text-body/75">
                    {s.details.map((detail, detailIndex) => (
                      <p key={`${s.slug}-detail-${detailIndex}`}>{detail}</p>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* modality band */}
      {specialties.modality ? (
        <Section
          size="default"
          className="relative overflow-hidden bg-feature/35"
        >
          <BackgroundImageLayer image={specialties.modality.backgroundImage} />
          <Container size="xl" className="site-grid relative z-10">
            <div className="grid-center-xl px-8 py-12 text-left sm:px-12 sm:py-14">
              <p className="eyebrow">{specialties.modality.eyebrow}</p>
              <h2 className="heading-module mt-4 max-w-[640px]">
                {specialties.modality.heading}
              </h2>
              <PortableContent
                value={specialties.modality.body}
                className="body-2 mt-6 max-w-[640px] space-y-4"
              />
            </div>
          </Container>
        </Section>
      ) : null}
    </div>
  );
}
