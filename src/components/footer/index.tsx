import Link from "next/link";
import { TrackedExternalLink } from "@/components/tracked-external-link";
import { ArrowUpRight } from "@/components/ui/arrow-up-right";
import { Container } from "@/components/ui/container";
import { RotatingFlowerBadge } from "@/components/ui/hero-badge";
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
    <footer className={styles.root}>
      <Container size="xl" className={styles.grid}>
        <nav aria-label="Footer navigation" className={styles.links}>
          {FOOTER_NAV.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`${styles.link} ${MOBILE_FOOTER_LINK_PLACEMENT[l.href] ?? ""}`}
            >
              {l.label}
            </Link>
          ))}
          {siteSettings?.portalUrl ? (
            <TrackedExternalLink
              href={siteSettings.portalUrl}
              event="client_portal_click"
              className={`${styles.link} ${styles.linkPortal}`}
            >
              <span className={styles.portalInner}>
                Client Portal
                <span className={styles.portalIcon}>
                  <ArrowUpRight />
                </span>
              </span>
            </TrackedExternalLink>
          ) : null}
        </nav>

        <div className={styles.badge}>
          {siteSettings?.name ? (
            <Link
              href="/"
              aria-label={`${siteSettings.name} — home`}
              className={styles.badgeLink}
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

        <div className={styles.info}>
          {siteSettings ? (
            <>
              <div>
                {siteSettings.address.line1}
                <br />
                {siteSettings.address.line2.replace("NY", "New York")}
                {siteSettings.address.note ? (
                  <div className={styles.note}>
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
