import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/seo";
import { about } from "@/content/about";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Evidence-based psychotherapy tailored to your goals, with Dr. Christina Ruzicka, Psy.D., Licensed Clinical Psychologist.",
  path: "/about",
});

export default function About() {
  return (
    <Container size="md" className="py-20">
      <h1>{about.heading}</h1>

      <div className="mt-10 space-y-6 leading-relaxed">
        {about.intro.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-greige/50 p-8">
        <h2>Education &amp; Training</h2>
        <ul className="mt-6 space-y-3">
          {about.credentials.map((c) => (
            <li key={c} className="leading-relaxed">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
