import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SpecialtyGlyph } from "@/components/ui/icons";
import { PortableContent } from "@/components/ui/portable-content";
import { pageMetadata } from "@/lib/seo";
import { backgroundImage } from "@/lib/cms-images";
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
      <section className="py-20">
        <Container size="xl">
          <div className="mb-15 text-center">
            <p className="eyebrow">{specialties.eyebrow}</p>
            <h1 className="mt-4">{specialties.heading}</h1>
            <p className="body-2 mx-auto mt-4.5 max-w-[520px]">
              {specialties.intro}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
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
      </section>

      {/* modality band */}
      {specialties.modality ? (
        <section
          className="bg-cover bg-center px-6 py-16 sm:py-20"
          style={{
            backgroundImage: backgroundImage(specialties.modality.backgroundImage),
          }}
        >
          <div className="mx-auto max-w-[1120px] px-8 py-12 text-center sm:px-12 sm:py-14">
            <p className="eyebrow">{specialties.modality.eyebrow}</p>
            <h2 className="heading-module mx-auto mt-4 max-w-[640px]">
              {specialties.modality.heading}
            </h2>
            <PortableContent
              value={specialties.modality.body}
              className="body-2 mx-auto mt-6 max-w-[640px] space-y-4"
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
