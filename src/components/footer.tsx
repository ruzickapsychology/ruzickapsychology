import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FlowerMark } from "@/components/ui/logo";
import { ArrowUpRight } from "@/components/ui/icons";
import { TrackedExternalLink } from "@/components/analytics";
import { site } from "@/content/site";

const links = [
  { label: "About", href: "/about" },
  { label: "Specialties", href: "/specialties" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-fg text-light/80">
      <Container
        size="xl"
        className="grid items-start gap-10 py-16 md:grid-cols-[1fr_1.4fr_1fr]"
      >
        <nav className="flex flex-col gap-2.5">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="mono-label text-[13px] tracking-normal normal-case text-light/80 transition-colors hover:text-accent-soft"
            >
              {l.label}
            </Link>
          ))}
          <TrackedExternalLink
            href={site.portalUrl}
            event="client_portal_click"
            className="mono-label inline-flex items-center gap-1.5 text-[13px] tracking-normal normal-case text-light/80 transition-colors hover:text-accent-soft"
          >
            Client Portal
            <ArrowUpRight />
          </TrackedExternalLink>
        </nav>

        <div className="flex items-center justify-center self-center">
          <Link href="/" aria-label={`${site.name} — home`}>
            <FlowerMark width={58} height={67} color="var(--color-light)" />
          </Link>
        </div>

        <div className="flex flex-col gap-4 text-right font-mono text-[12.5px] leading-relaxed text-light/55">
          <div>
            {site.address.line1}
            <br />
            {site.address.line2}
            <div className="mt-3">{site.address.note}</div>
          </div>
          <div>
            <a
              href={`mailto:${site.email}`}
              className="transition-colors hover:text-accent-soft"
            >
              {site.email}
            </a>
            <br />© {new Date().getFullYear()} {site.legalName}
          </div>
        </div>
      </Container>
    </footer>
  );
}
