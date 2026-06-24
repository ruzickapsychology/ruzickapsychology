import Link from "next/link";
import { Container } from "@/components/ui/container";
import { RotatingFlowerBadge } from "@/components/ui/hero-badge";
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
    <footer className="footer-grain text-light/80">
      <Container
        size="xl"
        className="grid items-start gap-10 py-16 md:grid-cols-[1fr_1.4fr_1fr]"
      >
        <nav className="flex flex-col gap-2.5">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="mono-label tracking-normal normal-case text-light/80 transition-colors hover:text-accent-soft"
            >
              {l.label}
            </Link>
          ))}
          <TrackedExternalLink
            href={site.portalUrl}
            event="client_portal_click"
            className="mono-label inline-flex items-center gap-1.5 tracking-normal normal-case text-light/80 transition-colors hover:text-accent-soft"
          >
            Client Portal
            <ArrowUpRight />
          </TrackedExternalLink>
        </nav>

        <div className="flex items-center justify-center self-center">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="relative block h-[190px] w-[190px]"
          >
            <RotatingFlowerBadge
              messages={[site.name.toUpperCase(), "ROCHESTER, NEW YORK"]}
              pathId="rp-footer-badge-path"
              flowerColor="rgb(241 238 235 / 0.18)"
              flowerClassName="footer-flower-emboss"
            />
          </Link>
        </div>

        <div className="mono-label flex flex-col justify-center gap-4 self-stretch text-right tracking-normal normal-case text-light/55">
          <div>
            {site.address.line1}
            <br />
            {site.address.line2.replace("NY", "New York")}
            <div className="mt-3">{site.address.note}</div>
          </div>
          <div>
            {site.email}
            <br />
            {site.phone}
            <br />© {new Date().getFullYear()} {site.legalName}
          </div>
        </div>
      </Container>
    </footer>
  );
}
