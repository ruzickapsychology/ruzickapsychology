import Link from "next/link";
import { Container } from "@/components/ui/container";
import { RotatingFlowerBadge } from "@/components/ui/hero-badge";
import { ArrowUpRight } from "@/components/ui/icons";
import { TrackedExternalLink } from "@/components/analytics";
import type { SiteSettings } from "@/lib/cms";
import { FOOTER_NAV } from "@/lib/site-defaults";

export function Footer({ siteSettings }: { siteSettings?: SiteSettings | null }) {
  return (
    <footer className="footer-grain text-light/80">
      <Container
        size="xl"
        className="grid items-start gap-10 py-16 md:grid-cols-[1fr_1.4fr_1fr]"
      >
        <nav className="flex flex-col gap-2.5">
          {FOOTER_NAV.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="mono-label tracking-normal normal-case text-light/80 transition-colors hover:text-accent-soft"
            >
              {l.label}
            </Link>
          ))}
          {siteSettings?.portalUrl ? (
            <TrackedExternalLink
              href={siteSettings.portalUrl}
              event="client_portal_click"
              className="mono-label inline-flex items-center gap-1.5 tracking-normal normal-case text-light/80 transition-colors hover:text-accent-soft"
            >
              Client Portal
              <ArrowUpRight />
            </TrackedExternalLink>
          ) : null}
        </nav>

        <div className="flex items-center justify-center self-center">
          {siteSettings?.name ? (
            <Link
              href="/"
              aria-label={`${siteSettings.name} — home`}
              className="relative block h-[190px] w-[190px]"
            >
              <RotatingFlowerBadge
                messages={[siteSettings.name.toUpperCase(), "ROCHESTER, NEW YORK"]}
                pathId="rp-footer-badge-path"
                flowerColor="rgb(241 238 235 / 0.18)"
                flowerClassName="footer-flower-emboss"
                textColor="#685B5F"
              />
            </Link>
          ) : null}
        </div>

        <div className="mono-label flex flex-col justify-center gap-4 self-stretch text-right tracking-normal normal-case text-light/55">
          {siteSettings ? (
            <>
              <div>
                {siteSettings.address.line1}
                <br />
                {siteSettings.address.line2.replace("NY", "New York")}
                <div className="mt-3">{siteSettings.address.note}</div>
              </div>
              <div>
                {siteSettings.email}
                <br />© {new Date().getFullYear()} {siteSettings.legalName}
              </div>
            </>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
