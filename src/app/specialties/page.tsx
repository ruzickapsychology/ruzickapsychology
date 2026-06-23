import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SpecialtyGlyph } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/seo";
import { specialties } from "@/content/specialties";

export const metadata: Metadata = pageMetadata({
  title: "Specialties",
  description:
    "Individual therapy, Imago couples counseling, perinatal and postpartum support, and group therapy in Rochester, NY.",
  path: "/specialties",
});

export default function Specialties() {
  return (
    <div className="rp-fade pt-16">
      <section className="py-20">
        <Container size="xl">
          <div className="mb-15 text-center">
            <p className="eyebrow">{specialties.eyebrow}</p>
            <h1 className="mt-4">{specialties.heading}</h1>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {specialties.items.map((s) => (
              <div key={s.title} className="card p-11">
                <div className="mb-5 text-accent">
                  <SpecialtyGlyph icon={s.icon} />
                </div>
                <h3 className="mb-3.5">{s.title}</h3>
                <p className="leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* modality band */}
      <section
        className="bg-cover bg-center px-6 py-24 sm:py-28"
        style={{ backgroundImage: "url(/images/imago-bg.jpg)" }}
      >
        <div className="mx-auto max-w-[1120px] rounded-[32px] border border-light/35 bg-surface/20 px-8 py-20 text-center shadow-[0_24px_60px_rgba(58,35,40,0.18)] backdrop-blur-[2px] sm:px-12">
          <p className="eyebrow">{specialties.modality.eyebrow}</p>
          <h2 className="mx-auto mt-4 max-w-[640px] text-[clamp(1.8rem,4vw,38px)]">
            {specialties.modality.heading}
          </h2>
          <div className="mx-auto mt-6 max-w-[640px] space-y-4 text-[17px] leading-relaxed">
            {specialties.modality.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
