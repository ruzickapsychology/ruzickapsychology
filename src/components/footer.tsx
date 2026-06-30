import Link from "next/link";
import { Container } from "@/components/ui/container";
import { RotatingFlowerBadge } from "@/components/ui/hero-badge";
import { ArrowUpRight } from "@/components/ui/icons";
import { TrackedExternalLink } from "@/components/analytics";
import type { SiteSettings } from "@/lib/cms";
import { FOOTER_NAV } from "@/lib/site-defaults";
import styles from "./footer.module.css";

const MOBILE_FOOTER_LINK_PLACEMENT: Record<string, string> = {
  "/about": styles.linkAbout,
  "/specialties": styles.linkSpecialties,
  "/pricing": styles.linkPricing,
  "/contact": styles.linkContact,
  "/blog": styles.linkBlog,
  "/faq": styles.linkFaq,
};

export function Footer({
  siteSettings,
}: {
  siteSettings?: SiteSettings | null;
}) {
  return (
    <footer className={`${styles.root} text-light/80`}>
      <Container
        size="xl"
        className={`${styles.grid} site-grid items-start py-16`}
      >
        <nav
          aria-label="Footer navigation"
          className={`${styles.links} order-1 col-span-2 flex flex-col gap-2.5 sm:self-center lg:col-span-3`}
        >
          {FOOTER_NAV.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`mono-label text-light/80 hover:text-accent-soft tracking-normal normal-case transition-colors ${MOBILE_FOOTER_LINK_PLACEMENT[l.href] ?? ""}`}
            >
              {l.label}
            </Link>
          ))}
          {siteSettings?.portalUrl ? (
            <TrackedExternalLink
              href={siteSettings.portalUrl}
              event="client_portal_click"
              className={`${styles.linkPortal} mono-label text-light/80 hover:text-accent-soft inline-block w-fit max-w-full tracking-normal normal-case transition-colors`}
            >
              <span className="inline items-center">
                Client Portal
                <span className="ml-1.5 inline-block align-[-0.08em]">
                  <ArrowUpRight />
                </span>
              </span>
            </TrackedExternalLink>
          ) : null}
        </nav>

        <div
          className={`${styles.badge} grid-full order-3 flex items-center justify-center self-center sm:order-2 sm:col-span-4 sm:col-start-3 lg:col-span-4 lg:col-start-5`}
        >
          {siteSettings?.name ? (
            <Link
              href="/"
              aria-label={`${siteSettings.name} — home`}
              className="relative block h-[190px] w-[190px]"
            >
              <RotatingFlowerBadge
                messages={[
                  siteSettings.name.toUpperCase(),
                  "ROCHESTER, NEW YORK",
                ]}
                pathId="rp-footer-badge-path"
                flowerColor="rgb(241 238 235 / 0.18)"
                flowerClassName="footerFlowerEmboss"
                textColor="var(--color-footer-badge)"
              />
            </Link>
          ) : null}
        </div>

        <div
          className={`${styles.info} mono-label text-light/55 order-2 col-span-2 col-start-3 flex flex-col justify-start gap-4 self-stretch text-left tracking-normal normal-case sm:order-3 sm:col-span-2 sm:col-start-7 sm:self-center sm:text-right lg:col-span-3 lg:col-start-10`}
        >
          {siteSettings ? (
            <>
              <div>
                {siteSettings.address.line1}
                <br />
                {siteSettings.address.line2.replace("NY", "New York")}
                {siteSettings.address.note ? (
                  <div className="mt-3">
                    {siteSettings.address.note.replace("also ", "")}
                  </div>
                ) : null}
              </div>
              <div>
                © {new Date().getFullYear()} {siteSettings.legalName}
              </div>
            </>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
